# Render Deployment Guide 🚀

Complete step-by-step guide to deploy your FocusAI backend on Render.

---

## Prerequisites

- ✅ Code pushed to GitHub: https://github.com/Developbyravi/FocusAI
- ✅ Grok API Key from https://console.x.ai
- ✅ Render account (sign up at https://render.com - free)

---

## Step 1: Sign Up / Login to Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign up with:
   - GitHub (Recommended - easier integration)
   - GitLab
   - Email

**Recommended**: Use GitHub login for seamless repository access

---

## Step 2: Create New Web Service

### 2.1 Access Dashboard
- After login, you'll see the Render Dashboard
- Click the **"New +"** button (top right corner)
- Select **"Web Service"** from the dropdown

### 2.2 Connect Repository
You'll see "Create a new Web Service" page with options:

**Option A: If you logged in with GitHub (Recommended)**
- Your repositories will be listed automatically
- Find **"Developbyravi/FocusAI"** in the list
- Click **"Connect"** button next to it

**Option B: If you used email login**
- Click **"Connect GitHub"** or **"Connect GitLab"**
- Authorize Render to access your repositories
- Select **"Developbyravi/FocusAI"**
- Click **"Connect"**

---

## Step 3: Configure Web Service

Render will auto-detect your `render.yaml` file and pre-fill most settings.

### 3.1 Basic Settings (Auto-filled from render.yaml)

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `focusai-backend` | You can change this |
| **Region** | `Oregon (US West)` | Choose closest to your users |
| **Branch** | `main` | Auto-detected |
| **Root Directory** | (leave empty) | Uses repository root |
| **Environment** | `Node` | Auto-detected |
| **Build Command** | `cd server && npm install` | From render.yaml |
| **Start Command** | `cd server && npm start` | From render.yaml |

### 3.2 Plan Selection
- Select **"Free"** plan (perfect for testing)
- Free tier includes:
  - 750 hours/month
  - Spins down after 15 min inactivity
  - 512 MB RAM
  - Shared CPU

**Note**: Service will take 30-60 seconds to wake up after inactivity on free tier.

---

## Step 4: Add Environment Variables

This is the **MOST IMPORTANT** step!

### 4.1 Scroll to "Environment Variables" Section

You'll see a section to add environment variables. Add these:

#### Required Variables:

**1. GROK_API_KEY** (REQUIRED)
```
Key: GROK_API_KEY
Value: xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Get this from https://console.x.ai
- Click **"Add Environment Variable"**

**2. GROK_API_URL** (Auto-set from render.yaml)
```
Key: GROK_API_URL
Value: https://api.x.ai/v1
```
- Should already be set from render.yaml
- If not, add it manually

**3. NODE_ENV** (Auto-set from render.yaml)
```
Key: NODE_ENV
Value: production
```
- Should already be set
- If not, add it manually

**4. PORT** (Auto-set from render.yaml)
```
Key: PORT
Value: 10000
```
- Should already be set
- Render uses port 10000 internally

#### Optional Variables:

**5. MONGODB_URI** (Optional)
```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/focusai
```
- Only add if you're using MongoDB
- App works fine without it

### 4.2 How to Add Environment Variables

For each variable:
1. Click **"Add Environment Variable"** button
2. Enter the **Key** (e.g., `GROK_API_KEY`)
3. Enter the **Value** (your actual API key)
4. Click outside the field or press Enter

---

## Step 5: Deploy

### 5.1 Create Web Service
- Review all settings
- Scroll to bottom
- Click **"Create Web Service"** button (big blue button)

### 5.2 Wait for Deployment
- Render will start building your service
- You'll see a live log stream showing:
  ```
  ==> Cloning from https://github.com/Developbyravi/FocusAI...
  ==> Running build command: cd server && npm install
  ==> Installing dependencies...
  ==> Build successful!
  ==> Starting service...
  ==> FocusAI server running on http://localhost:10000
  ```

**Deployment time**: Usually 2-5 minutes

### 5.3 Deployment Complete
When you see:
- ✅ Green "Live" badge at the top
- "Your service is live" message
- No errors in logs

Your backend is deployed! 🎉

---

## Step 6: Get Your Backend URL

### 6.1 Find Your URL
At the top of the page, you'll see your service URL:
```
https://focusai-backend.onrender.com
```
or
```
https://focusai-backend-xxxx.onrender.com
```

### 6.2 Copy the URL
- Click the **copy icon** next to the URL
- Or manually copy the full URL
- **Save this URL** - you'll need it for Netlify!

---

## Step 7: Test Your Backend

### 7.1 Test Health Endpoint
Open your browser and visit:
```
https://your-backend-url.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FocusAI server running"
}
```

### 7.2 If You See This - SUCCESS! ✅
Your backend is working correctly!

### 7.3 If You See Errors ❌
Check the following:

**"Application failed to respond"**
- Wait 30-60 seconds (free tier wake-up time)
- Refresh the page
- Check logs in Render dashboard

**"Internal Server Error"**
- Check environment variables are set correctly
- Verify `GROK_API_KEY` is valid
- Check logs for specific errors

---

## Step 8: View Logs (Troubleshooting)

### 8.1 Access Logs
- In Render dashboard, click on your service
- Click **"Logs"** tab (left sidebar)
- You'll see real-time logs

### 8.2 Common Log Messages

**✅ Good:**
```
FocusAI server running on http://localhost:10000
MongoDB optional - skipping: [error message]
```

**❌ Problems:**
```
Error: GROK_API_KEY is not defined
```
→ Add the environment variable

```
Error: Cannot find module 'express'
```
→ Rebuild: Settings → Manual Deploy → Deploy latest commit

---

## Step 9: Important URLs to Save

After deployment, save these:

| Item | URL | Purpose |
|------|-----|---------|
| **Backend URL** | `https://focusai-backend.onrender.com` | For Netlify config |
| **Health Check** | `https://focusai-backend.onrender.com/api/health` | Test endpoint |
| **Render Dashboard** | `https://dashboard.render.com` | Manage service |
| **Service Logs** | Dashboard → Your Service → Logs | Debug issues |

---

## Step 10: Update Your Local Files

Now that you have your backend URL, update these files:

### 10.1 Update client/.env.production
```env
REACT_APP_API_URL=https://focusai-backend.onrender.com
```
Replace with your actual Render URL (no trailing slash)

### 10.2 Update netlify.toml
Find line 7 and update:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://focusai-backend.onrender.com/api/:splat"
  status = 200
  force = true
```

### 10.3 Update client/public/_redirects
Update line 2:
```
/api/*  https://focusai-backend.onrender.com/api/:splat  200
```

### 10.4 Commit and Push
```bash
cd focusai
git add .
git commit -m "Update backend URL for production"
git push origin main
```

---

## Render Dashboard Overview

### Key Sections:

**1. Overview Tab**
- Service status (Live/Building/Failed)
- Recent deployments
- Quick stats

**2. Logs Tab**
- Real-time application logs
- Build logs
- Error messages

**3. Environment Tab**
- View/edit environment variables
- Add new variables
- Delete variables

**4. Settings Tab**
- Change plan (Free → Paid)
- Auto-deploy settings
- Delete service

**5. Metrics Tab** (Paid plans only)
- CPU usage
- Memory usage
- Request metrics

---

## Auto-Deploy Setup

Render automatically deploys when you push to GitHub!

### How it Works:
1. You push code to GitHub
2. Render detects the push
3. Automatically rebuilds and deploys
4. Takes 2-5 minutes

### Disable Auto-Deploy:
- Settings → Auto-Deploy
- Toggle off if you want manual control

---

## Free Tier Limitations

### What You Get:
- ✅ 750 hours/month (enough for 24/7 if only one service)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Unlimited bandwidth

### Limitations:
- ⏱️ Spins down after 15 minutes of inactivity
- ⏱️ Takes 30-60 seconds to wake up
- 💾 512 MB RAM
- 🔄 Shared CPU

### Upgrade to Paid ($7/month):
- Always-on (no spin down)
- More RAM and CPU
- Faster performance
- Metrics and monitoring

---

## Troubleshooting Common Issues

### Issue 1: Build Failed
**Error**: `npm install failed`

**Solution**:
- Check `server/package.json` is valid JSON
- Verify all dependencies are listed
- Check build logs for specific error
- Try manual deploy: Settings → Manual Deploy

### Issue 2: Service Won't Start
**Error**: `Application failed to respond`

**Solution**:
- Verify `PORT` environment variable is set to `10000`
- Check start command: `cd server && npm start`
- Review logs for startup errors
- Ensure `server/index.js` exists

### Issue 3: Environment Variables Not Working
**Error**: `GROK_API_KEY is not defined`

**Solution**:
- Go to Environment tab
- Verify variable name is exactly `GROK_API_KEY` (case-sensitive)
- Check for extra spaces in key or value
- Save and manually redeploy

### Issue 4: CORS Errors
**Error**: Frontend can't connect to backend

**Solution**:
- Backend already has CORS enabled in `server/index.js`
- Verify backend URL in frontend is correct
- Check backend is actually running (visit health endpoint)
- Ensure no trailing slash in API URL

### Issue 5: MongoDB Connection Failed
**Error**: `MongoDB connection error`

**Solution**:
- MongoDB is optional - app works without it
- If using MongoDB:
  - Verify `MONGODB_URI` format
  - Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0`)
  - Verify username/password are correct

---

## Next Steps

✅ Backend deployed on Render
✅ Backend URL copied
✅ Health endpoint tested
✅ Local files updated with backend URL

**Now proceed to**: [NETLIFY_GUIDE.md](./NETLIFY_GUIDE.md)

---

## Quick Reference

### Essential Commands
```bash
# View logs
# Go to: Dashboard → Your Service → Logs

# Manual deploy
# Go to: Settings → Manual Deploy → Deploy latest commit

# Restart service
# Go to: Settings → Restart Service

# View environment variables
# Go to: Environment tab
```

### Important Links
- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Support: https://render.com/support

---

**🎉 Backend Deployment Complete!**

Your backend URL: `https://focusai-backend.onrender.com`

Next: Deploy frontend on Netlify → [NETLIFY_GUIDE.md](./NETLIFY_GUIDE.md)
