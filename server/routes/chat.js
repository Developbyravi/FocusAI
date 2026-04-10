const express = require('express');
const router = express.Router();
const { callGrokChat } = require('../utils/grok');

// POST /api/chat
router.post('/', async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const systemMessage = {
      role: 'system',
      content: `You are FocusAI Assistant, an intelligent learning companion. You help users understand content, clarify doubts, and guide their learning journey.
${context ? `\nCurrent content context:\n${JSON.stringify(context, null, 2)}` : ''}
Be concise, clear, and educational. Focus on helping the user learn effectively.`,
    };

    const fullMessages = [systemMessage, ...messages];
    const reply = await callGrokChat(fullMessages);

    return res.json({ success: true, reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
