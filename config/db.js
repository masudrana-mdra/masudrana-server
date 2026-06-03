import mongoose from 'mongoose';

const withDatabaseName = (uri) => {
  if (!process.env.MONGODB_DB) return uri;

  try {
    const parsed = new URL(uri);
    if (parsed.pathname && parsed.pathname !== '/') return uri;

    parsed.pathname = `/${process.env.MONGODB_DB}`;
    return parsed.toString();
  } catch (error) {
    return uri;
  }
};

// Global cache for connection to prevent duplicate pooling in serverless/restart environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async (retryCount = 5, delayMs = 5000) => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('CRITICAL: Missing MONGODB_URI or MONGO_URI environment variable');
  }

  mongoose.set('strictQuery', true);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      let currentDelay = delayMs;
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const conn = await mongoose.connect(withDatabaseName(mongoUri), {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
            heartbeatFrequencyMS: 10000,
          });
          console.log(`MongoDB Connected: ${conn.connection.host}`);
          cached.conn = conn;
          return conn;
        } catch (error) {
          console.error(`MongoDB Connection Attempt ${attempt}/${retryCount} Failed: ${error.message}`);
          if (attempt === retryCount) {
            cached.promise = null; // Clear promise so retry can happen on next request
            throw error;
          }
          console.log(`Retrying database connection in ${currentDelay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay = currentDelay * 1.5;
        }
      }
    })();
  }

  try {
    return await cached.promise;
  } catch (error) {
    console.error('Failed to resolve MongoDB connection promise:', error.message);
    throw error;
  }
};

export default connectDB;

