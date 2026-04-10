# Add MongoDB to Render Deployment 🗄️

Your MongoDB connection string is ready. Follow these steps to add it to your Render backend.

---

## Your MongoDB URI

```
mongodb://atlas-sql-688f77955ef99a38c33aff0a-cvyuc9.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin
```

---

## Steps to Add MongoDB to Render

### Step 1: Go to Render Dashboard
Visit: **https://dashboard.render.com**

### Step 2: Select Your Service
- Find and click on **"focusai-backend"** (or your service name)
- You'll see your service overview

### Step 3: Go to Environment Tab
- Click **"Environment"** in the left sidebar
- You'll see your existing environment variables

### Step 4: Add MongoDB URI
- Click **"Add Environment Variable"** button
- Fill in:

```
Key:   MONGODB_URI
Value: mongodb://atlas-sql-688f77955ef99a38c33aff0a-cvyuc9.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin
```

### Step 5: Save
- Click **"Save Changes"**
- Render will automatically redeploy your service
- Wait 2-3 minutes for the deployment to complete

---

## Verify MongoDB Connection

### Check Logs
1. Go to **"Logs"** tab in Render dashboard
2. Look for one of these messages:

**Success:**
```
MongoDB connected
FocusAI server running on http://localhost:10000
```

**Optional (if MongoDB fails):**
```
MongoDB optional - skipping: [error message]
FocusAI server running on http://localhost:10000
```

**Note**: The app works fine without MongoDB - it's optional!

---

## What MongoDB Does in FocusAI

MongoDB is used for:
- ✅ Storing user sessions
- ✅ Tracking content analysis history
- ✅ Saving user feedback

**Without MongoDB:**
- ✅ App still works perfectly
- ✅ All analysis features work
- ✅ Chat assistant works
- ❌ Sessions are not persisted
- ❌ History is not saved

---

## Troubleshooting

### Connection Fails
If you see MongoDB connection errors in logs:

**Check 1: IP Whitelist**
- Go to MongoDB Atlas dashboard
- Network Access → IP Whitelist
- Add: `0.0.0.0/0` (allow all IPs)
- Or add Render's IP addresses

**Check 2: Connection String**
- Verify the URI is correct
- Check username/password are correct
- Ensure database name is correct

**Check 3: Database Permissions**
- User must have read/write permissions
- Check in MongoDB Atlas → Database Access

### App Still Works Without MongoDB
This is normal! MongoDB is optional. The app will:
- Skip MongoDB connection
- Continue running normally
- Log: "MongoDB optional - skipping"

---

## Current Environment Variables on Render

After adding MongoDB, you should have:

```
GROK_API_KEY     = your_actual_groq_api_key_here
GROK_API_URL     = https://api.groq.com/openai/v1
NODE_ENV         = production
PORT             = 10000
MONGODB_URI      = mongodb://atlas-sql-688f77955ef99a38c33aff0a-cvyuc9.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin
```

---

## Test After Adding MongoDB

### Test 1: Health Check
```
https://focusai-2.onrender.com/api/health
```

Should still return:
```json
{
  "status": "ok",
  "message": "FocusAI server running"
}
```

### Test 2: Create Session
```bash
curl -X POST https://focusai-2.onrender.com/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"goal":"Learn programming"}'
```

Should return:
```json
{
  "sessionId": "...",
  "goal": "Learn programming",
  "createdAt": "..."
}
```

---

## Summary

✅ **Local .env updated** with MongoDB URI
✅ **Ready to add** to Render environment variables
✅ **Optional feature** - app works without it
✅ **Easy to add** - just one environment variable

**Next**: Add the `MONGODB_URI` environment variable in Render dashboard!

---

**Need help?** Check Render logs after adding the variable to verify connection.
