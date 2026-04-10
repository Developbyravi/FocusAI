require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const analyzeRoutes = require('./routes/analyze');
const chatRoutes = require('./routes/chat');
const sessionRoutes = require('./routes/session');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/session', sessionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FocusAI server running' });
});

// MongoDB connection (optional - app works without it)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB optional - skipping:', err.message));
}

app.listen(PORT, () => {
  console.log(`FocusAI server running on http://localhost:${PORT}`);
});
