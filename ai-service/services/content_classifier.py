import re
from collections import Counter

class ContentClassifier:
    def __init__(self):
        # Define classification rules based on keywords and patterns
        self.useful_indicators = {
            'educational': {
                'keywords': ['learn', 'education', 'tutorial', 'guide', 'how to', 'explain', 'understand', 
                           'knowledge', 'skill', 'course', 'lesson', 'teach', 'study', 'research'],
                'weight': 3
            },
            'professional': {
                'keywords': ['career', 'business', 'professional', 'work', 'job', 'industry', 'strategy', 
                           'management', 'leadership', 'productivity', 'efficiency', 'success'],
                'weight': 2.5
            },
            'technical': {
                'keywords': ['technology', 'programming', 'development', 'software', 'engineering', 
                           'science', 'analysis', 'data', 'algorithm', 'system', 'method'],
                'weight': 2.5
            },
            'health_wellness': {
                'keywords': ['health', 'fitness', 'nutrition', 'wellness', 'exercise', 'mental health', 
                           'meditation', 'mindfulness', 'self-care', 'improvement'],
                'weight': 2
            },
            'finance': {
                'keywords': ['finance', 'investment', 'money', 'budget', 'savings', 'financial', 
                           'economy', 'market', 'trading', 'wealth'],
                'weight': 2
            }
        }
        
        self.waste_indicators = {
            'entertainment': {
                'keywords': ['funny', 'meme', 'viral', 'celebrity', 'gossip', 'drama', 'trending', 
                           'clickbait', 'shocking', 'unbelievable', 'crazy', 'weird'],
                'weight': 3
            },
            'low_quality': {
                'keywords': ['listicle', 'buzzfeed', 'quiz', 'which', 'personality test', 'horoscope', 
                           'astrology', 'random', 'you won\'t believe', 'amazing trick'],
                'weight': 2.5
            },
            'social_media': {
                'keywords': ['instagram', 'tiktok', 'snapchat', 'influencer', 'followers', 'likes', 
                           'viral video', 'challenge', 'trend', 'social media'],
                'weight': 2
            },
            'gaming': {
                'keywords': ['gaming', 'gamer', 'gameplay', 'streamer', 'twitch', 'esports', 
                           'video game', 'console', 'mobile game'],
                'weight': 1.5  # Gaming can be educational too
            }
        }
        
        # Neutral indicators
        self.neutral_indicators = {
            'news': {
                'keywords': ['news', 'breaking', 'report', 'update', 'current events', 'politics', 
                           'government', 'policy', 'election', 'world'],
                'weight': 1
            },
            'general': {
                'keywords': ['information', 'facts', 'overview', 'introduction', 'basic', 'general', 
                           'summary', 'review', 'discussion'],
                'weight': 1
            }
        }

    def classify(self, content, keywords=None):
        """Classify content as Useful, Neutral, or Waste"""
        if not content or len(content.strip()) < 10:
            return 'Neutral'
        
        content_lower = content.lower()
        all_keywords = keywords if keywords else []
        
        # Combine content and keywords for analysis
        analysis_text = content_lower + ' ' + ' '.join(all_keywords)
        
        # Calculate scores for each category
        useful_score = self._calculate_category_score(analysis_text, self.useful_indicators)
        waste_score = self._calculate_category_score(analysis_text, self.waste_indicators)
        neutral_score = self._calculate_category_score(analysis_text, self.neutral_indicators)
        
        # Apply content length factor
        length_factor = self._get_length_factor(len(content))
        useful_score *= length_factor
        
        # Apply structure quality factor
        structure_factor = self._get_structure_factor(content)
        useful_score *= structure_factor
        
        # Determine classification based on scores
        max_score = max(useful_score, waste_score, neutral_score)
        
        if max_score == 0:
            return 'Neutral'
        
        # Require significant difference for non-neutral classification
        threshold = max_score * 0.3
        
        if useful_score == max_score and useful_score > threshold:
            return 'Useful'
        elif waste_score == max_score and waste_score > threshold:
            return 'Waste'
        else:
            return 'Neutral'

    def _calculate_category_score(self, text, indicators):
        """Calculate score for a category based on keyword matches"""
        total_score = 0
        
        for category, data in indicators.items():
            keywords = data['keywords']
            weight = data['weight']
            
            matches = 0
            for keyword in keywords:
                # Count occurrences of keyword in text
                matches += len(re.findall(r'\b' + re.escape(keyword) + r'\b', text))
            
            category_score = matches * weight
            total_score += category_score
        
        return total_score

    def _get_length_factor(self, content_length):
        """Get factor based on content length"""
        if content_length < 100:
            return 0.7  # Short content less likely to be useful
        elif content_length < 500:
            return 1.0
        elif content_length < 2000:
            return 1.2  # Medium length content gets boost
        else:
            return 1.1  # Very long content slight boost

    def _get_structure_factor(self, content):
        """Get factor based on content structure quality"""
        factor = 1.0
        
        # Check for proper sentence structure
        sentences = re.split(r'[.!?]+', content)
        if len(sentences) > 2:
            avg_sentence_length = len(content.split()) / len(sentences)
            if 5 <= avg_sentence_length <= 25:  # Good sentence length
                factor += 0.1
        
        # Check for presence of questions (educational indicator)
        question_count = len(re.findall(r'\?', content))
        if question_count > 0:
            factor += min(0.2, question_count * 0.05)
        
        # Check for lists or structured content
        if re.search(r'(\n\s*[-*•]\s+|\d+\.\s+)', content):
            factor += 0.1
        
        # Penalize excessive capitalization (clickbait indicator)
        caps_ratio = sum(1 for c in content if c.isupper()) / len(content) if content else 0
        if caps_ratio > 0.1:
            factor -= min(0.3, caps_ratio)
        
        return max(0.5, factor)

    def get_classification_confidence(self, content, keywords=None):
        """Get confidence score for classification"""
        if not content:
            return 0.1
        
        content_lower = content.lower()
        analysis_text = content_lower + ' ' + ' '.join(keywords if keywords else [])
        
        useful_score = self._calculate_category_score(analysis_text, self.useful_indicators)
        waste_score = self._calculate_category_score(analysis_text, self.waste_indicators)
        neutral_score = self._calculate_category_score(analysis_text, self.neutral_indicators)
        
        total_score = useful_score + waste_score + neutral_score
        
        if total_score == 0:
            return 0.3  # Low confidence for unclear content
        
        max_score = max(useful_score, waste_score, neutral_score)
        confidence = max_score / total_score
        
        # Adjust confidence based on content length
        if len(content) > 500:
            confidence = min(1.0, confidence + 0.1)
        elif len(content) < 100:
            confidence = max(0.1, confidence - 0.2)
        
        return round(confidence, 2)

    def get_classification_reasoning(self, content, category):
        """Get reasoning for classification decision"""
        reasoning_map = {
            'Useful': [
                'Contains educational or professional keywords',
                'Has structured content with good sentence length',
                'Includes technical or skill-building information',
                'Shows characteristics of informative content'
            ],
            'Waste': [
                'Contains entertainment or clickbait keywords',
                'Shows characteristics of low-quality content',
                'Focuses on viral or trending topics',
                'Lacks educational or professional value'
            ],
            'Neutral': [
                'Mixed indicators for usefulness and entertainment',
                'General information without clear educational focus',
                'News or informational content',
                'Insufficient indicators for clear classification'
            ]
        }
        
        return reasoning_map.get(category, ['Classification based on content analysis'])