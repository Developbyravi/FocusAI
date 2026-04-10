/**
 * Builds a deeply specific, content-driven analysis prompt.
 * Key design decisions:
 *  - Scores are derived from ACTUAL content characteristics, not generic rules
 *  - Each dimension has explicit rubric anchors so the model can't default to 60/100
 *  - Temperature is raised to 0.7 in grok.js for analysis calls
 *  - Content fingerprint (first 120 chars) is embedded so the model is forced
 *    to reference the real text, preventing copy-paste generic responses
 */
function buildAnalysisPrompt(content, userGoal, contentType, confidence) {
  const contentLen = content?.length || 0;
  const snippet = content ? content.slice(0, 120).replace(/\n/g, ' ') : '';
  const fullContent = content ? content.slice(0, 6000) : '';

  // Confidence-specific instruction injected into the prompt
  const confidenceInstruction = confidence
    ? buildConfidenceInstruction(confidence)
    : '';

  return {
    system: `You are FocusAI — a brutally honest, highly specific content analysis engine.
Your ONLY job is to evaluate the EXACT content provided and return a JSON object.

CRITICAL RULES — violating any of these is a failure:
1. NEVER return the same score for different content. Scores MUST reflect actual content quality.
2. NEVER write generic summaries. Every sentence must reference something specific from the content.
3. NEVER default to middle scores (50-65). Use the full 0-100 range based on evidence.
4. Each scoreBreakdown dimension must be justified by a specific observation from the content.
5. Return ONLY valid JSON — no markdown fences, no extra text, no explanation outside JSON.`,

    user: `Analyze this ${contentType} content for a user whose goal is: "${userGoal}"

━━━ CONTENT (${contentLen} characters) ━━━
${fullContent}
━━━ END CONTENT ━━━

Content fingerprint (first 120 chars): "${snippet}"
${confidenceInstruction}

━━━ SCORING RUBRIC ━━━
Score each dimension 0–25 based on EVIDENCE from the content above:

CLARITY (0–25):
  0–6   = Confusing, jargon-heavy, hard to follow
  7–12  = Somewhat clear but has unclear sections
  13–18 = Mostly clear with minor ambiguities
  19–25 = Crystal clear, well-structured, easy to follow

DEPTH (0–25):
  0–6   = Surface-level only, no substance
  7–12  = Some detail but misses key aspects
  13–18 = Good depth with solid explanations
  19–25 = Comprehensive, expert-level detail

RELEVANCE to goal "${userGoal}" (0–25):
  0–6   = Completely off-topic
  7–12  = Loosely related
  13–18 = Mostly relevant with some tangents
  19–25 = Directly addresses the goal throughout

USEFULNESS (0–25):
  0–6   = No actionable value
  7–12  = Some value but mostly theoretical
  13–18 = Practical with actionable takeaways
  19–25 = Highly actionable, immediately applicable

Total score = sum of all four dimensions (0–100).

━━━ CLASSIFICATION RULES ━━━
Useful  → score ≥ 65 AND relevance ≥ 13
Neutral → score 35–64 OR relevance 7–12
Waste   → score < 35 OR relevance < 7

━━━ REQUIRED JSON OUTPUT ━━━
Return EXACTLY this structure (no extra fields, no missing fields):
{
  "score": <integer 0-100, sum of breakdown>,
  "scoreBreakdown": {
    "clarity":    <integer 0-25>,
    "depth":      <integer 0-25>,
    "relevance":  <integer 0-25>,
    "usefulness": <integer 0-25>
  },
  "scoreJustification": {
    "clarity":    "<one specific sentence citing evidence from the content>",
    "depth":      "<one specific sentence citing evidence from the content>",
    "relevance":  "<one specific sentence citing evidence from the content>",
    "usefulness": "<one specific sentence citing evidence from the content>"
  },
  "classification": "<Useful|Neutral|Waste>",
  "classificationReason": "<one sentence referencing specific content>",
  "summary": "<3-5 sentences — MUST mention specific topics/concepts from the content>",
  "keyInsights": [
    "<specific insight 1 from the content>",
    "<specific insight 2 from the content>",
    "<specific insight 3 from the content>",
    "<specific insight 4 from the content>",
    "<specific insight 5 from the content>"
  ],
  "compressedEssentials": "<2-3 sentences of the absolute core message — be specific>",
  "roadmap": [
    {"level": "Beginner",      "topics": ["<topic from content>", "<related topic>"], "resources": ["<specific resource>"]},
    {"level": "Intermediate",  "topics": ["<topic>", "<topic>"],                      "resources": ["<specific resource>"]},
    {"level": "Advanced",      "topics": ["<topic>", "<topic>"],                      "resources": ["<specific resource>"]}
  ],
  "recommendations": [
    {"title": "<specific better resource>", "reason": "<why it improves on this content>", "searchQuery": "<exact YouTube search>"},
    {"title": "<specific better resource>", "reason": "<why it improves on this content>", "searchQuery": "<exact YouTube search>"},
    {"title": "<specific better resource>", "reason": "<why it improves on this content>", "searchQuery": "<exact YouTube search>"}
  ],
  "shortVideoAlternative": {
    "title": "<specific shorter alternative>",
    "searchQuery": "<exact YouTube search query>",
    "reason": "<specific reason based on this content's weaknesses>"
  },
  "timeToConsume": "<estimated minutes as integer>",
  "focusScore": <integer 0-100 — penalise if content has filler, repetition, or tangents>,
  "productivityTip": "<one specific, actionable tip derived from THIS content>"
}`,
  };
}

function buildConfidenceInstruction(confidence) {
  const instructions = {
    high:    `DATA QUALITY: Full transcript available. Base ALL scores on the actual spoken content.`,
    medium:  `DATA QUALITY: Auto-generated captions used (may have minor errors). Score based on the caption text but note any apparent transcription issues in your summary.`,
    low:     `DATA QUALITY: Only title/description available — no transcript or captions. Scores should reflect this limitation: cap depth at 12/25 max since you cannot evaluate the actual spoken content. Clearly note in summary that this is metadata-only analysis.`,
    minimal: `DATA QUALITY: User-provided keywords only. This is highly limited data. Cap all scores at 10/25 max. Be explicit in summary that this is keyword-based inference only.`,
  };
  return `\n⚠️  ${instructions[confidence.level] || instructions.low}`;
}

function buildRoadmapPrompt(topic, currentLevel) {
  return {
    system: `You are FocusAI learning roadmap generator. Return valid JSON only. No markdown, no extra text.`,
    user: `Generate a detailed, specific learning roadmap for: "${topic}"
Current level: ${currentLevel || 'Beginner'}

Return EXACTLY this JSON structure:
{
  "topic": "${topic}",
  "totalWeeks": <integer>,
  "phases": [
    {
      "phase": "<phase name>",
      "duration": "<e.g. Week 1-2>",
      "goals": ["<specific measurable goal>"],
      "topics": ["<specific topic>", "<specific topic>"],
      "resources": ["<specific named resource>"],
      "projects": ["<concrete mini project>"]
    }
  ],
  "finalProject": "<specific capstone project idea>",
  "careerPaths": ["<specific career option>"]
}`,
  };
}

module.exports = { buildAnalysisPrompt, buildRoadmapPrompt };
