# Netlify Deployment Guide 🚀

Complete step-by-step guide to deploy your FocusAI frontend on Netlify.

---

## Prerequisites

- ✅ Backend deployed on Render (see [RENDER_GUIDE.md](./RENDER_GUIDE.md))
- ✅ Backend URL copied (e.g., `https://focusai-backend.onrender.com`)
- ✅ Code pushed to GitHub: https://github.com/Developbyravi/FocusAI
- ✅ Netlify account (sign up at https://netlify.com - free)

---

## IMPORTANT: Update Files First!

Before deploying to Netlify, you MUST update these files with your actual Render backend URL.

### File 1: client/.env.production
```env
REACT_APP_API_URL=https://focusai-backend.onrender.com
```
Replace `focusai-backend.onrender.com` with YOUR actual Render URL

### File 2: netlify.toml (line 7)
```toml
[[redirects]]
  from = "/api/*"
  to = "https://focusai-backend.onrender.com/api/:splat"
  status = 200
  force = true
```
Replace with YOUR actual Render URL

### File 3: client/public/_redirects (line 2)
```
/api/*  https://focusai-backend.onrender.com/api/:splat  200
```
Replace with YOUR actual Render URL

### Commit and Push Changes
```bash
cd focusai
git add .
git commit -m "Update backend URL for production"
git push origin main
```

**⚠️ DO NOT SKIP THIS STEP!** Your frontend won't connect to backend without these updates.

---

## Step 1: Sign Up / Login to Netlify

1. Go to **https://app.netlify.com**
2. Click **"Sign up"** or **"Log in"**
3. Sign up with:
   - GitHub (Recommended - easier integration)
   - GitLab
   - Bitbucket
   - Email

**Recommended**: Use GitHub login for seamless repository access

---

## Step 2: Create New Site

### 2.1 Access Dashboard
- After login, you'll see the Netlify Dashboard
- You'll see "Sites" page with your existing sites (if any)

### 2.2 Add New Site
Click one of these options:
- **"Add new site"** button (top right)
- **"Import an existing project"** button (center)

Both do the same thing!

---

## Step 3: Connect to Git Provider

### 3.1 Choose Git Provider
You'll see "Import an existing project" page with options:
- **GitHub** (Recommended)
- GitLab
- Bitbucket
- Azure DevOps

Click **"GitHub"**

### 3.2 Authorize Netlify (First Time Only)
If this is your first time:
1. Click **"Authorize Netlify"**
2. GitHub will ask for permissions
3. Click **"Authorize netlify"**
4. You may need to enter your GitHub password

### 3.3 Configure Netlify Access
You'll see "Configure the Netlify app on GitHub":

**Option A: All repositories** (Easier)
- Select "All repositories"
- Click "Install"

**Option B: Only select repositories** (More secure)
- Select "Only select repositories"
- Choose **"Developbyravi/FocusAI"**
- Click "Install"

---

## Step 4: Select Repository

### 4.1 Find Your Repository
- You'll see a list of your GitHub repositories
- Search for **"FocusAI"** in the search box
- Or scroll to find **"Developbyravi/FocusAI"**

### 4.2 Select Repository
- Click on **"Developbyravi/FocusAI"**
- You'll be taken to "Site settings for FocusAI"

---

## Step 5: Configure Build Settings

Netlify will try to auto-detect settings, but we need to configure them properly.

### 5.1 Site Settings

| Field | Value | Why |
|-------|-------|-----|
| **Team** | Your team name | Auto-selected |
| **Branch to deploy** | `main` | Your main branch |
| **Base directory** | `client` | Frontend is in client folder |
| **Build command** | `npm install && npm run build` | Install deps and build |
| **Publish directory** | `client/build` | React build output |

### 5.2 How to Fill Each Field

**Branch to deploy:**
- Should show `main` by default
- If not, select `main` from dropdown

**Base directory:**
- Click in the field
- Type: `client`
- This tells Netlify your frontend is in the `client` folder

**Build command:**
- Click in the field
- Type: `npm install && npm run build`
- This installs dependencies and builds your React app

**Publish directory:**
- Click in the field
- Type: `client/build`
- This is where React outputs the built files

---

## Step 6: Add Environment Variables

This is **CRITICAL** for your frontend to connect to the backend!

### 6.1 Expand Advanced Settings
- Scroll down to find **"Advanced build settings"**
- Click **"Show advanced"** or **"New variable"**

### 6.2 Add Environment Variable

**Variable 1: REACT_APP_API_URL** (REQUIRED)
```
Key: REACT_APP_API_URL
Value: https://focusai-backend.onrender.com
```

**How to add:**
1. Click **"New variable"** button
2. In "Key" field, type: `REACT_APP_API_URL`
3. In "Value" field, paste your Render backend URL
4. **IMPORTANT**: No trailing slash! ❌ `https://...com/` ✅ `https://...com`

**Example:**
```
Key: REACT_APP_API_URL
Value: https://focusai-backend-abc123.onrender.com
```

### 6.3 Verify Environment Variable
- Double-check the key is exactly `REACT_APP_API_URL` (case-sensitive)
- Double-check the URL is your actual Render backend URL
- No trailing slash
- Starts with `https://`

---

## Step 7: Deploy Site

### 7.1 Deploy
- Review all settings one more time
- Scroll to bottom
- Click **"Deploy FocusAI"** button (big button)

### 7.2 Wait for Deployment
- Netlify will start building your site
- You'll see "Site deploy in progress"
- Click **"Deploying your site"** to see live logs

### 7.3 Build Logs
You'll see logs like:
```
12:00:00 PM: Build ready to start
12:00:05 PM: Cloning repository...
12:00:10 PM: Installing dependencies
12:00:30 PM: npm install
12:01:00 PM: Building React app
12:01:30 PM: npm run build
12:02:00 PM: Build complete!
12:02:05 PM: Site is live ✨
```

**Build time**: Usually 2-4 minutes

### 7.4 Deployment Complete
When you see:
- ✅ Green "Published" badge
- "Your site is live" message
- A URL like `https://random-name-123.netlify.app`

Your frontend is deployed! 🎉

---

## Step 8: Get Your Frontend URL

### 8.1 Find Your URL
At the top of the page, you'll see your site URL:
```
https://random-name-123.netlify.app
```

### 8.2 Copy the URL
- Click the URL to visit your site
- Or click the **copy icon** to copy it

### 8.3 Change Site Name (Optional)
To get a better URL:
1. Go to **"Site settings"**
2. Click **"Change site name"**
3. Enter a name like: `focusai-app`
4. Your new URL: `https://focusai-app.netlify.app`
5. Click **"Save"**

**Note**: Site names must be unique across all Netlify sites.

---

## Step 9: Test Your Frontend

### 9.1 Visit Your Site
Open your browser and go to your Netlify URL:
```
https://your-site-name.netlify.app
```

### 9.2 Test Basic Functionality
- ✅ Page loads without errors
- ✅ UI looks correct
- ✅ No console errors (press F12 → Console tab)

### 9.3 Test Backend Connection
1. Enter some text in the input field
2. Set a goal/intent
3. Click "Analyze" or submit
4. Wait for response

**If it works**: You'll see analysis results! ✅

**If it fails**: See troubleshooting section below ❌

---

## Step 10: Check Browser Console

### 10.1 Open Developer Tools
- Press **F12** (Windows/Linux)
- Or **Cmd + Option + I** (Mac)
- Or Right-click → "Inspect"

### 10.2 Go to Console Tab
Look for errors:

**✅ Good - No errors:**
```
React App loaded successfully
```

**❌ Bad - CORS error:**
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS
```
→ Check backend URL in environment variables

**❌ Bad - Network error:**
```
Failed to fetch
```
→ Backend might be sleeping (wait 60 seconds) or URL is wrong

### 10.3 Go to Network Tab
- Click "Network" tab
- Try analyzing content
- Look for API calls to your backend
- Check if they return 200 OK or errors

---

## Netlify Dashboard Overview

### Key Sections:

**1. Site Overview**
- Deployment status
- Site URL
- Recent deploys
- Quick actions

**2. Deploys Tab**
- All deployment history
- Build logs for each deploy
- Rollback to previous versions

**3. Site Settings**
- Change site name
- Custom domain
- Environment variables
- Build settings

**4. Domain Settings**
- Add custom domain
- HTTPS settings
- DNS configuration

**5. Functions Tab** (Not used in this project)
- Serverless functions
- Not needed for FocusAI

---

## Auto-Deploy Setup

Netlify automatically deploys when you push to GitHub!

### How it Works:
1. You push code to GitHub
2. Netlify detects the push
3. Automatically rebuilds and deploys
4. Takes 2-4 minutes

### View Auto-Deploys:
- Go to **"Deploys"** tab
- See all automatic deployments
- Each commit triggers a new deploy

### Disable Auto-Deploy:
- Site Settings → Build & deploy
- Stop builds
- Toggle off if you want manual control

---

## Environment Variables Management

### View/Edit Environment Variables

**After deployment:**
1. Go to **"Site settings"**
2. Click **"Environment variables"** (left sidebar)
3. You'll see all variables

### Add New Variable:
1. Click **"Add a variable"**
2. Select **"Add a single variable"**
3. Enter key and value
4. Click **"Create variable"**

### Edit Existing Variable:
1. Find the variable
2. Click **"Options"** (three dots)
3. Click **"Edit"**
4. Update value
5. Click **"Save"**

### Important Notes:
- Changes require a new deploy to take effect
- Click **"Trigger deploy"** after changing variables
- Variables are encrypted and secure

---

## Custom Domain Setup (Optional)

### Add Your Own Domain

**Step 1: Add Domain**
1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `focusai.com`)
4. Click **"Verify"**

**Step 2: Configure DNS**
Netlify will show DNS records to add:

**Option A: Netlify DNS** (Easier)
- Transfer your domain to Netlify DNS
- Automatic configuration
- Free SSL certificate

**Option B: External DNS** (Your current provider)
- Add A record: `75.2.60.5`
- Or CNAME record: `your-site.netlify.app`
- Wait for DNS propagation (up to 48 hours)

**Step 3: Enable HTTPS**
- Automatic with Netlify
- Free SSL certificate from Let's Encrypt
- Takes 1-2 minutes to provision

---

## Troubleshooting Common Issues

### Issue 1: Build Failed

**Error**: `npm install failed` or `npm run build failed`

**Solution**:
1. Check build logs in Netlify dashboard
2. Verify `client/package.json` is valid
3. Check Node version compatibility
4. Try deploying again: **"Trigger deploy"** → **"Deploy site"**

**Common causes:**
- Missing dependencies in package.json
- Syntax errors in code
- Node version mismatch

### Issue 2: Page Shows 404

**Error**: Blank page or "Page not found"

**Solution**:
1. Verify publish directory is `client/build`
2. Check build logs - did build complete?
3. Verify `netlify.toml` is in repository root
4. Check redirects are configured

### Issue 3: API Calls Fail (CORS)

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
1. Verify `REACT_APP_API_URL` environment variable is set
2. Check backend URL is correct (no trailing slash)
3. Verify backend is running (visit health endpoint)
4. Check backend has CORS enabled (it should)

**Test backend:**
```
https://your-backend.onrender.com/api/health
```

### Issue 4: Environment Variables Not Working

**Error**: API calls go to wrong URL or localhost

**Solution**:
1. Go to Site Settings → Environment variables
2. Verify `REACT_APP_API_URL` exists
3. Check value is correct
4. **Important**: Trigger a new deploy after changing variables
5. Clear browser cache

**Verify in browser console:**
```javascript
// In browser console, type:
console.log(process.env.REACT_APP_API_URL)
// Should show your backend URL
```

### Issue 5: Site Loads But Features Don't Work

**Error**: UI loads but analysis doesn't work

**Solution**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Go to Network tab
4. Try analyzing content
5. Check if API calls are made
6. Verify responses

**Common causes:**
- Backend is sleeping (wait 60 seconds)
- Wrong backend URL
- Backend environment variables not set
- Grok API key invalid

### Issue 6: Redirect Issues

**Error**: Refreshing page shows 404

**Solution**:
1. Verify `netlify.toml` is in repository root
2. Check `client/public/_redirects` exists
3. Verify redirect rules are correct
4. Redeploy site

**Correct redirect in netlify.toml:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Performance Optimization

### Enable Caching
- Automatic with Netlify
- Static assets cached on CDN
- Instant global delivery

### Asset Optimization
- Netlify automatically optimizes images
- Minifies CSS and JavaScript
- Compresses files

### Build Optimization
To speed up builds:
1. Site Settings → Build & deploy
2. Enable **"Build image selection"**
3. Choose latest Ubuntu image

---

## Monitoring & Analytics

### Deploy Notifications
Get notified of deployments:
1. Site Settings → Build & deploy
2. Deploy notifications
3. Add email, Slack, or webhook

### Analytics (Paid Feature)
- Netlify Analytics: $9/month
- Server-side analytics
- No cookies or tracking scripts
- Privacy-friendly

### Free Monitoring
Use browser tools:
- Google Analytics (add to your app)
- Console logs
- Network tab

---

## Rollback to Previous Version

If something breaks:

**Step 1: View Deploys**
1. Go to **"Deploys"** tab
2. See all previous deployments

**Step 2: Rollback**
1. Find a working deployment
2. Click on it
3. Click **"Publish deploy"**
4. Confirm

**Step 3: Verify**
- Visit your site
- Check if issue is fixed
- Previous version is now live

---

## Free Tier Limitations

### What You Get:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Instant cache invalidation
- ✅ Deploy previews
- ✅ Custom domain

### Limitations:
- 🔢 1 concurrent build
- 📊 No analytics (paid feature)
- 👥 1 team member

### Upgrade to Pro ($19/month):
- 400 GB bandwidth
- 25,000 build minutes
- 3 concurrent builds
- Analytics included
- Password protection
- More team members

---

## Deploy Previews

Netlify creates preview deploys for pull requests!

### How it Works:
1. Create a branch
2. Make changes
3. Open pull request on GitHub
4. Netlify automatically creates preview deploy
5. Test changes before merging

### View Preview:
- Go to **"Deploys"** tab
- See "Deploy Preview" section
- Each PR gets unique URL

---

## Best Practices

### 1. Environment Variables
- ✅ Use environment variables for API URLs
- ✅ Never commit secrets to git
- ✅ Different variables for dev/prod

### 2. Build Optimization
- ✅ Keep dependencies minimal
- ✅ Remove unused packages
- ✅ Use production builds

### 3. Testing
- ✅ Test locally before deploying
- ✅ Check browser console for errors
- ✅ Test on mobile devices

### 4. Monitoring
- ✅ Set up deploy notifications
- ✅ Monitor build times
- ✅ Check error logs regularly

### 5. Security
- ✅ Always use HTTPS (automatic)
- ✅ Keep dependencies updated
- ✅ Review deploy logs

---

## Quick Reference

### Essential Commands

**Trigger Manual Deploy:**
- Deploys → Trigger deploy → Deploy site

**Clear Cache and Deploy:**
- Deploys → Trigger deploy → Clear cache and deploy site

**View Build Logs:**
- Deploys → Click on a deploy → View logs

**Change Environment Variables:**
- Site settings → Environment variables → Edit

### Important Links
- Netlify Dashboard: https://app.netlify.com
- Netlify Docs: https://docs.netlify.com
- Support: https://answers.netlify.com

---

## Testing Checklist

After deployment, test these:

- [ ] Homepage loads
- [ ] No console errors (F12)
- [ ] Text input analysis works
- [ ] YouTube URL analysis works
- [ ] Article URL analysis works
- [ ] Chat assistant works
- [ ] Roadmap generation works
- [ ] Recommendations load
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Backend connection works
- [ ] All API calls succeed

---

## Next Steps

✅ Frontend deployed on Netlify
✅ Backend connected
✅ Site tested and working

### Share Your App!
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-backend.onrender.com`

### Optional Enhancements:
1. Add custom domain
2. Set up analytics
3. Enable deploy notifications
4. Add more features

---

**🎉 Deployment Complete!**

Your FocusAI app is now live on the internet!

- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-backend.onrender.com

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for more details.
