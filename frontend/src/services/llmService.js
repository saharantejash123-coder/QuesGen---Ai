// LLM API Integration using Gemini
// Hardcoded API key for reliability (bypasses Vite env caching)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Models ordered by speed & quota availability
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * POST to Gemini API with timeout and detailed error logging.
 * Returns { data, error } so callers can see WHY it failed.
 */
async function geminiPost(apiKey, model, body, timeoutMs = 90000) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    console.log(`[LLM] Calling ${model} (timeout ${timeoutMs / 1000}s)...`);
    const start = Date.now();

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify(body),
    });
    clearTimeout(t);

    const data = await res.json();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (data.error) {
      console.warn(`[LLM] ${model} returned error after ${elapsed}s:`, data.error.message);
      return { data: null, error: data.error.message };
    }

    console.log(`[LLM] ${model} responded OK in ${elapsed}s`);
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

function stripFences(s) {
  if (!s) return s;
  if (s.startsWith('```json')) s = s.slice(7).replace(/```\s*$/, '').trim();
  else if (s.startsWith('```')) s = s.slice(3).replace(/```\s*$/, '').trim();
  return s.trim();
}

// ─────────────────────────────────────────────────────
// ADAPTIVE TESTING: Generate fresh MCQ questions via AI
// ─────────────────────────────────────────────────────
export const generateAdaptiveQuestionsWithLLM = async (
  apiKey,
  { board, cls, subject, chapter, count = 10, weakAreas = {}, sessionSeed = '' }
) => {
  // Always use the hardcoded key as primary, fall back to passed key
  const key = API_KEY || apiKey;
  if (!key) return null;

  const weakChapterList = Object.entries(weakAreas)
    .filter(([, s]) => s < 60)
    .map(([ch]) => ch)
    .join(', ');

  const prompt = `You are an expert MCQ question setter for ${board} Board, ${cls}, Subject: ${subject}.
Generate exactly ${count} unique, high-quality Multiple Choice Questions for the topic: "${chapter}".

STRICT RULES:
1. Every question must have exactly 4 options (A, B, C, D).
2. Only ONE option is correct — write it exactly as it appears in the options array.
3. Questions must NOT be standard textbook copy-pastes — make them conceptually challenging.
4. Vary difficulty: ~30% easy, ~50% medium, ~20% hard.
5. Distractors must be plausible — not obviously wrong.
6. ${weakChapterList ? `Emphasise weak sub-topics: ${weakChapterList}.` : 'Cover diverse sub-concepts.'}
7. Session seed: "${sessionSeed}" — ensures unique questions each run.
8. Include a short explanation (1-2 sentences) for the correct answer.

Return ONLY a raw JSON array — NO markdown, NO fences:
[{"id":"aq_0","text":"Question?","options":["A","B","C","D"],"answer":"A","difficulty":2,"chapter":"${chapter}","explanation":"Why A is correct."}]

Generate all ${count} questions now.`;

  let lastError = '';

  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await sleep(1500);
    const { data, error } = await geminiPost(key, MODELS[i], {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.92, maxOutputTokens: 4096 },
    }, 90000); // 90 second timeout — gemini-2.5-flash can take 20-40s for 10 questions

    if (error) { lastError = error; }
    const text = extractText(data);
    if (!text) continue;

    try {
      const start = text.indexOf('['), end = text.lastIndexOf(']');
      const qs = JSON.parse(start !== -1 ? text.slice(start, end + 1) : text.trim());
      if (Array.isArray(qs) && qs.length > 0) {
        console.log(`[LLM] Successfully parsed ${qs.length} adaptive questions`);
        return qs.map((q, idx) => ({ ...q, id: `ai_${Date.now()}_${idx}` }));
      }
    } catch (parseErr) {
      console.warn(`[LLM] JSON parse failed for ${MODELS[i]}:`, parseErr.message);
      lastError = `Failed to parse AI response: ${parseErr.message}`;
      continue;
    }
  }

  console.warn('[LLM] All models failed for adaptive questions. Last error:', lastError);
  return null;
};

// ─────────────────────────────────────────────────────
// ORACLE ENGINE: Generate full exam paper via AI
// ─────────────────────────────────────────────────────
export const generatePaperWithLLM = async (apiKey, board, cls, subject, blueprint) => {
  const key = API_KEY || apiKey;
  if (!key) return null;

  const sectionInstructions = blueprint.sections.map(sec =>
    `- ${sec.name}: Generate ${sec.count} questions of type '${sec.type}' worth ${sec.marksPerQuestion} marks each.`
  ).join('\n');

  const prompt = `You are an expert exam paper setter for ${board} board, ${cls}, Subject: ${subject}.
Generate a complete, high-quality mock examination paper following this blueprint exactly:
${sectionInstructions}

Assign an "AI Confidence" score (70-99) per question indicating exam probability.

Return ONLY valid JSON — no markdown, no fences, no extra text:
{"sections":[{"id":"A","name":"Section A","marksPerQuestion":1,"count":5,"type":"MCQ","questions":[{"text":"Question?","type":"MCQ","options":["Opt1","Opt2","Opt3","Opt4"],"conf":89}]}]}`;

  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await sleep(1500);
    const { data, error } = await geminiPost(key, MODELS[i], {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    }, 120000); // 2 minute timeout for full papers

    if (error) console.warn(`[LLM] Paper gen ${MODELS[i]} error:`, error);
    const text = extractText(data);
    if (!text) continue;

    try {
      let s = stripFences(text);
      const start = s.indexOf('{'), end = s.lastIndexOf('}');
      if (start !== -1 && end !== -1) s = s.slice(start, end + 1);
      const paper = JSON.parse(s);
      if (paper.sections?.length > 0) {
        console.log(`[LLM] Successfully generated paper with ${paper.sections.length} sections`);
        return paper;
      }
    } catch (parseErr) {
      console.warn(`[LLM] Paper parse failed for ${MODELS[i]}:`, parseErr.message);
      continue;
    }
  }

  console.warn('[LLM] All models failed for paper generation');
  return null;
};

// ─────────────────────────────────────────────────────
// VAULT-15: Generate a past-paper style exam via AI
// ─────────────────────────────────────────────────────
export const generateVaultPaperWithLLM = async (apiKey, { board, cls, subject, year, set = 'Set 1' }) => {
  const key = API_KEY || apiKey;
  if (!key) throw new Error('No API key provided');

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

Return ONLY raw JSON (NO markdown, NO fences):
{"metadata":{"board":"${board}","class":"${cls}","subject":"${subject}","year":${year},"set":"${set}","totalMarks":${bp.totalMarks},"time":"${bp.time}","generatedBy":"QuesGen AI"},"generalInstructions":["instruction 1","instruction 2"],"sections":[{"id":"A","name":"Section A","type":"MCQ","marksPerQuestion":1,"questions":[{"no":1,"text":"Question?","options":{"A":"opt1","B":"opt2","C":"opt3","D":"opt4"},"answer":"B","topic":"Topic"}]}],"answerKey":[{"qNo":1,"answer":"B","marks":1}]}
Generate the complete paper now.`;

  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await sleep(1500);
    const { data, error } = await geminiPost(key, MODELS[i], {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.65, maxOutputTokens: 8192 },
    }, 120000); // 2 minute timeout

    if (error) console.warn(`[LLM] Vault paper ${MODELS[i]} error:`, error);
    const text = extractText(data);
    if (!text) continue;

    try {
      let s = stripFences(text);
      const start = s.indexOf('{'), end = s.lastIndexOf('}');
      if (start !== -1 && end !== -1) s = s.slice(start, end + 1);
      const result = JSON.parse(s);
      console.log(`[LLM] Successfully generated vault paper`);
      return result;
    } catch (parseErr) {
      console.warn(`[LLM] Vault paper parse failed for ${MODELS[i]}:`, parseErr.message);
      continue;
    }
  }

  throw new Error('AI is temporarily overloaded. Please try again in a moment.');
};
