# Deploy Frontend to Netlify - Quick Guide 🚀

Your backend is live at: **https://focusai-2.onrender.com** ✅

All configuration files have been updated. Now deploy the frontend!

---

## Option 1: Netlify Dashboard (Easiest)

### Step 1: Go to Netlify
Visit: **https://app.netlify.com**

### Step 2: Add New Site
- Click **"Add new site"** → **"Import an existing project"**

### Step 3: Connect GitHub
- Select **"GitHub"**
- Authorize Netlify (if first time)
- Select repository: **"Developbyravi/FocusAI"**

### Step 4: Configure Build Settings
```
Branch to deploy:     main
Base directory:       client
Build command:        npm install && npm run build
Publish directory:    client/build
```

### Step 5: Add Environment Variable
Click **"Show advanced"** or **"Add environment variables"**

```
Key:   REACT_APP_API_URL
Value: https://focusai-2.onrender.com
```

⚠️ **IMPORTANT**: No trailing slash!

### Step 6: Deploy
- Click **"Deploy site"**
- Wait 2-4 minutes
- Your site will be live!

---

## Option 2: Netlify CLI (For Advanced Users)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to client folder
cd client

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

---

## After Deployment

### Test Your Site
1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Try analyzing some content
3. Check browser console (F12) for errors

### Change Site Name (Optional)
1. Go to **Site settings**
2. Click **"Change site name"**
3. Enter: `focusai-app` (or your preferred name)
4. New URL: `https://focusai-app.netlify.app`

---

## Verify Backend Connection

Your frontend will connect to:
```
https://focusai-2.onrender.com
```

Test backend health:
```
https://focusai-2.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "FocusAI server running"
}
```

---

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Verify `client/package.json` is valid
- Try: Clear cache and deploy

### API Calls Fail
- Check `REACT_APP_API_URL` is set correctly
- Verify backend is running (visit health endpoint)
- Check browser console for CORS errors

### Backend Sleeping (Free Tier)
- First request may take 30-60 seconds
- This is normal for Render free tier
- Wait and try again

---

## Configuration Summary

✅ **Backend URL**: https://focusai-2.onrender.com
✅ **Files Updated**:
   - `client/.env.production`
   - `netlify.toml`
   - `client/public/_redirects`
✅ **Changes Pushed**: GitHub is up to date

---

## Next Steps

1. Deploy to Netlify using steps above
2. Test your live site
3. Share your URLs!

**Need detailed help?** See [NETLIFY_GUIDE.md](./NETLIFY_GUIDE.md)

---

**🎉 You're almost done! Just deploy to Netlify and your app will be live!**
