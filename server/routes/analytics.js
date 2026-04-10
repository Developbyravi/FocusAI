const express = require('express');
const auth = require('../middleware/auth');
const ContentAnalysis = require('../models/ContentAnalysis');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total analyses count
    const totalAnalyses = await ContentAnalysis.countDocuments({ userId });
    
    // Get category breakdown
    const categoryBreakdown = await ContentAnalysis.aggregate([
      { $match: { userId } },
      { $group: { _id: '$analysis.category', count: { $sum: 1 } } }
    ]);
    
    // Get average score
    const scoreStats = await ContentAnalysis.aggregate([
      { $match: { userId } },
      { 
        $group: { 
          _id: null, 
          avgScore: { $avg: '$analysis.score' },
          maxScore: { $max: '$analysis.score' },
          minScore: { $min: '$analysis.score' }
        } 
      }
    ]);
    
    // Get recent analyses (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAnalyses = await ContentAnalysis.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 }).limit(5);
    
    // Calculate productivity score (weighted average of useful content)
    const productivityData = await ContentAnalysis.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$analysis.category',
          count: { $sum: 1 },
          avgScore: { $avg: '$analysis.score' }
        }
      }
    ]);
    
    let productivityScore = 0;
    if (productivityData.length > 0) {
      const useful = productivityData.find(p => p._id === 'Useful') || { count: 0, avgScore: 0 };
      const waste = productivityData.find(p => p._id === 'Waste') || { count: 0, avgScore: 0 };
      const neutral = productivityData.find(p => p._id === 'Neutral') || { count: 0, avgScore: 0 };
      
      const totalCount = useful.count + waste.count + neutral.count;
      if (totalCount > 0) {
        productivityScore = Math.round(
          ((useful.count * useful.avgScore) + (neutral.count * neutral.avgScore * 0.5)) / 
          (totalCount * 100) * 100
        );
      }
    }
    
    res.json({
      totalAnalyses,
      productivityScore: Math.min(100, Math.max(0, productivityScore)),
      categoryBreakdown: categoryBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      scoreStats: scoreStats[0] || { avgScore: 0, maxScore: 0, minScore: 0 },
      recentAnalyses: recentAnalyses.map(analysis => ({
        id: analysis._id,
        summary: analysis.analysis.summary,
        score: analysis.analysis.score,
        category: analysis.analysis.category,
        createdAt: analysis.createdAt
      }))
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Error fetching dashboard analytics',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   GET /api/analytics/productivity-score
// @desc    Get detailed productivity score calculation
// @access  Private
router.get('/productivity-score', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const productivityData = await ContentAnalysis.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            category: '$analysis.category',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$analysis.score' },
          totalScore: { $sum: '$analysis.score' }
        }
      },
      { $sort: { '_id.date': -1 } }
    ]);
    
    res.json({
      productivityData,
      calculation: {
        formula: 'Weighted average based on useful content percentage and scores',
        factors: ['Content category', 'Individual scores', 'Recency weight']
      }
    });

  } catch (error) {
    console.error('Productivity score error:', error);
    res.status(500).json({
      error: {
        code: 'PRODUCTIVITY_ERROR',
        message: 'Error calculating productivity score',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   GET /api/analytics/time-tracking
// @desc    Get time spent analytics
// @access  Private
router.get('/time-tracking', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Estimate time spent based on content length and reading speed
    const timeData = await ContentAnalysis.aggregate([
      { $match: { userId } },
      {
        $addFields: {
          estimatedReadTime: {
            $divide: ['$metadata.contentLength', 200] // Assume 200 words per minute
          }
        }
      },
      {
        $group: {
          _id: '$analysis.category',
          totalTime: { $sum: '$estimatedReadTime' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const timeBreakdown = timeData.reduce((acc, item) => {
      acc[item._id.toLowerCase()] = Math.round(item.totalTime);
      return acc;
    }, {});
    
    res.json({
      timeSpent: {
        useful: timeBreakdown.useful || 0,
        waste: timeBreakdown.waste || 0,
        neutral: timeBreakdown.neutral || 0
      },
      unit: 'minutes',
      note: 'Estimated based on content length and average reading speed'
    });

  } catch (error) {
    console.error('Time tracking error:', error);
    res.status(500).json({
      error: {
        code: 'TIME_TRACKING_ERROR',
        message: 'Error fetching time tracking data',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   GET /api/analytics/content-breakdown
// @desc    Get detailed content analysis breakdown
// @access  Private
router.get('/content-breakdown', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const breakdown = await ContentAnalysis.aggregate([
      { 
        $match: { 
          userId,
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: {
            category: '$analysis.category',
            type: '$content.type',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$analysis.score' },
          totalProcessingTime: { $sum: '$metadata.processingTime' }
        }
      },
      { $sort: { '_id.date': -1 } }
    ]);
    
    res.json({
      breakdown,
      period: `Last ${days} days`,
      summary: {
        totalEntries: breakdown.length,
        avgProcessingTime: breakdown.reduce((sum, item) => sum + item.totalProcessingTime, 0) / breakdown.length || 0
      }
    });

  } catch (error) {
    console.error('Content breakdown error:', error);
    res.status(500).json({
      error: {
        code: 'BREAKDOWN_ERROR',
        message: 'Error fetching content breakdown',
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;