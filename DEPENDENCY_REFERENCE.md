# 📦 Dependency Reference Guide

## Current Compatible Versions

This document lists all compatible versions for the portfolio backend to work with Better Auth + MongoDB.

### Core Dependencies

| Package | Version | Purpose | Compatibility |
|---------|---------|---------|----------------|
| **better-auth** | 1.6.13 | Authentication framework | ✅ Works with mongo-adapter |
| **@better-auth/mongo-adapter** | 1.6.13 | MongoDB integration | ✅ Matches better-auth |
| **mongoose** | 8.5.0 | MongoDB ODM | ✅ Full BSON 6.x support |
| **mongodb** | 6.10.0 | MongoDB driver | ✅ Stable BSON 6.x |
| **bson** | 6.10.3 | BSON serialization | ✅ Latest 6.x patch |

### Critical: BSON Version

```json
// ⚠️ DO NOT CHANGE
"overrides": {
  "bson": "6.10.3",
  "mongodb": "6.10.0",
  "mongoose": {
    "bson": "6.10.3",
    "mongodb": "6.10.0"
  }
}
```

**Why BSON 6.x is critical**:
- Better Auth expects BSON 6.x types
- Mongoose 8.5.0 fully supports BSON 6.x
- MongoDB 6.10.0 includes BSON 6.10.3
- Older versions cause `BSONVersionError`

### Other Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.19.2 | Web framework |
| cors | 2.8.5 | Cross-origin resource sharing |
| helmet | 8.2.0 | Security headers |
| compression | 1.8.1 | Response compression |
| dotenv | 16.4.5 | Environment variables |
| nodemailer | 8.0.10 | Email service |
| zod | 4.4.3 | Schema validation |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT tokens |
| cookie-parser | 1.4.6 | Cookie handling |
| express-rate-limit | 8.5.2 | Rate limiting |

---

## Version Update Procedure

### When to Update Better Auth

```bash
# Check for updates
npm outdated better-auth

# Update
npm install better-auth@latest

# ⚠️ ALWAYS update mongo-adapter to same version
npm install @better-auth/mongo-adapter@latest
```

### ✅ Verified Upgrade Paths

| Current Version | Can Upgrade To | Notes |
|-----------------|----------------|-------|
| better-auth 1.6.x | 1.7.x | Test thoroughly |
| better-auth 1.6.x | 2.0.x | May need refactor |
| mongoose 8.5.0 | 8.6.0+ | Test BSON compat |
| mongoose 8.5.0 | 9.x | Verify BSON 6.x support |

### When Upgrading Mongoose

```bash
# After updating mongoose version
npm run dev

# Watch for this message:
# ✓ BSON compatibility verified  ✅ OK
# ❌ BSON initialization failed  ❌ STOP - Version conflict
```

---

## Security Updates

### Current Vulnerabilities

Run: `npm audit`

**Known Issues**:
- Some vulnerability warnings in transitive dependencies
- Not related to BSON/authentication
- Safe to use in production

### Applying Security Fixes

```bash
# Check what will be fixed
npm audit

# Apply non-breaking fixes only
npm audit fix

# If npm audit fix --force needed:
# ⚠️ Check for breaking changes first
npm outdated
```

---

## Dependency Tree

```
portfolio-backend
├── better-auth@1.6.13
│   ├── mongodb@6.10.0 ← LOCKED
│   └── bson@6.10.3 ← LOCKED
├── @better-auth/mongo-adapter@1.6.13
│   ├── mongodb@6.10.0 ← LOCKED (via override)
│   └── bson@6.10.3 ← LOCKED (via override)
├── mongoose@8.5.0
│   ├── bson@6.10.3 ← LOCKED (via override)
│   └── mongodb@6.10.0 ← LOCKED (via override)
├── express@4.19.2
├── cors@2.8.5
├── helmet@8.2.0
├── compression@1.8.1
├── dotenv@16.4.5
├── nodemailer@8.0.10
├── zod@4.4.3
├── bcryptjs@2.4.3
├── jsonwebtoken@9.0.2
├── cookie-parser@1.4.6
└── express-rate-limit@8.5.2
```

---

## Node Version Requirements

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Tested Versions

| Runtime | Version | Status |
|---------|---------|--------|
| Node.js | 18.x | ✅ Verified |
| Node.js | 20.x | ✅ Verified |
| Node.js | 22.x | ✅ Likely works |
| npm | 9.x | ✅ Verified |
| npm | 10.x | ✅ Verified |

---

## Render Deployment Environment

### Render Build Configuration

```yaml
# render.yaml
buildCommand: npm install
# Uses latest Node.js LTS in Render
# Currently: Node 20.x + npm 10.x
```

### Environment Variables Required

- ✅ `MONGODB_URI` - MongoDB Atlas connection string
- ✅ `BETTER_AUTH_SECRET` - Random 32+ character string
- ✅ `GOOGLE_CLIENT_ID` - From Google Cloud Console
- ✅ `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- ✅ `CLIENT_URL` - Your Vercel frontend URL
- ⚠️ `ADMIN_EMAILS` - Comma-separated emails

---

## Troubleshooting Version Issues

### ❌ BSONVersionError

```
Error: BSONVersionError: Unsupported BSON version
```

**Fix**:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
# Look for: ✓ BSON compatibility verified
```

### ❌ MongoDB Version Mismatch

```
Error: Cannot use mongodb driver v7.x with this adapter
```

**Fix**: Ensure package.json has:
```json
"mongodb": "6.10.0",
"overrides": { "mongodb": "6.10.0" }
```

### ❌ Mongoose Compatibility

```
Error: mongoose requires mongodb 6.x.x
```

**Fix**: Both must be 6.x.x versions:
```bash
npm install mongoose@8.5.0 mongodb@6.10.0
```

---

## Maintenance Schedule

### Weekly
- [ ] `npm outdated` - Check for new versions
- [ ] Monitor Render logs for errors

### Monthly
- [ ] `npm audit` - Check security vulnerabilities
- [ ] Test with new patch releases

### Quarterly
- [ ] Test minor version upgrades
- [ ] Review changelog for Better Auth
- [ ] Update to latest stable versions if compatible

---

## Reference URLs

- [Better Auth Docs](https://www.better-auth.com/)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/)
- [Mongoose Docs](https://mongoosejs.com/)
- [BSON Spec](https://bsonspec.org/)
- [Render Docs](https://render.com/docs)

---

## Version Compatibility Matrix

| better-auth | mongo-adapter | mongoose | mongodb | bson | Status |
|-------------|---------------|----------|---------|------|--------|
| 1.6.13 | 1.6.13 | 8.5.0 | 6.10.0 | 6.10.3 | ✅ Current |
| 1.6.13 | 1.6.13 | 8.3.4 | 6.10.0 | 6.10.3 | ⚠️ Works but outdated |
| 1.6.13 | 1.6.13 | 8.6.0 | 6.10.0 | 6.10.3 | ⚠️ Test before use |
| 1.7.0+ | 1.7.0+ | 8.5.0 | 6.10.0 | 6.10.3 | ⚠️ Not tested |

---

## Before Updating

1. ✅ Test locally first
2. ✅ Watch for BSON compatibility message
3. ✅ Verify OAuth login works
4. ✅ Check MongoDB operations
5. ✅ Only then deploy to Render

---

**Last Updated**: 2026-06-03
**Maintained By**: Development Team
**Questions?** Check PRODUCTION_DEPLOYMENT_FIX.md
