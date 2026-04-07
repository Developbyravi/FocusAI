# Google Gemini API Setup (FREE!)

Google Gemini is completely FREE with generous quotas - perfect for FocusAI!

## Step 1: Get Your API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza...`)

## Step 2: Add to .env File

Open `ai-service/.env` and add your key:

```
GEMINI_API_KEY=AIzaSyYourKeyHere
```

## Step 3: Install Dependencies

```bash
cd ai-service
pip install -r requirements-ai.txt
```

## Step 4: Run the AI Service

```bash
python app-ai.py
```

You should see:
```
🤖 AI Service: Google Gemini enabled (FREE!)
🚀 Starting FocusAI AI Service (Enhanced) on port 5001
```

## Gemini Free Tier Limits

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

This is MORE than enough for personal use!

## Test It

Try analyzing some content in your FocusAI app. The AI will now provide:
- More accurate keyword extraction
- Better content classification
- Smarter usefulness scoring
- Higher quality summaries
- Improved sentiment analysis

## Troubleshooting

If you get errors:
1. Make sure your API key is correct
2. Check you have internet connection
3. Verify the key is active at https://makersuite.google.com/app/apikey

If Gemini fails, the service automatically falls back to the simple algorithm!
