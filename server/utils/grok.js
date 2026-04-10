const axios = require('axios');

const GROK_API_URL = process.env.GROK_API_URL || 'https://api.groq.com/openai/v1';
const GROK_API_KEY = process.env.GROK_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

/**
 * callGrok — used for content analysis.
 * temperature: 0.7 → forces varied, content-specific responses (not generic 60/100 defaults)
 * max_tokens: 2500 → enough room for full JSON with justifications
 */
async function callGrok(systemPrompt, userPrompt) {
  if (!GROK_API_KEY) throw new Error('GROK_API_KEY is not set in environment variables');

  console.log(`[Grok] Sending request — content length: ${userPrompt.length} chars`);

  const response = await axios.post(
    `${GROK_API_URL}/chat/completions`,
    {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.7,   // higher = more varied, content-specific scores
      max_tokens:  2500,
    },
    {
      headers: {
        Authorization: `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const reply = response.data.choices[0].message.content;
  console.log(`[Grok] Response received — ${reply.length} chars`);
  return reply;
}

/**
 * callGrokChat — used for the interactive chat assistant.
 * temperature: 0.6 → conversational but grounded
 */
async function callGrokChat(messages) {
  if (!GROK_API_KEY) throw new Error('GROK_API_KEY is not set in environment variables');

  const response = await axios.post(
    `${GROK_API_URL}/chat/completions`,
    {
      model: MODEL,
      messages,
      temperature: 0.6,
      max_tokens:  1000,
    },
    {
      headers: {
        Authorization: `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { callGrok, callGrokChat };
