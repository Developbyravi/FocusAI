const mongoose = require('mongoose');

const contentAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    original: {
      type: String,
      required: true,
      maxlength: [50000, 'Content cannot exceed 50,000 characters']
    },
    type: {
      type: String,
      enum: ['text', 'youtube'],
      required: true
    },
    url: {
      type: String,
      validate: {
        validator: function(v) {
          if (this.content.type === 'youtube') {
            return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(v);
          }
          return true;
        },
        message: 'Invalid YouTube URL format'
      }
    }
  },
  analysis: {
    summary: {
      type: String,
      required: true,
      maxlength: [1000, 'Summary cannot exceed 1000 characters']
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    category: {
      type: String,
      enum: ['Useful', 'Neutral', 'Waste'],
      required: true
    },
    keywords: [{
      type: String,
      maxlength: [50, 'Keyword cannot exceed 50 characters']
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  },
  metadata: {
    processingTime: {
      type: Number,
      min: 0
    },
    contentLength: {
      type: Number,
      min: 0
    },
    language: {
      type: String,
      default: 'en',
      maxlength: [5, 'Language code cannot exceed 5 characters']
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
contentAnalysisSchema.index({ userId: 1, createdAt: -1 });
contentAnalysisSchema.index({ 'analysis.category': 1 });
contentAnalysisSchema.index({ 'analysis.score': -1 });

module.exports = mongoose.model('ContentAnalysis', contentAnalysisSchema);