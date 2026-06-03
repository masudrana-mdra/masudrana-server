import jwt from 'jsonwebtoken';
import { fromNodeHeaders } from 'better-auth/node';
import User from '../models/User.js';
import { getAuth, isAdminEmail } from '../lib/auth.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Try to verify using Better Auth session first
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session && session.user) {
      const email = session.user.email;
      const role = isAdminEmail(email) ? 'admin' : (session.user.role || 'user');
      
      // Populate req.user in a format compatible with Mongoose controllers
      req.user = {
        _id: session.user.id,
        id: session.user.id,
        username: session.user.name || email.split('@')[0],
        name: session.user.name,
        email: email,
        role: role,
        image: session.user.image,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      };
      return next();
    }
  } catch (error) {
    console.error('Better Auth check error in middleware:', error.message);
  }

  // 2. Fallback to legacy JWT token in cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no session or token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found or deleted' });
    }

    next();
  } catch (error) {
    console.error('JWT auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied, administrator role required' });
  }
};

