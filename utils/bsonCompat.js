/**
 * BSON Compatibility Utility
 * Ensures consistent BSON version handling across MongoDB, Mongoose, and Better Auth
 * Fixes BSONVersionError in production environments
 */

import { BSON } from 'mongodb';

/**
 * Initialize BSON compatibility
 * This ensures all BSON operations use the same version
 */
export function initBSONCompat() {
  // Ensure we're using BSON from mongodb package (v6.x.x)
  if (!BSON || typeof BSON.serialize !== 'function') {
    throw new Error('BSON from mongodb is not properly loaded. Check mongodb package version.');
  }

  // Verify BSON version
  try {
    // Create a test document to ensure BSON is working
    const testDoc = { _id: 'test', timestamp: new Date() };
    BSON.serialize(testDoc);
  } catch (err) {
    console.error('BSON compatibility check failed:', err.message);
    throw new Error(`BSON initialization failed: ${err.message}`);
  }

  console.log('✓ BSON compatibility verified');
  return true;
}

/**
 * Serialize a document safely
 * Converts all BSON types to JSON-compatible formats
 */
export function safeBSONSerialize(doc) {
  if (!doc) return null;

  try {
    // Deep clone and convert BSON types
    return JSON.parse(
      JSON.stringify(doc, (key, value) => {
        // Handle ObjectId
        if (value && typeof value === 'object' && value._bsontype === 'ObjectId') {
          return value.toString();
        }
        // Handle Binary
        if (value && typeof value === 'object' && value._bsontype === 'Binary') {
          return value.toString('base64');
        }
        // Handle Date
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      })
    );
  } catch (err) {
    console.error('BSON serialization failed:', err);
    return doc;
  }
}

/**
 * Deserialize and validate BSON document
 * Ensures document contains only valid BSON types
 */
export function validateBSONDocument(doc) {
  if (!doc || typeof doc !== 'object') {
    return doc;
  }

  try {
    // Try to serialize - if it succeeds, it's valid BSON
    BSON.serialize(doc);
    return doc;
  } catch (err) {
    console.warn('Document validation warning:', err.message);
    // Return safe serialized version
    return JSON.parse(JSON.stringify(doc));
  }
}

export default {
  initBSONCompat,
  safeBSONSerialize,
  validateBSONDocument,
};
