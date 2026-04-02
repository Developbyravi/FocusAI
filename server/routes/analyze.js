const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const auth = require('../middleware/auth');
const ContentAnalysis = require('../models/ContentAnalysis');

const router = express.Router();

// AI Service URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// @route   POST /api/analyze
// @desc    Analyze content (text or YouTube URL)
// @access  Private
router.post('/', auth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Content must be between 1 and 50,000 characters'),
  body('type')
    .isIn(['text', 'youtube'])
    .withMessage('Type must be either "text" or "youtube"'),
  body('url')
    .optional()
    .isURL()
    .withMessage('URL must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array(),
          timestamp: new Date().toISOString()
        }
      });
    }

    const { content, type, url } = req.body;
    const startTime = Date.now();

    // Validate YouTube URL if type is youtube
    if (type === 'youtube' && (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url))) {
      return res.status(400).json({
        error: {
          code: 'INVALID_YOUTUBE_URL',
          message: 'Invalid YouTube URL format',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Call AI service for analysis
    let aiResponse;
    try {
      const aiEndpoint = type === 'youtube' ? '/ai/analyze-youtube' : '/ai/analyze-text';
      aiResponse = await axios.post(`${AI_SERVICE_URL}${aiEndpoint}`, {
        content,
        url,
        userId: req.user._id.toString()
      }, {
        timeout: 30000 // 30 second timeout
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Fallback response when AI service is unavailable
      const fallbackAnalysis = {
        summary: 'Content analysis temporarily unavailable. Please try again later.',
        score: 50,
        category: 'Neutral',
        keywords: ['analysis', 'unavailable'],
        confidence: 0.1
      };

      const contentAnalysis = new ContentAnalysis({
        userId: req.user._id,
        content: {
          original: content,
          type,
          url: url || undefined
        },
        analysis: fallbackAnalysis,
        metadata: {
          processingTime: Date.now() - startTime,
          contentLength: content.length,
          language: 'en'
        }
      });

      await contentAnalysis.save();

      return res.status(503).json({
        error: {
          code: 'AI_SERVICE_UNAVAILABLE',
          message: 'AI analysis service is temporarily unavailable',
          timestamp: new Date().toISOString()
        },
        fallback: {
          analysis: fallbackAnalysis,
          id: contentAnalysis._id
        }
      });
    }

    const processingTime = Date.now() - startTime;
    const { summary, score, category, keywords, confidence } = aiResponse.data;

    // Save analysis to database
    const contentAnalysis = new ContentAnalysis({
      userId: req.user._id,
      content: {
        original: content,
        type,
        url: url || undefined
      },
      analysis: {
        summary,
        score,
        category,
        keywords: keywords || [],
        confidence: confidence || 0.5
      },
      metadata: {
        processingTime,
        contentLength: content.length,
        language: 'en'
      }
    });

    await contentAnalysis.save();

    // Update user analytics
    await req.user.updateOne({
      $inc: { 'analytics.totalAnalyses': 1 }
    });

    res.json({
      message: 'Content analyzed successfully',
      analysis: {
        id: contentAnalysis._id,
        summary,
        score,
        category,
        keywords: keywords || [],
        confidence: confidence || 0.5,
        processingTime
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: {
        code: 'ANALYSIS_ERROR',
        message: 'Error analyzing content',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   GET /api/analyze/history
// @desc    Get user's analysis history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await ContentAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content.original'); // Exclude original content for performance

    const total = await ContentAnalysis.countDocuments({ userId: req.user._id });

    res.json({
      analyses,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: {
        code: 'HISTORY_FETCH_ERROR',
        message: 'Error fetching analysis history',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   GET /api/analyze/:id
// @desc    Get specific analysis
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await ContentAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: 'Analysis not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({ analysis });

  } catch (error) {
    console.error('Analysis fetch error:', error);
    res.status(500).json({
      error: {
        code: 'ANALYSIS_FETCH_ERROR',
        message: 'Error fetching analysis',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   DELETE /api/analyze/:id
// @desc    Delete specific analysis
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await ContentAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: 'Analysis not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Analysis deletion error:', error);
    res.status(500).json({
      error: {
        code: 'ANALYSIS_DELETE_ERROR',
        message: 'Error deleting analysis',
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;