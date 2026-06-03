import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { admin } from 'better-auth/plugins';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { sendEmail } from '../utils/email.js';

let authInstance = null;

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) => getAdminEmails().includes(String(email || '').toLowerCase());

const listOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

const getBackendBaseURL = () => {
  // Better Auth baseURL should NOT include /api/auth path
  // Better Auth automatically uses /api/auth as basePath
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL;
  return `http://localhost:${process.env.PORT || 10000}`;
};

export async function getAuth() {
  if (authInstance) return authInstance;

  // Make sure Mongoose is connected
  await connectDB();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection is active but db instance is undefined.');
  }

  // Validate required environment variables
  if (!process.env.BETTER_AUTH_SECRET) {
    console.warn('Warning: BETTER_AUTH_SECRET not set, using JWT_SECRET');
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('Warning: GOOGLE_CLIENT_ID not set, Google OAuth will be disabled');
  }

  const baseURL = getBackendBaseURL();
  console.log(`[Auth] Initializing Better Auth with baseURL: ${baseURL}`);

  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,
    baseURL: baseURL,
    trustedOrigins: [
      ...listOrigins(process.env.CLIENT_URL),
      'http://localhost:3000',
      'http://localhost:3001',
    ].filter(Boolean),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: true,
      sendResetPassword: async ({ user, url }) => {
        try {
          const resetHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                  .header { background: linear-gradient(135deg, #2563eb, #1e4ed8); padding: 30px 20px; text-align: center; color: #ffffff; }
                  .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
                  .content { padding: 30px; text-align: center; }
                  .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
                  .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 28px; }
                  .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); }
                  .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Masud Rana Portfolio</h1>
                  </div>
                  <div class="content">
                    <div class="title">Reset Your Password</div>
                    <p class="text">
                      Hello ${user.name || 'User'},<br><br>
                      We received a request to reset your password. Click the button below to set a new password. This link is valid for 1 hour.
                    </p>
                    <a href="${url}" class="cta-button">Reset Password</a>
                    <p class="text" style="margin-top: 28px; font-size: 12px;">
                      If you didn't request this, you can safely ignore this email.
                    </p>
                  </div>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} Masud Rana. All rights reserved.
                  </div>
                </div>
              </body>
            </html>
          `;
          await sendEmail({
            to: user.email,
            subject: 'Reset your password - Masud Rana Portfolio',
            html: resetHtml,
          });
        } catch (err) {
          console.error('Failed to send reset password email:', err.message);
        }
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        enabled: !!process.env.GOOGLE_CLIENT_ID,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
      },
    },
    databaseHooks: {
      user: {
        create: {
          async before(user) {
            const role = isAdminEmail(user.email) ? 'admin' : 'user';
            return {
              data: {
                ...user,
                role,
              },
            };
          },
        },
      },
    },
    plugins: [
      admin({
        defaultRole: 'user',
        adminRoles: ['admin'],
      }),
    ],
    advanced: {
      defaultCookieAttributes: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        partitioned: process.env.NODE_ENV === 'production',
      },
    },
  });

  console.log(`[Auth] Better Auth initialized successfully`);
  console.log(`[Auth] Google OAuth enabled: ${!!process.env.GOOGLE_CLIENT_ID}`);
  
  // Log available properties and methods for debugging
  if (authInstance.api) {
    console.log(`[Auth] Auth.api available, keys:`, Object.keys(authInstance.api).slice(0, 15));
  }
  
  return authInstance;
}
