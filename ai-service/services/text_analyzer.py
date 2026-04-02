import re
import nltk
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

class TextAnalyzer:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        
        # Keywords that indicate useful content
        self.useful_keywords = {
            'educational': ['learn', 'education', 'tutorial', 'guide', 'how-to', 'explain', 'understand', 'knowledge', 'skill', 'course'],
            'professional': ['career', 'business', 'professional', 'work', 'job', 'industry', 'strategy', 'management', 'leadership'],
            'technical': ['technology', 'programming', 'development', 'software', 'engineering', 'science', 'research', 'analysis'],
            'productivity': ['productivity', 'efficiency', 'optimization', 'improvement', 'growth', 'success', 'achievement', 'goal']
        }
        
        # Keywords that indicate waste content
        self.waste_keywords = {
            'entertainment': ['funny', 'meme', 'viral', 'celebrity', 'gossip', 'drama', 'trending', 'clickbait'],
            'distraction': ['random', 'weird', 'crazy', 'shocking', 'unbelievable', 'you won\'t believe', 'amazing'],
            'low_value': ['listicle', 'buzzfeed', 'quiz', 'which', 'personality', 'horoscope', 'astrology']
        }

    def analyze(self, text):
        """Analyze text and extract features for classification"""
        if not text or len(text.strip()) == 0:
            return {
                'keywords': [],
                'confidence': 0.0,
                'features': {}
            }
        
        # Clean and preprocess text
        cleaned_text = self._clean_text(text)
        
        # Extract keywords using TF-IDF
        keywords = self._extract_keywords(cleaned_text)
        
        # Calculate various features
        features = self._calculate_features(text, cleaned_text, keywords)
        
        # Calculate confidence based on text quality and length
        confidence = self._calculate_confidence(text, features)
        
        return {
            'keywords': keywords,
            'confidence': confidence,
            'features': features
        }

    def _clean_text(self, text):
        """Clean and preprocess text"""
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text.lower()

    def _extract_keywords(self, text):
        """Extract keywords using TF-IDF"""
        try:
            # Tokenize and remove stop words
            tokens = word_tokenize(text)
            filtered_tokens = [word for word in tokens if word not in self.stop_words and len(word) > 2]
            
            if len(filtered_tokens) < 3:
                return []
            
            # Use TF-IDF to find important terms
            tfidf_matrix = self.tfidf_vectorizer.fit_transform([' '.join(filtered_tokens)])
            feature_names = self.tfidf_vectorizer.get_feature_names_out()
            tfidf_scores = tfidf_matrix.toarray()[0]
            
            # Get top keywords
            keyword_scores = list(zip(feature_names, tfidf_scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Return top 15 keywords
            return [keyword for keyword, score in keyword_scores[:15] if score > 0]
            
        except Exception as e:
            print(f"Keyword extraction error: {e}")
            # Fallback to simple word frequency
            tokens = word_tokenize(text)
            filtered_tokens = [word for word in tokens if word not in self.stop_words and len(word) > 2]
            word_freq = Counter(filtered_tokens)
            return [word for word, freq in word_freq.most_common(10)]

    def _calculate_features(self, original_text, cleaned_text, keywords):
        """Calculate various text features"""
        sentences = sent_tokenize(original_text)
        words = word_tokenize(cleaned_text)
        
        features = {
            'length': len(original_text),
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_sentence_length': len(words) / len(sentences) if sentences else 0,
            'keyword_density': len(keywords) / len(words) if words else 0,
            'useful_keyword_count': self._count_category_keywords(keywords, self.useful_keywords),
            'waste_keyword_count': self._count_category_keywords(keywords, self.waste_keywords)
        }
        
        return features

    def _count_category_keywords(self, keywords, category_dict):
        """Count keywords that match specific categories"""
        count = 0
        for category, category_keywords in category_dict.items():
            for keyword in keywords:
                if any(cat_word in keyword.lower() for cat_word in category_keywords):
                    count += 1
        return count

    def _calculate_confidence(self, text, features):
        """Calculate confidence score based on text quality"""
        confidence = 0.5  # Base confidence
        
        # Adjust based on text length
        if features['length'] > 100:
            confidence += 0.1
        if features['length'] > 500:
            confidence += 0.1
        if features['length'] > 1000:
            confidence += 0.1
        
        # Adjust based on sentence structure
        if features['avg_sentence_length'] > 5 and features['avg_sentence_length'] < 30:
            confidence += 0.1
        
        # Adjust based on keyword quality
        if features['useful_keyword_count'] > 0:
            confidence += 0.1
        
        return min(1.0, max(0.1, confidence))

    def calculate_usefulness_score(self, analysis_result, category, content_length, content_type='text'):
        """Calculate usefulness score based on analysis results"""
        base_score = 50  # Neutral starting point
        
        features = analysis_result['features']
        keywords = analysis_result['keywords']
        
        # Category-based scoring
        if category == 'Useful':
            base_score = 75
        elif category == 'Waste':
            base_score = 25
        else:  # Neutral
            base_score = 50
        
        # Adjust based on useful keywords
        useful_boost = min(20, features['useful_keyword_count'] * 5)
        base_score += useful_boost
        
        # Penalize waste keywords
        waste_penalty = min(20, features['waste_keyword_count'] * 3)
        base_score -= waste_penalty
        
        # Content length adjustment
        if content_length > 1000:
            base_score += 5  # Longer content might be more comprehensive
        elif content_length < 100:
            base_score -= 10  # Very short content might be low quality
        
        # Content type adjustment
        if content_type == 'youtube':
            base_score += 5  # Video content gets slight boost
        
        # Confidence adjustment
        confidence_factor = analysis_result['confidence']
        base_score = base_score * confidence_factor + (50 * (1 - confidence_factor))
        
        return max(0, min(100, base_score))