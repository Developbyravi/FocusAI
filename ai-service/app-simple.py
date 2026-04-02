from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import re
from collections import Counter

app = Flask(__name__)
CORS(app)

# Simple keyword lists for classification
PRODUCTIVE_KEYWORDS = [
    'learn', 'tutorial', 'guide', 'education', 'course', 'study', 'research',
    'productivity', 'development', 'programming', 'coding', 'technology',
    'business', 'career', 'skill', 'training', 'professional', 'knowledge',
    'science', 'analysis', 'strategy', 'improvement', 'growth', 'innovation'
]

WASTE_KEYWORDS = [
    'gossip', 'drama', 'clickbait', 'viral', 'shocking', 'celebrity',
    'scandal', 'rumor', 'trending', 'meme', 'funny', 'prank', 'reaction'
]

def extract_keywords(text, top_n=10):
    """Extract top keywords from text"""
    # Convert to lowercase and remove special characters
    text = re.sub(r'[^a-zA-Z\s]', '', text.lower())
    
    # Split into words
    words = text.split()
    
    # Remove common stop words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
                  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                  'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
                  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'}
    
    # Filter words
    filtered_words = [w for w in words if w not in stop_words and len(w) > 3]
    
    # Count frequency
    word_freq = Counter(filtered_words)
    
    # Return top N keywords
    return [word for word, _ in word_freq.most_common(top_n)]

def classify_content(text, keywords):
    """Classify content as productive, neutral, or waste"""
    text_lower = text.lower()
    
    productive_count = sum(1 for kw in PRODUCTIVE_KEYWORDS if kw in text_lower)
    waste_count = sum(1 for kw in WASTE_KEYWORDS if kw in text_lower)
    
    if productive_count > waste_count * 2:
        return 'Productive'
    elif waste_count > productive_count * 2:
        return 'Waste'
    else:
        return 'Neutral'

def calculate_usefulness_score(text, keywords, category):
    """Calculate usefulness score (0-100)"""
    base_score = 50
    
    # Length factor (prefer substantial content)
    length = len(text)
    if length > 1000:
        base_score += 15
    elif length > 500:
        base_score += 10
    elif length < 100:
        base_score -= 10
    
    # Category factor
    if category == 'Productive':
        base_score += 20
    elif category == 'Waste':
        base_score -= 20
    
    # Keyword quality
    productive_keywords_found = sum(1 for kw in keywords if kw in PRODUCTIVE_KEYWORDS)
    base_score += productive_keywords_found * 3
    
    # Ensure score is between 0 and 100
    return max(0, min(100, base_score))

def generate_summary(text, max_sentences=3):
    """Generate a simple extractive summary"""
    # Split into sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
    
    if not sentences:
        return "Content is too short to summarize."
    
    # Take first few sentences as summary
    summary_sentences = sentences[:max_sentences]
    summary = '. '.join(summary_sentences)
    
    if not summary.endswith('.'):
        summary += '.'
    
    return summary

def analyze_sentiment(text):
    """Simple sentiment analysis"""
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
                      'positive', 'helpful', 'useful', 'valuable', 'important', 'best']
    negative_words = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'useless',
                      'waste', 'poor', 'worst', 'disappointing', 'frustrating']
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'

@app.route('/ai/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'service': 'FocusAI ML Service (Simple)',
        'timestamp': time.time(),
        'version': '1.0.0-simple'
    })

@app.route('/ai/analyze-text', methods=['POST'])
def analyze_text():
    """Analyze text content"""
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
        
        # Extract keywords
        keywords = extract_keywords(content)
        
        # Classify content
        category = classify_content(content, keywords)
        
        # Generate summary
        summary = generate_summary(content)
        
        # Calculate score
        score = calculate_usefulness_score(content, keywords, category)
        
        # Analyze sentiment
        sentiment = analyze_sentiment(content)
        
        processing_time = time.time() - start_time
        
        return jsonify({
            'summary': summary,
            'score': score,
            'category': category,
            'keywords': keywords,
            'sentiment': sentiment,
            'confidence': 0.75,
            'processingTime': processing_time
        })
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'ANALYSIS_ERROR',
                'message': str(e)
            }
        }), 500

@app.route('/ai/analyze-youtube', methods=['POST'])
def analyze_youtube():
    """Analyze YouTube video (simplified - returns mock data)"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_URL',
                    'message': 'YouTube URL is required'
                }
            }), 400
        
        # For now, return mock analysis
        return jsonify({
            'summary': 'YouTube video analysis is available in the full version with transcript extraction.',
            'score': 75,
            'category': 'Educational',
            'keywords': ['video', 'youtube', 'content', 'tutorial'],
            'sentiment': 'positive',
            'confidence': 0.70,
            'processingTime': 0.1,
            'metadata': {
                'videoUrl': data['url'],
                'note': 'Full transcript analysis requires additional dependencies'
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'YOUTUBE_ANALYSIS_ERROR',
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
        max_length = data.get('maxLength', 200)
        
        summary = generate_summary(content)
        
        # Truncate if needed
        if len(summary) > max_length:
            summary = summary[:max_length] + '...'
        
        return jsonify({
            'summary': summary,
            'originalLength': len(content),
            'summaryLength': len(summary)
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
        keywords = data.get('keywords', [])
        
        category = classify_content(content, keywords)
        
        return jsonify({
            'category': category,
            'confidence': 0.75,
            'reasoning': f'Content classified as {category} based on keyword analysis'
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
    print(f'🚀 Starting FocusAI AI Service (Simple) on port {port}')
    print(f'📝 Mode: Development (No ML dependencies)')
    app.run(host='0.0.0.0', port=port, debug=True)
