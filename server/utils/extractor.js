const axios = require('axios');
const cheerio = require('cheerio');

// ─── Confidence levels ────────────────────────────────────────────────────────
const CONFIDENCE = {
  HIGH:    { level: 'high',    label: 'Full transcript available',               score: 95 },
  MEDIUM:  { level: 'medium',  label: 'Using auto-generated captions',           score: 65 },
  LOW:     { level: 'low',     label: 'Limited data – using metadata only',      score: 30 },
  MINIMAL: { level: 'minimal', label: 'Using user-provided keywords only',       score: 15 },
};

// ─── Input type detection ─────────────────────────────────────────────────────
function detectInputType(input) {
  const t = input.trim();
  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(t)) return 'youtube';
  if (/^https?:\/\//.test(t)) return 'article';
  return 'text';
}

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ─── Text cleaning ────────────────────────────────────────────────────────────
function cleanText(raw) {
  if (!raw) return '';
  let text = raw
    .replace(/\[.*?\]/g, ' ')                         // [Music], [Applause], etc.
    .replace(/\(.*?\)/g, ' ')                         // (laughter), etc.
    .replace(/\d{1,2}:\d{2}(:\d{2})?/g, ' ')         // timestamps 0:00 / 00:00:00
    .replace(/&#\d+;/g, ' ')                          // HTML numeric entities
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')   // common HTML entities
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove consecutive duplicate phrases (caption stutter artefact)
  text = text.replace(/(\b\w[\w\s]{2,40})\s+\1/gi, '$1');

  // Keep only sentences with ≥ 4 words (filters out noise fragments)
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const meaningful = sentences.filter(s => s.trim().split(/\s+/).length >= 4);
  const result = (meaningful.length ? meaningful.join(' ') : text).trim();

  console.log(`[Extractor] cleanText: ${raw.length} → ${result.length} chars`);
  return result.slice(0, 8000);
}

// ─── Fetch YouTube page ONCE and extract everything from it ──────────────────
async function fetchYouTubePage(videoId) {
  const res = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
    timeout: 12000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  return res.data;
}

// ─── Parse caption tracks from page HTML ─────────────────────────────────────
function parseCaptionTracks(html) {
  // YouTube embeds caption data in multiple possible locations
  const patterns = [
    /"captionTracks":\s*(\[[\s\S]*?\])\s*,\s*"audioTracks"/,
    /"captionTracks":\s*(\[[\s\S]*?\])\s*}/,
    /"captionTracks":\s*(\[.*?\])/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        const tracks = JSON.parse(match[1]);
        if (Array.isArray(tracks) && tracks.length > 0) return tracks;
      } catch { /* try next pattern */ }
    }
  }
  return null;
}

// ─── Fetch and parse a timed-text XML URL ────────────────────────────────────
async function fetchCaptionXml(baseUrl) {
  const res = await axios.get(baseUrl, { timeout: 8000 });
  const $ = cheerio.load(res.data, { xmlMode: true });
  const lines = [];
  $('text').each((_, el) => {
    const t = $(el).text().trim();
    if (t) lines.push(t);
  });
  return lines;
}

// ─── Layer 1 + 2 combined: single page fetch, try manual then ASR ─────────────
async function fetchTranscriptOrCaptions(videoId) {
  console.log(`[Extractor] Fetching YouTube page for ${videoId}...`);
  const html = await fetchYouTubePage(videoId);

  const tracks = parseCaptionTracks(html);
  if (!tracks) {
    console.log('[Extractor] No caption tracks found in page HTML');
    return null;
  }

  console.log(`[Extractor] Found ${tracks.length} caption track(s):`,
    tracks.map(t => `${t.languageCode}(${t.kind || 'manual'})`).join(', '));

  // Priority order: manual EN → any manual → ASR EN → any ASR → first available
  const preferred =
    tracks.find(t => t.languageCode === 'en' && t.kind !== 'asr') ||
    tracks.find(t => t.kind !== 'asr') ||
    tracks.find(t => t.languageCode === 'en' && t.kind === 'asr') ||
    tracks.find(t => t.kind === 'asr') ||
    tracks[0];

  if (!preferred?.baseUrl) {
    console.log('[Extractor] No usable caption track URL');
    return null;
  }

  const isManual = preferred.kind !== 'asr';
  console.log(`[Extractor] Using track: ${preferred.languageCode} / ${preferred.kind || 'manual'}`);

  const lines = await fetchCaptionXml(preferred.baseUrl);
  if (lines.length === 0) {
    console.log('[Extractor] Caption XML was empty');
    return null;
  }

  console.log(`[Extractor] Got ${lines.length} caption lines`);
  return { text: lines.join(' '), isManual };
}

// ─── Layer 3: Metadata (title + description) ─────────────────────────────────
async function fetchMetadata(videoId) {
  let title = `YouTube Video (${videoId})`;
  let description = '';

  try {
    const oembed = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 5000 }
    );
    title = oembed.data.title || title;
    console.log(`[Extractor] oEmbed title: "${title}"`);
  } catch (e) {
    console.log(`[Extractor] oEmbed failed: ${e.message}`);
  }

  try {
    const html = await fetchYouTubePage(videoId);
    const $ = cheerio.load(html);
    description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      '';
    if (description) console.log(`[Extractor] Got description (${description.length} chars)`);
  } catch (e) {
    console.log(`[Extractor] Metadata page fetch failed: ${e.message}`);
  }

  return { title, description };
}

// ─── Main: getVideoContent with full fallback chain ──────────────────────────
async function getVideoContent(videoId) {
  let content = '';
  let confidence = CONFIDENCE.HIGH;
  let fallbackMessage = null;
  let title = `YouTube Video (${videoId})`;

  // ── Layers 1 & 2: transcript / captions ──
  try {
    const result = await fetchTranscriptOrCaptions(videoId);

    if (result && result.text && result.text.trim().length > 50) {
      content = cleanText(result.text);

      if (result.isManual) {
        confidence = CONFIDENCE.HIGH;
        fallbackMessage = null;
        console.log(`[Extractor] ✅ Layer 1 – manual transcript (${content.length} chars)`);
      } else {
        confidence = CONFIDENCE.MEDIUM;
        fallbackMessage = 'Using auto-generated captions (may have minor inaccuracies)';
        console.log(`[Extractor] ✅ Layer 2 – auto-generated captions (${content.length} chars)`);
      }
    } else {
      throw new Error('No usable transcript or captions');
    }
  } catch (e12) {
    console.log(`[Extractor] ⚠️  Layers 1+2 failed: ${e12.message}`);

    // ── Layer 3: Metadata ──
    try {
      const meta = await fetchMetadata(videoId);
      title = meta.title;
      const combined = [meta.title, meta.description].filter(Boolean).join('. ');
      content = cleanText(combined);

      if (content.length < 30) throw new Error('Metadata too short to be useful');

      confidence = CONFIDENCE.LOW;
      fallbackMessage = 'Limited data – summary may be less accurate (no transcript or captions found)';
      console.log(`[Extractor] ✅ Layer 3 – metadata fallback (${content.length} chars)`);
    } catch (e3) {
      console.log(`[Extractor] ⚠️  Layer 3 failed: ${e3.message}`);

      // ── Layer 4: Minimal stub ──
      content = `YouTube video ID: ${videoId}. No transcript, captions, or metadata could be retrieved.`;
      confidence = CONFIDENCE.MINIMAL;
      fallbackMessage = 'Could not extract any content. Please provide keywords to improve analysis.';
      console.log('[Extractor] ⚠️  Layer 4 – minimal stub');
    }
  }

  // Fetch title if we don't have it yet
  if (title === `YouTube Video (${videoId})`) {
    try {
      const oembed = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { timeout: 5000 }
      );
      title = oembed.data.title || title;
    } catch { /* ignore */ }
  }

  console.log(`[Extractor] Final: confidence=${confidence.level}, contentLen=${content.length}, title="${title}"`);
  return { content, confidence, fallbackMessage, title };
}

// ─── Public extractors ────────────────────────────────────────────────────────
async function extractYouTubeContent(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('Invalid YouTube URL');

  const { content, confidence, fallbackMessage, title } = await getVideoContent(videoId);

  return {
    type: 'youtube',
    videoId,
    title,
    content,
    confidence,
    fallbackMessage,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}

async function extractArticleContent(url) {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });

  const $ = cheerio.load(response.data);
  $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar').remove();

  const title = $('title').text().trim() || $('h1').first().text().trim() || 'Article';

  let content = '';
  for (const sel of ['article', 'main', '.content', '.post-content', '.entry-content', 'body']) {
    const text = $(sel).text().trim();
    if (text.length > 200) { content = text; break; }
  }

  content = cleanText(content) || 'Could not extract article content.';
  console.log(`[Extractor] Article extracted: "${title}" (${content.length} chars)`);
  return { type: 'article', title, url, content };
}

function extractTextContent(text) {
  const content = cleanText(text) || text.trim().slice(0, 8000);
  console.log(`[Extractor] Plain text: ${content.length} chars`);
  return { type: 'text', title: 'Plain Text Input', content };
}

module.exports = {
  detectInputType,
  extractYouTubeId,
  extractYouTubeContent,
  extractArticleContent,
  extractTextContent,
  getVideoContent,
  cleanText,
  CONFIDENCE,
};
