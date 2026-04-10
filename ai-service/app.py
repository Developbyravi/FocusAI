from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import logging
from dotenv import load_dotenv

# Import our AI processing modules
from services.text_analyzer import TextAnalyzer
from services.youtube_analyzer import YouTubeAnalyzer
from services.content_classifier import ContentClassifier
from services.summarizer import ContentSummarizer

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AI services
text_analyzer = TextAnalyzer()
youtube_analyzer = YouTubeAnalyzer()
classifier = ContentClassifier()
summarizer = ContentSummarizer()

@app.route('/ai/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'service': 'FocusAI ML Service',
        'timestamp': time.time(),
        'version': '1.0.0'
    })

@app.route('/ai/analyze-text', methods=['POST'])
def analyze_text():
    """Analyze text content for usefulness and generate summary"""
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
        user_id = data.get('userId', 'anonymous')
        
        if len(content.strip()) == 0:
            return jsonify({
                'error': {
                    'code': 'EMPTY_CONTENT',
                    'message': 'Content cannot be empty'
                }
            }), 400
        
        start_time = time.time()
        
        # Analyze content
        analysis_result = text_analyzer.analyze(content)
        
        # Classify content
        category = classifier.classify(content, analysis_result['keywords'])
        
        # Generate summary
        summary = summarizer.summarize(content)
        
        # Calculate usefulness score
        score = text_analyzer.calculate_usefulness_score(
            analysis_result, 
            category, 
            len(content)
        )
        
        processing_time = time.time() - start_time
        
        logger.info(f"Text analysis completed for user {user_id} in {processing_time:.2f}s")
        
        return jsonify({
            'summary': summary,
            'score': min(100, max(0, int(score))),
            'category': category,
            'keywords': analysis_result['keywords'][:10],  # Limit to top 10 keywords
            'confidence': analysis_result['confidence'],
            'processingTime': processing_time
        })
        
    except Exception as e:
        logger.error(f"Text analysis error: {str(e)}")
        return jsonify({
            'error': {
                'code': 'ANALYSIS_ERROR',
                'message': 'Error analyzing text content'
            }
        }), 500

@app.route('/ai/analyze-youtube', methods=['POST'])
def analyze_youtube():
    """Analyze YouTube video content via transcript"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_URL',
                    'message': 'YouTube URL is required for analysis'
                }
            }), 400
        
        url = data['url']
        user_id = data.get('userId', 'anonymous')
        
        start_time = time.time()
        
        # Extract transcript
        transcript_result = youtube_analyzer.extract_transcript(url)
        
        if not transcript_result['success']:
            return jsonify({
                'error': {
                    'code': 'TRANSCRIPT_ERROR',
                    'message': transcript_result['error']
                }
            }), 400
        
        transcript_text = transcript_result['transcript']
        
        # Analyze transcript content
        analysis_result = text_analyzer.analyze(transcript_text)
        
        # Classify content
        category = classifier.classify(transcript_text, analysis_result['keywords'])
        
        # Generate summary
        summary = summarizer.summarize(transcript_text)
        
        # Calculate usefulness score (YouTube content gets slight boost for being video)
        score = text_analyzer.calculate_usefulness_score(
            analysis_result, 
            category, 
            len(transcript_text),
            content_type='youtube'
        )
        
        processing_time = time.time() - start_time
        
        logger.info(f"YouTube analysis completed for user {user_id} in {processing_time:.2f}s")
        
        return jsonify({
            'summary': summary,
            'score': min(100, max(0, int(score))),
            'category': category,
            'keywords': analysis_result['keywords'][:10],
            'confidence': analysis_result['confidence'],
            'processingTime': processing_time,
            'metadata': {
                'transcriptLength': len(transcript_text),
                'videoUrl': url
            }
        })
        
    except Exception as e:
        logger.error(f"YouTube analysis error: {str(e)}")
        return jsonify({
            'error': {
                'code': 'YOUTUBE_ANALYSIS_ERROR',
                'message': 'Error analyzing YouTube content'
            }
        }), 500

@app.route('/ai/summarize', methods=['POST'])
def summarize_content():
    """Generate summary for given content"""
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_CONTENT',
                    'message': 'Content is required for summarization'
                }
            }), 400
        
        content = data['content']
        max_length = data.get('maxLength', 200)
        
        summary = summarizer.summarize(content, max_length=max_length)
        
        return jsonify({
            'summary': summary,
            'originalLength': len(content),
            'summaryLength': len(summary)
        })
        
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return jsonify({
            'error': {
                'code': 'SUMMARIZATION_ERROR',
                'message': 'Error generating summary'
            }
        }), 500

@app.route('/ai/classify', methods=['POST'])
def classify_content():
    """Classify content as Useful, Neutral, or Waste"""
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': {
                    'code': 'MISSING_CONTENT',
                    'message': 'Content is required for classification'
                }
            }), 400
        
        content = data['content']
        keywords = data.get('keywords', [])
        
        category = classifier.classify(content, keywords)
        confidence = classifier.get_classification_confidence(content, keywords)
        
        return jsonify({
            'category': category,
            'confidence': confidence,
            'reasoning': classifier.get_classification_reasoning(content, category)
        })
        
    except Exception as e:
        logger.error(f"Classification error: {str(e)}")
        return jsonify({
            'error': {
                'code': 'CLASSIFICATION_ERROR',
                'message': 'Error classifying content'
            }
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': {
            'code': 'NOT_FOUND',
            'message': 'Endpoint not found'
        }
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': {
            'code': 'INTERNAL_ERROR',
            'message': 'Internal server error'
        }
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting FocusAI ML Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)