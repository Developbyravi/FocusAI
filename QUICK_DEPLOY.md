# Quick Deploy Reference 🚀

## TL;DR - Deploy in 10 Minutes

### 1️⃣ Backend (Render) - 5 minutes

```bash
# Push to GitHub
git init
git add .
git commit -m "Deploy ready"
git push -u origin main
```

Then:
1. Go to https://render.com → New Web Service
2. Connect your repo
3. Add environment variable: `GROK_API_KEY=your_key`
4. Deploy (auto-configured via `render.yaml`)
5. Copy your backend URL

### 2️⃣ Frontend (Netlify) - 5 minutes

Update these files with your Render backend URL:
- `client/.env.production`
- `netlify.toml` (line 7)
- `client/public/_redirects` (line 2)

```bash
git add .
git commit -m "Update backend URL"
git push
```

Then:
1. Go to https://app.netlify.com → New Site
2. Connect your repo
3. Settings:
   - Base: `client`
   - Build: `npm install && npm run build`
   - Publish: `client/build`
4. Add env var: `REACT_APP_API_URL=your-render-url`
5. Deploy

### 3️⃣ Test

- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-app.netlify.app`

---

## Files Created for Deployment

| File | Purpose |
|------|---------|
| `render.yaml` | Render backend configuration |
| `netlify.toml` | Netlify frontend configuration |
| `client/.env.production` | Production API URL |
| `client/public/_redirects` | Netlify routing rules |
| `.gitignore` | Prevent committing secrets |
| `DEPLOYMENT.md` | Full deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |

---

## Environment Variables Needed

### Render (Backend)
```
GROK_API_KEY=xai-xxxxx (REQUIRED)
MONGODB_URI=mongodb+srv://... (optional)
```

### Netlify (Frontend)
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## Important URLs

- Get Grok API Key: https://console.x.ai
- Render Dashboard: https://dashboard.render.com
- Netlify Dashboard: https://app.netlify.com

---

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
