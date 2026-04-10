const express = require('express');
const router = express.Router();

// In-memory session store (fallback when MongoDB is not available)
const sessions = {};

// POST /api/session/create
router.post('/create', (req, res) => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  sessions[sessionId] = {
    sessionId,
    goal: req.body.goal || '',
    analyses: [],
    createdAt: new Date(),
    stats: { useful: 0, neutral: 0, waste: 0, totalAnalyzed: 0 },
  };
  return res.json({ success: true, sessionId });
});

// GET /api/session/:id
router.get('/:id', (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  return res.json({ success: true, session });
});

// POST /api/session/:id/record
router.post('/:id/record', (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const { title, score, classification, inputType } = req.body;
  session.analyses.push({ title, score, classification, inputType, timestamp: new Date() });
  session.stats.totalAnalyzed++;
  if (classification === 'Useful') session.stats.useful++;
  else if (classification === 'Waste') session.stats.waste++;
  else session.stats.neutral++;

  return res.json({ success: true, stats: session.stats });
});

module.exports = router;
