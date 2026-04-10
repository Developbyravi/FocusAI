import re
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

class YouTubeAnalyzer:
    def __init__(self):
        self.formatter = TextFormatter()

    def extract_transcript(self, url):
        """Extract transcript from YouTube URL"""
        try:
            # Extract video ID from URL
            video_id = self._extract_video_id(url)
            
            if not video_id:
                return {
                    'success': False,
                    'error': 'Invalid YouTube URL format'
                }
            
            # Try to get transcript
            try:
                # First try to get English transcript
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            except Exception:
                try:
                    # If English not available, try to get any available transcript
                    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
                except Exception:
                    try:
                        # Try to get auto-generated transcript
                        available_transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
                        transcript = available_transcripts.find_generated_transcript(['en'])
                        transcript_list = transcript.fetch()
                    except Exception as e:
                        return {
                            'success': False,
                            'error': f'No transcript available for this video: {str(e)}'
                        }
            
            # Format transcript to plain text
            transcript_text = self.formatter.format_transcript(transcript_list)
            
            # Clean up the transcript
            cleaned_transcript = self._clean_transcript(transcript_text)
            
            if len(cleaned_transcript.strip()) < 50:
                return {
                    'success': False,
                    'error': 'Transcript too short or empty'
                }
            
            return {
                'success': True,
                'transcript': cleaned_transcript,
                'video_id': video_id,
                'length': len(cleaned_transcript)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Error extracting transcript: {str(e)}'
            }

    def _extract_video_id(self, url):
        """Extract video ID from various YouTube URL formats"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})',
            r'youtu\.be\/([a-zA-Z0-9_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None

    def _clean_transcript(self, transcript):
        """Clean and format transcript text"""
        # Remove extra whitespace and newlines
        transcript = re.sub(r'\s+', ' ', transcript)
        
        # Remove common transcript artifacts
        transcript = re.sub(r'\[.*?\]', '', transcript)  # Remove [Music], [Applause], etc.
        transcript = re.sub(r'\(.*?\)', '', transcript)  # Remove (inaudible), etc.
        
        # Remove repeated words (common in auto-generated transcripts)
        words = transcript.split()
        cleaned_words = []
        prev_word = None
        repeat_count = 0
        
        for word in words:
            if word.lower() == prev_word:
                repeat_count += 1
                if repeat_count < 2:  # Allow one repeat
                    cleaned_words.append(word)
            else:
                cleaned_words.append(word)
                repeat_count = 0
            prev_word = word.lower()
        
        cleaned_transcript = ' '.join(cleaned_words)
        
        # Capitalize sentences
        sentences = re.split(r'[.!?]+', cleaned_transcript)
        capitalized_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence:
                sentence = sentence[0].upper() + sentence[1:] if len(sentence) > 1 else sentence.upper()
                capitalized_sentences.append(sentence)
        
        return '. '.join(capitalized_sentences) + '.' if capitalized_sentences else ''

    def get_video_metadata(self, url):
        """Get basic video metadata (placeholder for future enhancement)"""
        video_id = self._extract_video_id(url)
        
        if not video_id:
            return None
        
        # This is a placeholder - in a full implementation, you might use
        # YouTube Data API to get title, description, duration, etc.
        return {
            'video_id': video_id,
            'url': url,
            'platform': 'youtube'
        }