# 🎯 Quick Deployment Checklist

## 🔴 Before Deploying to Render

### Local Testing
- [ ] Delete `Server/node_modules` and `package-lock.json`
- [ ] Run `npm install` in Server directory
- [ ] Run `npm run dev` and verify:
  - ✓ BSON compatibility verified (appears in console)
  - ✓ Server running on port 10000
  - ✓ MongoDB Connected message
  - ✓ No errors in logs

### Test API Endpoints
```bash
# In separate terminal, test:
curl http://localhost:10000/api/health
# Should return 200 with {"success":true,"status":"OK",...}
```

### Test OAuth (if running frontend locally)
- [ ] Navigate to http://localhost:3001/login
- [ ] Click "Sign in with Google"
- [ ] Should redirect to Google OAuth (not error 500)

---

## 🟢 Deploy to Render

### 1. Push Changes
```bash
cd Server
git add package.json utils/bsonCompat.js server.js
git commit -m "fix: BSON version compatibility for production"
git push origin main
```

### 2. Render Deployment Options

**Option A: Automatic (if GitHub connected)**
- Changes auto-deploy when pushed
- Wait 5-10 minutes for build

**Option B: Manual Deploy via Render Dashboard**
1. Log in to [render.com](https://render.com)
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for build to complete

### 3. Verify Production Deployment

In **Render Dashboard → Logs**, you should see:
```
✓ BSON compatibility verified
Server running in production mode on port 10000
MongoDB Connected: ac-rmhvcot-shard-00-02.e83eryn.mongodb.net
```

---

## 🧪 Post-Deployment Verification

### 1. Health Check
```bash
curl https://your-backend.onrender.com/api/health
```
Expected response (200):
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-06-03T...",
  "uptime": 123.45,
  "dbState": "connected"
}
```

### 2. Test OAuth
1. Go to your Vercel frontend URL
2. Click "Sign in with Google" on login page
3. Should NOT see:
   - `Cannot GET /api/api/auth/sign-in/social`
   - `BSONVersionError`
   - `500 Internal Server Error`
4. Should see Google OAuth redirect

### 3. Check Logs for Errors
In Render Dashboard → Logs:
- ✅ No `BSONVersionError`
- ✅ No `Unsupported BSON version`
- ✅ MongoDB connection success message
- ✅ BSON compatibility verified

---

## 🆘 If Deployment Fails

### Quick Fixes

1. **Clear Build Cache**
   - Render Dashboard → Settings
   - Find "Clear build cache"
   - Re-deploy

2. **Verify Environment Variables**
   - Check Render dashboard for all required vars
   - Ensure no typos in:
     - `MONGODB_URI`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `CLIENT_URL` (your Vercel URL)

3. **Check Package Lock**
   ```bash
   cd Server
   npm ci  # Clean install locally to verify package-lock.json
   ```

4. **Review Detailed Logs**
   - Click on deployment in Render
   - Check full build logs for errors
   - Look for version conflicts

---

## 📞 Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| `BSONVersionError` still occurs | Clear Render build cache → Re-deploy |
| `BSON compatibility verified` missing | Check if package.json changes were deployed |
| OAuth redirect fails | Verify `CLIENT_URL` env var in Render |
| MongoDB connection fails | Check MongoDB Atlas IP whitelist (add Render IP) |
| 500 on `/api/auth/sign-in/social` | Check Render logs for BSON errors |

---

## ✅ Success Indicators

✨ You'll know it's working when:
- [ ] BSON compatibility message appears on startup
- [ ] No BSON version errors in Render logs
- [ ] OAuth login completes without 500 errors
- [ ] User data is saved to MongoDB correctly
- [ ] Session tokens are issued properly

---

## 📋 Files Modified

| File | Changes |
|------|---------|
| `Server/package.json` | Updated mongoose, added bson, enhanced overrides, added postinstall |
| `Server/server.js` | Added BSON compatibility check at startup |
| `Server/utils/bsonCompat.js` | NEW - BSON version validation & utilities |
| `Server/PRODUCTION_DEPLOYMENT_FIX.md` | NEW - Comprehensive guide |

---

## 🚀 Next Steps

1. ✅ Follow local testing steps above
2. ✅ Commit and push changes
3. ✅ Monitor Render deployment
4. ✅ Verify production endpoints
5. ✅ Test OAuth flow end-to-end
6. ✅ Monitor logs for 24 hours

---

**Estimated Time**: 15-20 minutes from commit to verified deployment

**Questions?** Check `PRODUCTION_DEPLOYMENT_FIX.md` for detailed explanations
