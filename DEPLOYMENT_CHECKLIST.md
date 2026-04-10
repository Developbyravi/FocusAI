# Deployment Checklist ✅

Use this checklist to ensure smooth deployment of FocusAI.

## Pre-Deployment

### Repository Setup
- [ ] Initialize git repository (`git init`)
- [ ] Create GitHub repository
- [ ] Add all files (`git add .`)
- [ ] Commit changes (`git commit -m "Initial commit"`)
- [ ] Push to GitHub (`git push -u origin main`)

### Environment Variables
- [ ] Obtain Grok API key from https://console.x.ai
- [ ] (Optional) Set up MongoDB Atlas account and get connection URI
- [ ] Keep `.env` files out of git (check `.gitignore`)

---

## Backend Deployment (Render)

### Setup
- [ ] Sign up/login to Render (https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Verify `render.yaml` is detected

### Configuration
- [ ] Add `GROK_API_KEY` environment variable
- [ ] Add `MONGODB_URI` (optional)
- [ ] Verify `NODE_ENV=production`
- [ ] Verify `PORT=10000`
- [ ] Verify `GROK_API_URL=https://api.x.ai/v1`

### Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Copy backend URL (e.g., `https://focusai-backend.onrender.com`)
- [ ] Test health endpoint: `https://YOUR-URL.onrender.com/api/health`
- [ ] Verify response: `{"status":"ok","message":"FocusAI server running"}`

---

## Frontend Deployment (Netlify)

### Update Configuration Files
- [ ] Edit `client/.env.production`
  - Replace `your-render-backend-url` with actual Render URL
- [ ] Edit `netlify.toml`
  - Replace `your-render-backend-url` with actual Render URL (line 7)
- [ ] Edit `client/public/_redirects`
  - Replace `your-render-backend-url` with actual Render URL (line 2)
- [ ] Commit and push changes

### Deploy via Netlify Dashboard
- [ ] Sign up/login to Netlify (https://app.netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Base directory: `client`
  - Build command: `npm install && npm run build`
  - Publish directory: `client/build`
- [ ] Add environment variable:
  - Key: `REACT_APP_API_URL`
  - Value: Your Render backend URL
- [ ] Click "Deploy site"

### OR Deploy via Netlify CLI
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Navigate to client: `cd client`
- [ ] Login: `netlify login`
- [ ] Initialize: `netlify init`
- [ ] Deploy: `netlify deploy --prod`

### Test Frontend
- [ ] Visit Netlify URL (e.g., `https://your-app.netlify.app`)
- [ ] Test homepage loads
- [ ] Test content analysis feature
- [ ] Verify API connection works
- [ ] Check browser console for errors

---

## Post-Deployment

### Verification
- [ ] Test all main features:
  - [ ] Content analysis (text input)
  - [ ] YouTube URL analysis
  - [ ] Article URL analysis
  - [ ] Chat assistant
  - [ ] Roadmap generation
  - [ ] Recommendations
- [ ] Test on mobile device
- [ ] Check loading times
- [ ] Verify HTTPS is enabled

### Monitoring
- [ ] Bookmark Render dashboard for backend logs
- [ ] Bookmark Netlify dashboard for frontend logs
- [ ] Set up uptime monitoring (optional)
- [ ] Note: Render free tier spins down after 15 min inactivity

### Documentation
- [ ] Update README with live URLs
- [ ] Share deployment URLs with team
- [ ] Document any custom configurations

---

## Optional Enhancements

### Custom Domain
- [ ] Purchase domain name
- [ ] Configure DNS for backend (Render)
- [ ] Configure DNS for frontend (Netlify)
- [ ] Update CORS settings if needed

### Performance
- [ ] Enable Netlify CDN (automatic)
- [ ] Consider upgrading Render plan for always-on backend
- [ ] Set up caching strategies

### Security
- [ ] Review CORS configuration
- [ ] Set up rate limiting (backend)
- [ ] Enable MongoDB IP whitelist
- [ ] Set up SSL certificates (automatic)

---

## Troubleshooting

### Backend Issues
- [ ] Check Render logs for errors
- [ ] Verify all environment variables are set
- [ ] Test API endpoints directly
- [ ] Check MongoDB connection (if used)

### Frontend Issues
- [ ] Check Netlify build logs
- [ ] Verify `REACT_APP_API_URL` is correct
- [ ] Test API calls in browser console
- [ ] Clear browser cache

### Common Fixes
- [ ] Rebuild and redeploy if environment variables changed
- [ ] Check for CORS errors in browser console
- [ ] Verify backend is awake (Render free tier)
- [ ] Check API key is valid and has credits

---

## Success Criteria

✅ Backend health endpoint returns 200 OK
✅ Frontend loads without errors
✅ Content analysis works end-to-end
✅ No CORS errors in console
✅ Mobile responsive
✅ HTTPS enabled on both services

---

**🎉 Deployment Complete!**

Share your live URLs:
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-backend.onrender.com`
