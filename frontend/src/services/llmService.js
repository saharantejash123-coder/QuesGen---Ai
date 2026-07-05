// LLM API Integration using Gemini
// All calls route through the backend proxy (POST /api/ai/generate) so the
// Gemini API key stays server-side. A direct browser→Google call happens only
// when VITE_GEMINI_API_KEY is explicitly set (local-dev escape hatch).
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

// Models ordered by preference; each has a separate free-tier quota bucket
// Note: 1.5-flash and 1.5-flash-8b removed — not available on v1beta (404)
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Client-side rate limiter ───────────────────────────────────────────────
// Gemini free tier allows ~15 requests/min per model. All calls funnel through
// a single queue that (a) runs one request at a time and (b) enforces a
// minimum gap between request starts, so parallel UI actions (e.g. two tabs
// generating papers) can't burst past the quota and trigger 429 storms.
const MIN_REQUEST_GAP_MS = 4100;
let rateChain = Promise.resolve();
let lastRequestStart = 0;

function withRateLimit(fn) {
  const run = rateChain.then(async () => {
    const wait = lastRequestStart + MIN_REQUEST_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestStart = Date.now();
    return fn();
  });
  // Keep the chain alive even if a request rejects
  rateChain = run.catch(() => {});
  return run;
}

// Parse "Please retry in 45.4s" hint from quota error messages
function parseRetryDelay(errMsg) {
  const m = errMsg && errMsg.match(/retry in ([\d.]+)s/i);
  return m ? Math.ceil(parseFloat(m[1]) * 1000) : 0;
}

// Wait between models: respect the quota hint but cap at 60s; skip if longer
async function waitBetweenModels(lastError, modelName) {
  const delay = Math.max(parseRetryDelay(lastError), 1500);
  if (delay > 60000) {
    console.warn(`[LLM] ${modelName} quota window too long (${(delay/1000).toFixed(0)}s), skipping immediately`);
    return;
  }
  await sleep(delay);
}

// Retry a model once if we get a 429 with a reasonable retry delay
async function retryOnQuota(apiKey, model, body, timeoutMs = 90000) {
  const { data, error } = await geminiPost(apiKey, model, body, timeoutMs);
  if (!error) return { data, error: null };
  // Only retry quota errors (no error object shape to check, so look for key phrases)
  if (error && (error.includes('quota') || error.includes('rate limit') || error.includes('429'))) {
    const delay = parseRetryDelay(error);
    if (delay > 0 && delay <= 60000) {
      console.warn(`[LLM] ${model} quota hit, retrying after ${(delay/1000).toFixed(0)}s...`);
      await sleep(delay + 500);
      return await geminiPost(apiKey, model, body, timeoutMs);
    }
  }
  return { data, error };
}

export function geminiPost(apiKey, model, body, timeoutMs = 90000) {
  return withRateLimit(() => geminiPostNow(apiKey, model, body, timeoutMs));
}

async function geminiPostNow(apiKey, model, body, timeoutMs = 90000) {
  // Direct mode only when a client-side key was explicitly configured;
  // otherwise go through the secure backend proxy.
  const direct = !!apiKey;
  const url = direct
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    : `${BACKEND_URL}/api/ai/generate`;
  const payload = direct ? body : { model, ...body };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    console.log(`[LLM] Calling ${model} via ${direct ? 'direct API' : 'backend proxy'} (timeout ${timeoutMs / 1000}s)...`);
    const start = Date.now();

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify(payload),
    });
    clearTimeout(t);

    const data = await res.json();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (data.error) {
      console.warn(`[LLM] ${model} error after ${elapsed}s:`, data.error.message);
      return { data: null, error: data.error.message };
    }

    console.log(`[LLM] ${model} OK in ${elapsed}s`);
    return { data, error: null };
  } catch (e) {
    clearTimeout(t);
    const msg = e.name === 'AbortError'
      ? `Request to ${model} timed out after ${timeoutMs / 1000}s`
      : `Network error calling ${model}: ${e.message}`;
    console.warn(`[LLM] ${msg}`);
    return { data: null, error: msg };
  }
}

function extractText(data) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

// Fallback sanitizer for models that ignore JSON mode
function stripFences(s) {
  if (!s) return s;
  if (s.startsWith('```json')) s = s.slice(7).replace(/```\s*$/, '').trim();
  else if (s.startsWith('```')) s = s.slice(3).replace(/```\s*$/, '').trim();
  return s.trim();
}

function sanitizeJson(text) {
  if (!text) return text;
  let s = stripFences(text);
  s = s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  s = s.replace(/,\s*([}\]])/g, '$1');

  // State machine: escape bare control chars inside JSON strings
  let out = '', inStr = false, esc = false;
  for (const ch of s) {
    if (esc)          { out += ch; esc = false; continue; }
    if (ch === '\\' && inStr) { out += ch; esc = true; continue; }
    if (ch === '"')   { inStr = !inStr; out += ch; continue; }
    if (inStr) {
      if (ch === '\n') { out += '\\n'; continue; }
      if (ch === '\r') { out += '\\r'; continue; }
      if (ch === '\t') { out += '\\t'; continue; }
    }
    out += ch;
  }
  return out.trim();
}

// Attempt to recover truncated JSON array by closing open brackets/strings
function recoverTruncatedJson(text) {
  if (!text) return text;
  let s = text.trim();
  // If it ends mid-string, close the string
  let inStr = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; }
  }
  if (inStr) s += '"';
  // Count open/close braces and brackets
  let openBrace = 0, openBracket = 0;
  inStr = false; esc = false;
  for (const ch of s) {
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') openBrace++;
    if (ch === '}') openBrace--;
    if (ch === '[') openBracket++;
    if (ch === ']') openBracket--;
  }
  while (openBrace > 0) { s += '}'; openBrace--; }
  while (openBracket > 0) { s += ']'; openBracket--; }
  return s;
}

// ─── JSON mode schemas (Gemini forces valid JSON output with these) ────────────

const ADAPTIVE_Q_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      id:          { type: 'STRING' },
      text:        { type: 'STRING' },
      options:     { type: 'ARRAY', items: { type: 'STRING' } },
      answer:      { type: 'STRING' },
      difficulty:  { type: 'INTEGER' },
      chapter:     { type: 'STRING' },
      explanation: { type: 'STRING' },
    },
    required: ['text', 'options', 'answer', 'difficulty', 'chapter', 'explanation'],
  },
};

const QUESTION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    text:    { type: 'STRING' },
    type:    { type: 'STRING' },
    options: { type: 'ARRAY', items: { type: 'STRING' } },
    conf:    { type: 'INTEGER' },
  },
  required: ['text', 'type', 'conf'],
};

const PAPER_SCHEMA = {
  type: 'OBJECT',
  properties: {
    sections: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id:               { type: 'STRING' },
          name:             { type: 'STRING' },
          marksPerQuestion: { type: 'NUMBER' },
          count:            { type: 'INTEGER' },
          type:             { type: 'STRING' },
          questions:        { type: 'ARRAY', items: QUESTION_SCHEMA },
        },
        required: ['id', 'name', 'marksPerQuestion', 'count', 'type', 'questions'],
      },
    },
  },
  required: ['sections'],
};

const VAULT_QUESTION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    no:     { type: 'INTEGER' },
    text:   { type: 'STRING' },
    answer: { type: 'STRING' },
    topic:  { type: 'STRING' },
    optionA: { type: 'STRING' },
    optionB: { type: 'STRING' },
    optionC: { type: 'STRING' },
    optionD: { type: 'STRING' },
  },
  required: ['no', 'text'],
};

const VAULT_PAPER_SCHEMA = {
  type: 'OBJECT',
  properties: {
    metadata: {
      type: 'OBJECT',
      properties: {
        board:       { type: 'STRING' },
        class:       { type: 'STRING' },
        subject:     { type: 'STRING' },
        year:        { type: 'INTEGER' },
        set:         { type: 'STRING' },
        totalMarks:  { type: 'INTEGER' },
        time:        { type: 'STRING' },
        generatedBy: { type: 'STRING' },
      },
      required: ['board', 'class', 'subject', 'year', 'totalMarks', 'time'],
    },
    generalInstructions: { type: 'ARRAY', items: { type: 'STRING' } },
    sections: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id:              { type: 'STRING' },
          name:            { type: 'STRING' },
          type:            { type: 'STRING' },
          marksPerQuestion: { type: 'INTEGER' },
          questions:       { type: 'ARRAY', items: VAULT_QUESTION_SCHEMA },
        },
        required: ['id', 'name', 'type', 'questions'],
      },
    },
    answerKey: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          qNo:    { type: 'INTEGER' },
          answer: { type: 'STRING' },
          marks:  { type: 'INTEGER' },
        },
        required: ['qNo', 'answer', 'marks'],
      },
    },
  },
  required: ['metadata', 'sections'],
};

// ─────────────────────────────────────────────────────
// ADAPTIVE TESTING: Generate fresh MCQ questions via AI
// ─────────────────────────────────────────────────────
export const generateAdaptiveQuestionsWithLLM = async (
  apiKey,
  { board, cls, subject, chapter, count = 10, weakAreas = {}, sessionSeed = '', difficultyMix = null }
) => {
  const key = API_KEY || apiKey; // empty key → backend proxy

  const weakChapterList = Object.entries(weakAreas)
    .filter(([, s]) => s < 60)
    .map(([ch]) => ch)
    .join(', ');

  // Adaptive difficulty mapping: the mix is derived from the student's rolling
  // performance (see pipelineService.getDifficultyProfile). Falls back to a
  // balanced first-test distribution.
  const mix = difficultyMix || { easy: 30, medium: 50, hard: 20 };

  const prompt = `You are an expert MCQ question setter for ${board} Board, ${cls}, Subject: ${subject}.
Generate exactly ${count} unique, high-quality Multiple Choice Questions for the topic: "${chapter}".

Rules:
- Each question must have exactly 4 options.
- Only ONE option is correct — the "answer" field must exactly match one of the options strings.
- Vary difficulty: ~${mix.easy}% easy (difficulty 1), ~${mix.medium}% medium (difficulty 2), ~${mix.hard}% hard (difficulty 3).
- Distractors must be plausible.
- ${weakChapterList ? `Emphasise weak sub-topics: ${weakChapterList}.` : 'Cover diverse sub-concepts.'}
- Session seed: "${sessionSeed}" — ensures unique questions each run.
- Include a short explanation (1-2 sentences) for the correct answer.`;

  let lastError = '';

  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await waitBetweenModels(lastError, MODELS[i - 1]);

    const { data, error } = await retryOnQuota(key, MODELS[i], {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: ADAPTIVE_Q_SCHEMA,
      },
    }, 90000);

    if (error) { lastError = error; continue; }

    const text = extractText(data);
    if (!text) continue;

    try {
      const qs = JSON.parse(sanitizeJson(text));
      if (Array.isArray(qs) && qs.length > 0) {
        console.log(`[LLM] Parsed ${qs.length} adaptive questions from ${MODELS[i]}`);
        return qs.map((q, idx) => ({ ...q, id: `ai_${Date.now()}_${idx}` }));
      }
    } catch (parseErr) {
      console.warn(`[LLM] JSON parse failed for ${MODELS[i]}:`, parseErr.message);
      // Try truncated JSON recovery as last resort
      try {
        const recovered = recoverTruncatedJson(sanitizeJson(text));
        const qs = JSON.parse(recovered);
        if (Array.isArray(qs) && qs.length > 0) {
          console.log(`[LLM] Recovered ${qs.length} adaptive questions from truncated ${MODELS[i]} response`);
          return qs.map((q, idx) => ({ ...q, id: `ai_${Date.now()}_${idx}` }));
        }
      } catch (recoverErr) {
        console.warn(`[LLM] Recovery also failed for ${MODELS[i]}:`, recoverErr.message);
      }
      console.warn(`[LLM] Raw text (first 300 chars):`, text.slice(0, 300));
      lastError = `Parse failed: ${parseErr.message}`;
    }
  }

  console.warn('[LLM] All models failed for adaptive questions. Last error:', lastError);
  return null;
};

// ─────────────────────────────────────────────────────
// ORACLE ENGINE: Generate full exam paper via AI
// ─────────────────────────────────────────────────────
export const generatePaperWithLLM = async (apiKey, board, cls, subject, blueprint) => {
  const key = API_KEY || apiKey; // empty key → backend proxy

  const sectionInstructions = blueprint.sections.map(sec =>
    `- ${sec.name}: Generate ${sec.count} questions of type '${sec.type}' worth ${sec.marksPerQuestion} marks each.`
  ).join('\n');

  const prompt = `You are an expert exam paper setter for ${board} board, ${cls}, Subject: ${subject}.
Generate a complete mock examination paper following this blueprint exactly:
${sectionInstructions}

Assign an "conf" score (70-99) per question indicating exam probability.`;

  let lastError = '';
  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await waitBetweenModels(lastError, MODELS[i - 1]);

    const { data, error } = await retryOnQuota(key, MODELS[i], {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: PAPER_SCHEMA,
      },
    }, 120000);

    if (error) { lastError = error; console.warn(`[LLM] Paper gen ${MODELS[i]} error:`, error); continue; }

    const text = extractText(data);
    if (!text) continue;

    try {
      const paper = JSON.parse(sanitizeJson(text));
      if (paper.sections?.length > 0) {
        console.log(`[LLM] Generated paper with ${paper.sections.length} sections from ${MODELS[i]}`);
        return paper;
      }
    } catch (parseErr) {
      console.warn(`[LLM] Paper parse failed for ${MODELS[i]}:`, parseErr.message);
      // Try truncated JSON recovery
      try {
        const recovered = recoverTruncatedJson(sanitizeJson(text));
        const paper = JSON.parse(recovered);
        if (paper.sections?.length > 0) {
          console.log(`[LLM] Recovered paper from truncated ${MODELS[i]} response`);
          return paper;
        }
      } catch (recoverErr) {
        console.warn(`[LLM] Paper recovery also failed:`, recoverErr.message);
      }
      lastError = `Parse failed: ${parseErr.message}`;
    }
  }

  console.warn('[LLM] All models failed for paper generation');
  return null;
};

// ─────────────────────────────────────────────────────
// VAULT-15: Generate a past-paper style exam via AI
// ─────────────────────────────────────────────────────
export const generateVaultPaperWithLLM = async (apiKey, { board, cls, subject, year, set = 'Set 1' }) => {
  const key = API_KEY || apiKey; // empty key → backend proxy

  const blueprints = {
    Mathematics:      { totalMarks:80, time:'3 Hours', sections:[{id:'A',name:'Section A',type:'MCQ',marks:1,count:20},{id:'B',name:'Section B',type:'VSA',marks:2,count:5},{id:'C',name:'Section C',type:'SA',marks:3,count:6},{id:'D',name:'Section D',type:'LA',marks:5,count:4},{id:'E',name:'Section E',type:'Case',marks:4,count:3}]},
    Physics:          { totalMarks:70, time:'3 Hours', sections:[{id:'A',name:'Section A',type:'MCQ',marks:1,count:16},{id:'B',name:'Section B',type:'VSA',marks:2,count:5},{id:'C',name:'Section C',type:'SA',marks:3,count:7},{id:'D',name:'Section D',type:'Case',marks:4,count:2},{id:'E',name:'Section E',type:'LA',marks:5,count:3}]},
    Chemistry:        { totalMarks:70, time:'3 Hours', sections:[{id:'A',name:'Section A',type:'MCQ',marks:1,count:16},{id:'B',name:'Section B',type:'VSA',marks:2,count:5},{id:'C',name:'Section C',type:'SA',marks:3,count:7},{id:'D',name:'Section D',type:'Case',marks:4,count:2},{id:'E',name:'Section E',type:'LA',marks:5,count:3}]},
    Biology:          { totalMarks:70, time:'3 Hours', sections:[{id:'A',name:'Section A',type:'MCQ',marks:1,count:16},{id:'B',name:'Section B',type:'VSA',marks:2,count:5},{id:'C',name:'Section C',type:'SA',marks:3,count:7},{id:'D',name:'Section D',type:'Case',marks:4,count:2},{id:'E',name:'Section E',type:'LA',marks:5,count:3}]},
    Science:          { totalMarks:80, time:'3 Hours', sections:[{id:'A',name:'Section A',type:'MCQ',marks:1,count:20},{id:'B',name:'Section B',type:'VSA',marks:2,count:6},{id:'C',name:'Section C',type:'SA',marks:3,count:7},{id:'D',name:'Section D',type:'LA',marks:5,count:3},{id:'E',name:'Section E',type:'Case',marks:4,count:3}]},
    English:          { totalMarks:80, time:'3 Hours', sections:[{id:'A',name:'Section A — Reading Skills',type:'Reading',marks:20,count:2},{id:'B',name:'Section B — Writing Skills',type:'Writing',marks:20,count:3},{id:'C',name:'Section C — Grammar',type:'Grammar',marks:20,count:5},{id:'D',name:'Section D — Literature',type:'Literature',marks:20,count:4}]},
    Hindi:            { totalMarks:80, time:'3 Hours', sections:[{id:'A',name:'अपठित बोध',type:'Reading',marks:20,count:2},{id:'B',name:'व्याकरण',type:'Grammar',marks:20,count:6},{id:'C',name:'पाठ्यपुस्तक',type:'Literature',marks:25,count:5},{id:'D',name:'लेखन',type:'Writing',marks:15,count:3}]},
    'Social Science': { totalMarks:80, time:'3 Hours', sections:[{id:'A',name:'Section A',type:'MCQ',marks:1,count:20},{id:'B',name:'Section B',type:'SA',marks:3,count:7},{id:'C',name:'Section C',type:'LA',marks:5,count:5},{id:'D',name:'Section D',type:'Map',marks:5,count:2}]},
  };

  const bp = blueprints[subject] || blueprints['Science'];
  const sectionDesc = bp.sections.map(s =>
    `- Section ${s.id} "${s.name}" (${s.type}): ${s.count} question(s), ${s.marks} mark(s) each`
  ).join('\n');

  const prompt = `You are an expert exam paper setter replicating real ${board} Board ${cls} ${subject} papers.
Simulate the ${year} Annual Examination — ${set}. Match authentic topic coverage and difficulty.

Blueprint:
${sectionDesc}
Total Marks: ${bp.totalMarks} | Time: ${bp.time}

For MCQ questions, put the 4 option texts in optionA, optionB, optionC, optionD fields.
The "answer" field for MCQ should be "A", "B", "C", or "D".
Generate the complete paper now.`;

  let lastError = '';
  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await waitBetweenModels(lastError, MODELS[i - 1]);

    const { data, error } = await retryOnQuota(key, MODELS[i], {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: VAULT_PAPER_SCHEMA,
      },
    }, 120000);

    if (error) { lastError = error; console.warn(`[LLM] Vault paper ${MODELS[i]} error:`, error); continue; }

    const text = extractText(data);
    if (!text) continue;

    try {
      const result = JSON.parse(sanitizeJson(text));
      console.log(`[LLM] Generated vault paper from ${MODELS[i]}`);
      return result;
    } catch (parseErr) {
      console.warn(`[LLM] Vault paper parse failed for ${MODELS[i]}:`, parseErr.message);
      try {
        const recovered = recoverTruncatedJson(sanitizeJson(text));
        const result = JSON.parse(recovered);
        console.log(`[LLM] Recovered vault paper from truncated ${MODELS[i]} response`);
        return result;
      } catch (recoverErr) {
        console.warn(`[LLM] Vault paper recovery also failed:`, recoverErr.message);
      }
      lastError = `Parse failed: ${parseErr.message}`;
    }
  }

  throw new Error('AI is temporarily overloaded. Please try again in a moment.');
};

// ─────────────────────────────────────────────────────
// TEST RESULT ANALYSIS: Brief AI feedback after MCQ test
// ─────────────────────────────────────────────────────
export const analyzeTestResultWithLLM = async ({ subject, paperType, score, total, percentage, wrongQuestions = [] }) => {
  const typeLabel = paperType === 'quick_quiz' ? 'Quick Quiz' : paperType === 'unit_test' ? 'Unit Test' : 'Exam';
  const wrongText = wrongQuestions.length > 0
    ? wrongQuestions.slice(0, 4).map((q, i) => `${i + 1}. ${q}`).join('\n')
    : 'None (perfect score!)';

  const prompt = `A student just completed a ${typeLabel} in ${subject} and scored ${score}/${total} (${percentage}%).

Wrong questions:
${wrongText}

Write exactly 2-3 warm, concise sentences directly to the student ("You scored..."):
• Sentence 1: Briefly acknowledge their result
• Sentence 2: Point out the specific weak area from wrong questions (skip if perfect)
• Sentence 3: One concrete, actionable tip to improve

Keep it under 80 words. Be encouraging, specific, not generic.`;

  for (const model of ['gemini-2.0-flash-lite', 'gemini-2.0-flash']) {
    const { data } = await geminiPost(API_KEY, model, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 150, temperature: 0.6 },
    }, 12000);
    if (data) {
      const text = extractText(data);
      if (text?.trim()) return text.trim();
    }
  }
  return null;
};
