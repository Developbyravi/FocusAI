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

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy Steps:

1. **Deploy Backend to Render**
   - Push to GitHub
   - Connect repo to Render
   - Add `GROK_API_KEY` environment variable
   - Deploy automatically via `render.yaml`

2. **Deploy Frontend to Netlify**
   - Update `client/.env.production` with backend URL
   - Update `netlify.toml` with backend URL
   - Deploy via Netlify CLI or dashboard

Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
