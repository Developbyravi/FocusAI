# FocusAI 🧠

> AI-powered content filtering, learning optimization, and focus enhancement — powered by Grok API.

## Quick Start

### 1. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Add your GROK_API_KEY to .env
npm run dev
```

### 2. Setup Frontend

```bash
cd client
npm install
npm start
```

Frontend runs on `http://localhost:3000`  
Backend runs on `http://localhost:5000`

---

## Environment Variables (server/.env)

```
GROK_API_KEY=your_grok_api_key_here
GROK_API_URL=https://api.x.ai/v1
MONGODB_URI=mongodb://localhost:27017/focusai   # optional
PORT=5000
```

Get your Grok API key at: https://console.x.ai

---

## Features

| Module | Description |
|--------|-------------|
| 🔒 Intent Lock | Set your goal before analyzing — aligns AI output |
| 📥 Smart Input | Auto-detects YouTube URLs, article links, plain text |
| 🤖 Grok AI Analysis | Scores content 0–100 across clarity, depth, relevance, usefulness |
| 📊 Value Scoring | Classifies as Useful / Neutral / Waste |
| ✂️ Smart Compression | Extracts only essential points |
| 🧭 Learning Roadmap | Beginner → Intermediate → Advanced path |
| 🎬 Video Player | Distraction-free YouTube embed |
| 🎯 Recommendations | High-value alternatives suggested by AI |
| 💬 Chat Assistant | Multi-turn AI Q&A about the content |
| 🔁 Outcome Tracker | Feedback loop to improve personalization |

---

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, JSX
- **Backend**: Node.js, Express
- **AI**: Grok API (xAI)
- **Database**: MongoDB (optional)

---

## 🚀 Deployment

This project is ready to deploy on:
- **Backend**: Render (free tier available)
- **Frontend**: Netlify (free tier available)

### 📚 Deployment Guides

Choose the guide that fits your needs:

| Guide | Best For | Time |
|-------|----------|------|
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | Quick reference, experienced users | 10 min |
| [RENDER_GUIDE.md](./RENDER_GUIDE.md) | Detailed Render backend deployment | 15 min |
| [NETLIFY_GUIDE.md](./NETLIFY_GUIDE.md) | Detailed Netlify frontend deployment | 15 min |
| [DEPLOYMENT_FLOWCHART.md](./DEPLOYMENT_FLOWCHART.md) | Visual flowchart and overview | 5 min |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Interactive step-by-step checklist | 30 min |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Complete comprehensive guide | 30 min |

### ⚡ Quick Deploy Steps:

1. **Deploy Backend to Render** (5 min)
   - Push to GitHub ✓ (Already done!)
   - Connect repo to Render
   - Add `GROK_API_KEY` environment variable
   - Deploy automatically via `render.yaml`

2. **Deploy Frontend to Netlify** (5 min)
   - Update `client/.env.production` with backend URL
   - Update `netlify.toml` with backend URL
   - Deploy via Netlify dashboard

**Start here**: [RENDER_GUIDE.md](./RENDER_GUIDE.md) → [NETLIFY_GUIDE.md](./NETLIFY_GUIDE.md)
