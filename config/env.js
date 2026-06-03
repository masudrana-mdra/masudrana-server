import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(10000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  MONGODB_URI: z.string().url('MONGODB_URI must be a valid URL'),
  MONGODB_DB: z.string().min(1, 'MONGODB_DB must not be empty'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET must not be empty'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET must not be empty'),
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL must not be empty'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID must not be empty'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET must not be empty'),
  ADMIN_EMAILS: z.string().min(1, 'ADMIN_EMAILS must not be empty'),
  EMAIL_USER: z.string().email('EMAIL_USER must be a valid email'),
  EMAIL_PASS: z.string().min(1, 'EMAIL_PASS must not be empty'),
});

let validatedEnv;
try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ CRITICAL: Invalid Server Environment Variables:');
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error(error);
  }
  process.exit(1);
}

export default validatedEnv;
