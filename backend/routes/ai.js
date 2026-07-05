// Gemini proxy — keeps the API key server-side so it never ships in the
// client bundle. The response (status + body) is passed through verbatim so
// the frontend's quota-hint parsing and model-fallback logic keep working.
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Models the frontend may request; anything else is rejected.
const ALLOWED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-lite-latest',
]);

// AI generation gets its own budget (the small global API limit would starve
// a classroom generating papers behind one school IP).
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many AI requests from this IP. Please retry in 60s.' } },
});

router.post('/generate', aiLimiter, async (req, res) => {
  const { model, contents, generationConfig } = req.body || {};

  if (!ALLOWED_MODELS.has(model)) {
    return res.status(400).json({ error: { message: `Unsupported model: ${model}` } });
  }
  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: { message: '"contents" must be a non-empty array' } });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(503).json({ error: { message: 'AI service is not configured on the server (missing GEMINI_API_KEY)' } });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig }),
        signal: AbortSignal.timeout(120000),
      }
    );
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    const msg = (e.name === 'TimeoutError' || e.name === 'AbortError')
      ? 'Upstream AI request timed out'
      : `Upstream AI request failed: ${e.message}`;
    res.status(502).json({ error: { message: msg } });
  }
});

module.exports = router;
