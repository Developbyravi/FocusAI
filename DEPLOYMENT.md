# FocusAI Deployment Guide 🚀

This guide will help you deploy FocusAI with the backend on Render and frontend on Netlify.

## Prerequisites

- GitHub account
- Render account (free tier available)
- Netlify account (free tier available)
- Grok API key from https://console.x.ai
- MongoDB URI (optional - app works without it)

---

## Part 1: Deploy Backend to Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create Render Service

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will auto-detect the `render.yaml` configuration

### Step 3: Configure Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `GROK_API_KEY` | `your_actual_key` | Required - Get from https://console.x.ai |
| `GROK_API_URL` | `https://api.x.ai/v1` | Already set in render.yaml |
| `MONGODB_URI` | `your_mongodb_uri` | Optional - Leave empty if not using |
| `NODE_ENV` | `production` | Already set in render.yaml |
| `PORT` | `10000` | Already set in render.yaml |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. Copy your backend URL (e.g., `https://focusai-backend.onrender.com`)

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "FocusAI server running"
}
```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Update Environment Variables

Edit `client/.env.production` and replace with your actual Render backend URL:

```env
REACT_APP_API_URL=https://your-actual-backend.onrender.com
```

### Step 2: Update Netlify Configuration

Edit `netlify.toml` and update the redirect URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend.onrender.com/api/:splat"
  status = 200
  force = true
```

### Step 3: Commit Changes

```bash
git add .
git commit -m "Update production URLs"
git push
```

### Step 4: Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

```bash
npm install -g netlify-cli
cd client
netlify login
netlify init
netlify deploy --prod
```

#### Option B: Netlify Dashboard

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `client/build`
5. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com`
6. Click **"Deploy site"**

### Step 5: Test Frontend

1. Visit your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Try analyzing content to verify backend connection

---

## Part 3: Custom Domain (Optional)

### For Render (Backend)
1. Go to your service settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS records as instructed

### For Netlify (Frontend)
1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

---

## Environment Variables Summary

### Backend (Render)
```env
GROK_API_KEY=xai-xxxxxxxxxxxxx
GROK_API_URL=https://api.x.ai/v1
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/focusai
NODE_ENV=production
PORT=10000
```

### Frontend (Netlify)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## Troubleshooting

### Backend Issues

**Problem**: Service won't start
- Check Render logs for errors
- Verify `GROK_API_KEY` is set correctly
- Ensure all dependencies are in `package.json`

**Problem**: MongoDB connection fails
- MongoDB is optional - app will work without it
- Check `MONGODB_URI` format
- Verify MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)

### Frontend Issues

**Problem**: API calls fail (CORS errors)
- Verify `REACT_APP_API_URL` is set correctly
- Check backend CORS configuration
- Ensure backend is running

**Problem**: Build fails
- Check Node version compatibility
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check build logs in Netlify dashboard

**Problem**: 404 on refresh
- Netlify redirects are configured in `netlify.toml`
- Verify the file is in the repository root

---

## Monitoring & Maintenance

### Render Free Tier Notes
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Upgrade to paid plan for always-on service

### Netlify Free Tier Notes
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- Instant cache invalidation

---

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS (automatic on both platforms)
- ✅ Keep dependencies updated
- ✅ Review CORS settings for production
- ✅ Set up MongoDB IP whitelist properly

---

## Quick Commands Reference

```bash
# Local development
cd server && npm run dev          # Start backend
cd client && npm start            # Start frontend

# Deploy backend (auto via GitHub push)
git push origin main

# Deploy frontend (Netlify CLI)
cd client && netlify deploy --prod

# View logs
# Render: Dashboard → Logs tab
# Netlify: Dashboard → Deploys → Deploy log
```

---

## Support

- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- Grok API: https://docs.x.ai

---

**🎉 Your FocusAI app is now live!**
