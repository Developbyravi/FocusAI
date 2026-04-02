const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data store (in-memory)
const mockUsers = [];
const mockAnalyses = [];
let userIdCounter = 1;
let analysisIdCounter = 1;

// Mock Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({ error: { message: 'User already exists' } });
  }
  
  const user = {
    id: userIdCounter++,
    email,
    name,
    createdAt: new Date()
  };
  
  mockUsers.push({ ...user, password });
  
  res.json({
    user,
    token: 'mock-jwt-token-' + user.id
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid credentials' } });
  }
  
  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token: 'mock-jwt-token-' + user.id
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    user: {
      id: 1,
      email: 'demo@focusai.com',
      name: 'Demo User'
    }
  });
});

// Mock Analyze Routes
app.post('/api/analyze', async (req, res) => {
  const { url, content, type } = req.body;
  
  try {
    // Call AI service for real analysis
    const axios = require('axios');
    const aiResponse = await axios.post('http://localhost:5001/ai/analyze-text', {
      content: content || `Content from ${url}`
    });
    
    const aiData = aiResponse.data;
    
    const analysis = {
      id: analysisIdCounter++,
      url,
      type: type || 'text',
      usefulnessScore: aiData.score,
      summary: aiData.summary,
      categories: [aiData.category],
      sentiment: aiData.sentiment,
      keyPoints: aiData.keywords.map(kw => `Key insight about: ${kw}`),
      createdAt: new Date()
    };
    
    mockAnalyses.push(analysis);
    
    res.json(analysis);
  } catch (error) {
    // Fallback to mock data if AI service is unavailable
    const analysis = {
      id: analysisIdCounter++,
      url,
      type: type || 'text',
      usefulnessScore: Math.floor(Math.random() * 40) + 60,
      summary: 'This is a mock summary of the content. The actual AI analysis would provide detailed insights here.',
      categories: ['Technology', 'Productivity'],
      sentiment: 'positive',
      keyPoints: [
        'Main point 1 from the content',
        'Main point 2 from the content',
        'Main point 3 from the content'
      ],
      createdAt: new Date()
    };
    
    mockAnalyses.push(analysis);
    
    res.json(analysis);
  }
});

app.get('/api/analyze/history', (req, res) => {
  res.json({
    analyses: mockAnalyses.slice(-10).reverse(),
    total: mockAnalyses.length
  });
});

app.get('/api/analyze/:id', (req, res) => {
  const analysis = mockAnalyses.find(a => a.id === parseInt(req.params.id));
  
  if (!analysis) {
    return res.status(404).json({ error: { message: 'Analysis not found' } });
  }
  
  res.json(analysis);
});

// Mock Analytics Routes
app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    totalAnalyses: mockAnalyses.length,
    averageScore: 75,
    productivityScore: 82,
    timeSpent: 3600,
    recentActivity: mockAnalyses.slice(-5).reverse()
  });
});

app.get('/api/analytics/productivity-score', (req, res) => {
  res.json({
    score: 82,
    trend: 'up',
    history: [
      { date: '2024-01-01', score: 75 },
      { date: '2024-01-02', score: 78 },
      { date: '2024-01-03', score: 82 }
    ]
  });
});

app.get('/api/analytics/time-tracking', (req, res) => {
  res.json({
    today: 3600,
    week: 18000,
    month: 72000,
    breakdown: {
      productive: 2800,
      neutral: 600,
      unproductive: 200
    }
  });
});

// Mock Recommendations Routes
app.get('/api/recommendations', (req, res) => {
  res.json({
    recommendations: [
      {
        id: 1,
        title: 'Learn React Hooks',
        url: 'https://react.dev/learn',
        score: 95,
        reason: 'Based on your interest in web development'
      },
      {
        id: 2,
        title: 'Productivity Tips',
        url: 'https://example.com/productivity',
        score: 88,
        reason: 'Matches your productivity goals'
      }
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FocusAI API Server (Dev Mode - No Database)',
    mode: 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong!',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      timestamp: new Date().toISOString()
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Mode: Development (No Database)`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
