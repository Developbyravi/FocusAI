import re
import nltk
from collections import Counter
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class ContentSummarizer:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        
    def summarize(self, content, max_length=200, num_sentences=3):
        """Generate extractive summary of content"""
        if not content or len(content.strip()) < 50:
            return content.strip()
        
        # Clean the content
        cleaned_content = self._clean_content(content)
        
        # Split into sentences
        sentences = sent_tokenize(cleaned_content)
        
        if len(sentences) <= num_sentences:
            return cleaned_content
        
        # Score sentences based on importance
        sentence_scores = self._score_sentences(sentences)
        
        # Select top sentences
        top_sentences = self._select_top_sentences(sentences, sentence_scores, num_sentences)
        
        # Generate summary
        summary = ' '.join(top_sentences)
        
        # Ensure summary doesn't exceed max_length
        if len(summary) > max_length:
            summary = self._truncate_to_length(summary, max_length)
        
        return summary

    def _clean_content(self, content):
        """Clean content for better processing"""
        # Remove URLs
        content = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', content)
        
        # Remove extra whitespace
        content = re.sub(r'\s+', ' ', content)
        
        # Remove common transcript artifacts
        content = re.sub(r'\[.*?\]', '', content)  # [Music], [Applause]
        content = re.sub(r'\(.*?\)', '', content)  # (inaudible)
        
        return content.strip()

    def _score_sentences(self, sentences):
        """Score sentences based on various factors"""
        if not sentences:
            return {}
        
        # Calculate word frequencies (excluding stop words)
        word_freq = self._calculate_word_frequencies(sentences)
        
        sentence_scores = {}
        
        for i, sentence in enumerate(sentences):
            score = 0
            words = word_tokenize(sentence.lower())
            words = [word for word in words if word.isalnum() and word not in self.stop_words]
            
            if not words:
                sentence_scores[i] = 0
                continue
            
            # Base score from word frequencies
            for word in words:
                score += word_freq.get(word, 0)
            
            # Normalize by sentence length
            score = score / len(words)
            
            # Position bonus (first and last sentences often important)
            if i == 0:
                score *= 1.2  # First sentence bonus
            elif i == len(sentences) - 1:
                score *= 1.1  # Last sentence bonus
            elif i < len(sentences) * 0.3:
                score *= 1.1  # Early sentences bonus
            
            # Length penalty for very short or very long sentences
            sentence_length = len(words)
            if sentence_length < 5:
                score *= 0.5  # Too short
            elif sentence_length > 30:
                score *= 0.8  # Too long
            
            # Keyword bonus
            score += self._calculate_keyword_bonus(sentence)
            
            sentence_scores[i] = score
        
        return sentence_scores

    def _calculate_word_frequencies(self, sentences):
        """Calculate word frequencies across all sentences"""
        all_words = []
        
        for sentence in sentences:
            words = word_tokenize(sentence.lower())
            words = [word for word in words if word.isalnum() and word not in self.stop_words]
            all_words.extend(words)
        
        if not all_words:
            return {}
        
        word_freq = Counter(all_words)
        
        # Normalize frequencies
        max_freq = max(word_freq.values())
        for word in word_freq:
            word_freq[word] = word_freq[word] / max_freq
        
        return word_freq

    def _calculate_keyword_bonus(self, sentence):
        """Calculate bonus score for sentences with important keywords"""
        important_keywords = [
            'important', 'key', 'main', 'primary', 'essential', 'crucial', 'significant',
            'conclusion', 'summary', 'result', 'finding', 'discovery', 'insight',
            'first', 'second', 'third', 'finally', 'lastly', 'in conclusion',
            'therefore', 'thus', 'consequently', 'as a result', 'because', 'since'
        ]
        
        sentence_lower = sentence.lower()
        bonus = 0
        
        for keyword in important_keywords:
            if keyword in sentence_lower:
                bonus += 0.1
        
        # Question sentences often important
        if '?' in sentence:
            bonus += 0.2
        
        # Sentences with numbers or statistics
        if re.search(r'\d+', sentence):
            bonus += 0.1
        
        return bonus

    def _select_top_sentences(self, sentences, sentence_scores, num_sentences):
        """Select top sentences maintaining original order"""
        # Sort by score but keep track of original indices
        scored_sentences = [(i, score) for i, score in sentence_scores.items()]
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        
        # Select top sentences
        selected_indices = [i for i, score in scored_sentences[:num_sentences]]
        selected_indices.sort()  # Maintain original order
        
        return [sentences[i] for i in selected_indices]

    def _truncate_to_length(self, text, max_length):
        """Truncate text to maximum length while preserving sentence structure"""
        if len(text) <= max_length:
            return text
        
        # Try to truncate at sentence boundary
        sentences = sent_tokenize(text)
        truncated = ""
        
        for sentence in sentences:
            if len(truncated + sentence) <= max_length - 3:  # Leave room for "..."
                truncated += sentence + " "
            else:
                break
        
        if truncated:
            return truncated.strip() + "..."
        else:
            # If even first sentence is too long, truncate at word boundary
            words = text.split()
            truncated_words = []
            current_length = 0
            
            for word in words:
                if current_length + len(word) + 1 <= max_length - 3:
                    truncated_words.append(word)
                    current_length += len(word) + 1
                else:
                    break
            
            return ' '.join(truncated_words) + "..."

    def get_key_points(self, content, num_points=5):
        """Extract key points from content"""
        sentences = sent_tokenize(content)
        
        if len(sentences) <= num_points:
            return sentences
        
        sentence_scores = self._score_sentences(sentences)
        top_sentences = self._select_top_sentences(sentences, sentence_scores, num_points)
        
        return top_sentences