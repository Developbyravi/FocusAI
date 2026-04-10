const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: {
          code: 'NO_TOKEN',
          message: 'No token provided, authorization denied',
          timestamp: new Date().toISOString()
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token is not valid',
          timestamp: new Date().toISOString()
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token is not valid',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.status(500).json({
      error: {
        code: 'AUTH_ERROR',
        message: 'Server error during authentication',
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = auth;