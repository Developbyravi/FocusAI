from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import json
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Get API key from environment
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

ANALYSIS_PROMPT = """You are an advanced AI content analyzer.
Analyze the given text and return ONLY a valid JSON response.

Tasks:
1. Extract the most important keywords (ignore common words like "the", "is", "and").
2. Classify the content into ONE category:
   - "Productive" → learning, coding, education, business, growth, skills
   - "Waste" → gossip, drama, clickbait, viral, memes, entertainment addiction
   - "Neutral" → everything else
3. Generate a usefulness_score (0–100) based on:
   - Learning or educational value
   - Practical usefulness
   - Content depth
4. Create a short summary (maximum 2–3 sentences).
5. Perform sentiment analysis:
   - "Positive"
   - "Negative"
   - "Neutral"
6. Provide a confidence score between 0 and 1.

Strict Rules:
- Return ONLY JSON (no explanation, no extra text)
- Ensure JSON is valid and properly formatted
- Do not include markdown formatting

Output Format:
{
  "keywords": ["", "", ""],
  "category": "Productive | Waste | Neutral",
  "usefulness_score": 0,
  "summary": "",
  "sentiment": "Positive | Negative | Neutral",
  "confidence": 0.0
}

Be strict in classification:
- Educational or skill-building → Productive
- Time-wasting or addictive content → Waste
- Informational without strong value → Neutral

Use realistic scoring:
- 80–100 → Highly valuable content
- 50–79 → Moderately useful
- 0–49 → Low or waste content

Text to analyze:
\"\"\"
{content}
\"\"\"
"""

def analyze_with_gemini(content):
    """Analyze content using Google Gemini API"""
    if not GEMINI_API_KEY:
        return None
    
    try:
        response = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}',
            headers={
                'Content-Type': 'application/json'
            },
            json={
                'contents': [{
                    'parts': [{
                        'text': ANALYSIS_PROMPT.format(content=content)
                    }]
                }],
                'generationConfig': {
                    'temperature': 0.3,
                    'maxOutputTokens': 500
                }
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            content_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Remove markdown code blocks if present
            if content_text.startswith('```'):
                content_text = content_text.split('```')[1]
                if content_text.startswith('json'):
                    content_text = content_text[4:]
                content_text = content_text.rsplit('```', 1)[0]
            
            return json.loads(content_text)
        else:
            print(f"Gemini API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Gemini error: {str(e)}")
        return None

def fallback_analysis(content):
    """Simple fallback analysis when no API is available"""
    from collections import Counter
    import re
    
    # Extract keywords
    text = re.sub(r'[^a-zA-Z\s]', '', content.lower())
    words = text.split()
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
                  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                  'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
                  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'}
    
    filtered_words = [w for w in words if w not in stop_words and len(w) > 3]
    word_freq = Counter(filtered_words)
    keywords = [word for word, _ in word_freq.most_common(10)]
    
    # Simple classification
    productive_keywords = ['learn', 'tutorial', 'guide', 'education', 'course', 'study', 
                          'programming', 'coding', 'development', 'skill', 'training']
    waste_keywords = ['gossip', 'drama', 'clickbait', 'viral', 'shocking', 'celebrity']
    
    text_lower = content.lower()
    productive_count = sum(1 for kw in productive_keywords if kw in text_lower)
    waste_count = sum(1 for kw in waste_keywords if kw in text_lower)
    
    if productive_count > waste_count * 2:
        category = 'Productive'
        score = 70 + min(productive_count * 5, 25)
    elif waste_count > productive_count * 2:
        category = 'Waste'
        score = max(20 - waste_count * 5, 10)
    else:
        category = 'Neutral'
        score = 50
    
    # Simple summary
    sentences = re.split(r'[.!?]+', content)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
    summary = '. '.join(sentences[:2]) + '.' if sentences else 'Content summary unavailable.'
    
    # Simple sentiment
    positive_words = ['good', 'great', 'excellent', 'amazing', 'helpful', 'useful']
    negative_words = ['bad', 'terrible', 'awful', 'horrible', 'useless', 'waste']
    
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        sentiment = 'Positive'
    elif negative_count > positive_count:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
    
    return {
        'keywords': keywords[:10],
        'category': category,
        'usefulness_score': score,
        'summary': summary,
        'sentiment': sentiment,
        'confidence': 0.65
    }

@app.route('/ai/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    has_gemini = bool(GEMINI_API_KEY)
    
    return jsonify({
        'status': 'OK',
        'service': 'FocusAI AI Service (Gemini)',
        'timestamp': time.time(),
        'version': '2.0.0',
        'ai_enabled': has_gemini,
        'provider': 'gemini' if has_gemini else 'fallback'
    })

@app.route('/ai/analyze-text', methods=['POST'])
def analyze_text():
    """Analyze text content using AI"""
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_CONTENT',
                    'message': 'Content is required for analysis'
                }
            }), 400
        
        content = data['content']
        
        if len(content.strip()) == 0:
            return jsonify({
                'error': {
                    'code': 'EMPTY_CONTENT',
                    'message': 'Content cannot be empty'
                }
            }), 400
        
        start_time = time.time()
        
        # Try Gemini AI, fallback to simple algorithm if not available
        result = None
        provider = 'fallback'
        
        if GEMINI_API_KEY:
            result = analyze_with_gemini(content)
            if result:
                provider = 'gemini'
        
        if not result:
            result = fallback_analysis(content)
        
        processing_time = time.time() - start_time
        
        return jsonify({
            'summary': result['summary'],
            'score': result['usefulness_score'],
            'category': result['category'],
            'keywords': result['keywords'],
            'sentiment': result['sentiment'],
            'confidence': result['confidence'],
            'processingTime': processing_time,
            'provider': provider
        })
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return jsonify({
            'error': {
                'code': 'ANALYSIS_ERROR',
                'message': str(e)
            }
        }), 500

@app.route('/ai/summarize', methods=['POST'])
def summarize_content():
    """Generate summary"""
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_CONTENT',
                    'message': 'Content is required'
                }
            }), 400
        
        content = data['content']
        
        # Use Gemini AI if available, otherwise fallback
        result = None
        if GEMINI_API_KEY:
            result = analyze_with_gemini(content)
        
        if not result:
            result = fallback_analysis(content)
        
        return jsonify({
            'summary': result['summary'],
            'originalLength': len(content),
            'summaryLength': len(result['summary'])
        })
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'SUMMARIZATION_ERROR',
                'message': str(e)
            }
        }), 500

@app.route('/ai/classify', methods=['POST'])
def classify():
    """Classify content"""
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_CONTENT',
                    'message': 'Content is required'
                }
            }), 400
        
        content = data['content']
        
        # Use Gemini AI if available
        result = None
        if GEMINI_API_KEY:
            result = analyze_with_gemini(content)
        
        if not result:
            result = fallback_analysis(content)
        
        return jsonify({
            'category': result['category'],
            'confidence': result['confidence'],
            'reasoning': f'Content classified as {result["category"]} based on analysis'
        })
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'CLASSIFICATION_ERROR',
                'message': str(e)
            }
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    
    if GEMINI_API_KEY:
        print('🤖 AI Service: Google Gemini enabled (FREE!)')
    else:
        print('⚠️  AI Service: No Gemini API key found, using fallback analysis')
        print('💡 Get your FREE key at: https://makersuite.google.com/app/apikey')
    
    print(f'🚀 Starting FocusAI AI Service on port {port}')
    app.run(host='0.0.0.0', port=port, debug=True)
