const express = require('express');
const router = express.Router();
const { callGrok } = require('../utils/grok');
const {
  detectInputType,
  extractYouTubeContent,
  extractArticleContent,
  extractTextContent,
  getVideoContent,
  CONFIDENCE,
} = require('../utils/extractor');
const { buildAnalysisPrompt, buildRoadmapPrompt } = require('../utils/prompts');

// POST /api/analyze
router.post('/', async (req, res) => {
  const { input, goal = 'Learn something new', userKeywords } = req.body;

  if (!input || !input.trim()) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const inputType = detectInputType(input);
    let extracted;

    if (inputType === 'youtube') {
      extracted = await extractYouTubeContent(input);

      // Layer 4 override: if user supplied keywords, blend them in
      if (userKeywords && extracted.confidence.level === 'minimal') {
        extracted.content = `Video topic keywords provided by user: ${userKeywords}. ${extracted.content}`;
        extracted.confidence = CONFIDENCE.MINIMAL;
        extracted.fallbackMessage = 'Analysis based on user-provided keywords.';
      }
    } else if (inputType === 'article') {
      extracted = await extractArticleContent(input);
    } else {
      extracted = extractTextContent(input);
    }

    const { system, user } = buildAnalysisPrompt(
      extracted.content,
      goal,
      inputType,
      extracted.confidence
    );

    // Debug: log what we're actually sending to the AI
    console.log(`[Analyze] Input type: ${inputType} | Content length: ${extracted.content.length} chars | Confidence: ${extracted.confidence?.level || 'n/a'}`);
    console.log(`[Analyze] Content preview: "${extracted.content.slice(0, 100).replace(/\n/g, ' ')}..."`);

    const rawResponse = await callGrok(system, user);

    let analysis;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response', raw: rawResponse });
    }

    // Attach confidence info to analysis
    analysis.confidenceLevel  = extracted.confidence?.level  || 'high';
    analysis.confidenceScore  = extracted.confidence?.score  || 95;
    analysis.confidenceLabel  = extracted.confidence?.label  || 'Transcript available';
    analysis.fallbackMessage  = extracted.fallbackMessage    || null;

    // Validate score integrity — ensure breakdown sums match total
    if (analysis.scoreBreakdown) {
      const { clarity = 0, depth = 0, relevance = 0, usefulness = 0 } = analysis.scoreBreakdown;
      const computedTotal = clarity + depth + relevance + usefulness;
      if (Math.abs(computedTotal - analysis.score) > 3) {
        console.warn(`[Analyze] Score mismatch: breakdown sums to ${computedTotal} but score is ${analysis.score}. Correcting.`);
        analysis.score = computedTotal;
      }
    }

    console.log(`[Analyze] Final score: ${analysis.score}/100 | Classification: ${analysis.classification} | Confidence: ${analysis.confidenceLevel}`);

    return res.json({
      success: true,
      inputType,
      title:    extracted.title,
      embedUrl: extracted.embedUrl  || null,
      videoId:  extracted.videoId   || null,
      url:      extracted.url       || null,
      goal,
      analysis,
    });
  } catch (err) {
    console.error('Analysis error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/analyze/keywords  — Layer 4: user supplies keywords when no content found
router.post('/keywords', async (req, res) => {
  const { videoId, keywords, goal = 'Learn something new' } = req.body;
  if (!videoId || !keywords) {
    return res.status(400).json({ error: 'videoId and keywords are required' });
  }

  try {
    const content = `User-provided topic keywords for YouTube video ${videoId}: ${keywords}`;
    const { system, user } = buildAnalysisPrompt(content, goal, 'youtube', CONFIDENCE.MINIMAL);
    const rawResponse = await callGrok(system, user);

    let analysis;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    analysis.confidenceLevel = 'minimal';
    analysis.confidenceScore = 15;
    analysis.confidenceLabel = 'Using user-provided keywords only';
    analysis.fallbackMessage = 'Analysis based on user-provided keywords.';

    return res.json({ success: true, analysis });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/analyze/roadmap
router.post('/roadmap', async (req, res) => {
  const { topic, currentLevel } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  try {
    const { system, user } = buildRoadmapPrompt(topic, currentLevel);
    const rawResponse = await callGrok(system, user);

    let roadmap;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      roadmap = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      return res.status(500).json({ error: 'Failed to parse roadmap', raw: rawResponse });
    }

    return res.json({ success: true, roadmap });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/analyze/feedback
router.post('/feedback', async (req, res) => {
  const { sessionId, analysisId, useful, learned } = req.body;
  return res.json({ success: true, message: 'Feedback recorded', sessionId, useful, learned });
});

module.exports = router;
