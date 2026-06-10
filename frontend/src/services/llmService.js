// LLM API Integration using Gemini

// ─────────────────────────────────────────────────────
// ADAPTIVE TESTING: Generate fresh MCQ questions via AI
// ─────────────────────────────────────────────────────
export const generateAdaptiveQuestionsWithLLM = async (
  apiKey,
  { board, cls, subject, chapter, count = 10, weakAreas = {}, sessionSeed = '' }
) => {
  if (!apiKey) throw new Error('No API key provided');

  // Build context about weak areas so AI can emphasise those concepts
  const weakChapterList = Object.entries(weakAreas)
    .filter(([, s]) => s < 60)
    .map(([ch]) => ch)
    .join(', ');

  const prompt = `
You are an expert MCQ question setter for ${board} Board, ${cls}, Subject: ${subject}.
Generate exactly ${count} unique, high-quality Multiple Choice Questions for the topic: "${chapter}".

STRICT RULES:
1. Every question must have exactly 4 options (A, B, C, D).
2. Only ONE option is correct — write it exactly as it appears in the options array.
3. Questions must NOT be standard textbook copy-pastes — make them conceptually challenging.
4. Vary difficulty naturally: ~30% easy, ~50% medium, ~20% hard.
5. Distractors (wrong options) must be plausible — not obviously wrong.
6. ${weakChapterList ? `These sub-topics had weak performance, give them more coverage: ${weakChapterList}.` : 'Cover diverse sub-concepts across the topic.'}
7. Session variation seed: "${sessionSeed}" — use this to ensure questions differ between runs.
8. Include a short explanation (1-2 sentences) for the correct answer.

Return STRICTLY as a raw JSON array — NO markdown, NO \`\`\`json fences:
[
  {
    "id": "aq_0",
    "text": "The full question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "difficulty": 2,
    "chapter": "${chapter}",
    "explanation": "Brief reason why the answer is correct."
  }
]

Difficulty: 1=Easy, 2=Medium, 3=Hard. Generate all ${count} questions now.
`;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.92, // High temp → different questions every run
        responseMimeType: 'application/json',
      },
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'Gemini API error');

  let jsonString = data.candidates[0].content.parts[0].text;
  // Strip markdown fences if model added them
  if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7, -3);
  else if (jsonString.startsWith('```')) jsonString = jsonString.slice(3, -3);

  const questions = JSON.parse(jsonString.trim());
  // Ensure unique IDs per session
  return questions.map((q, i) => ({ ...q, id: `ai_${Date.now()}_${i}` }));
};

// ─────────────────────────────────────────────────────
// ORACLE ENGINE: Generate full exam paper via AI
// ─────────────────────────────────────────────────────
export const generatePaperWithLLM = async (apiKey, board, cls, subject, blueprint) => {
  if (!apiKey) {
    throw new Error("No API key provided");
  }

  // Construct the prompt based on the blueprint
  let sectionInstructions = blueprint.sections.map(sec => 
    `- ${sec.name}: Generate ${sec.count} questions of type '${sec.type}' worth ${sec.marksPerQuestion} marks each.`
  ).join('\n');

  const prompt = `
You are an expert exam paper setter for ${board} board, ${cls}, Subject: ${subject}.
Generate a completely new, unique set of questions for a mock examination paper.
Do not use generic or overly simple questions. Make them high quality and challenging, mimicking real board exams.

The paper must strictly follow this blueprint:
${sectionInstructions}

Also, assign an "AI Confidence" score (between 70 and 99) for each question to indicate its probability of appearing in the exam, based on historical patterns.

Return the response STRICTLY as a valid JSON object. No markdown fences, no comments, no extra text — only the JSON:
{
  "sections": [
    {
      "id": "A",
      "name": "Section A",
      "marksPerQuestion": 1,
      "count": 5,
      "type": "MCQ",
      "questions": [
        {
          "text": "Question text here?",
          "type": "MCQ",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "conf": 89
        }
      ]
    },
    {
      "id": "B",
      "name": "Section B",
      "marksPerQuestion": 3,
      "count": 3,
      "type": "SA",
      "questions": [
        {
          "text": "Short answer question here.",
          "type": "SA",
          "conf": 82
        }
      ]
    }
  ]
}
`;

  // Try models in order of preference
  const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  let lastError = null;
  for (const model of MODELS) {
    try {
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (data.error) {
        lastError = new Error(data.error.message || 'Gemini API error');
        continue;
      }

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        lastError = new Error('Empty response from Gemini');
        continue;
      }

      let jsonString = data.candidates[0].content.parts[0].text.trim();

      // Strip markdown fences if model included them
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(7).replace(/```\s*$/, '').trim();
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3).replace(/```\s*$/, '').trim();
      }

      // Extract JSON object if model added preamble text
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
        jsonString = jsonString.slice(jsonStart, jsonEnd + 1);
      }

      const paperContent = JSON.parse(jsonString);
      if (!paperContent.sections) {
        lastError = new Error('Invalid paper structure from Gemini');
        continue;
      }
      return paperContent;
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') {
        lastError = new Error('Gemini request timed out after 60 seconds');
        break;
      }
    }
  }

  console.error('LLM Generation Error:', lastError?.message);
  throw lastError || new Error('All Gemini models failed');
};

// ─────────────────────────────────────────────────────
// VAULT-15: Generate a complete past-paper style exam via AI
// ─────────────────────────────────────────────────────
export const generateVaultPaperWithLLM = async (apiKey, { board, cls, subject, year, set = 'Set 1' }) => {
  if (!apiKey) throw new Error('No API key provided');

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

  const prompt = `
You are an expert exam paper setter replicating real ${board} Board ${cls} ${subject} papers.
Simulate the ${year} Annual Examination — ${set}. Match the authentic topic coverage, style and difficulty of actual ${year} board papers.

Blueprint:
${sectionDesc}
Total Marks: ${bp.totalMarks} | Time: ${bp.time}

Rules per question type:
- MCQ: 4 options (A/B/C/D), state correct answer letter
- VSA/SA: question text + concise model answer
- LA: question text + detailed model answer (bullet points)
- Case/Reading: realistic passage + 3-4 sub-questions with answers
- Writing: realistic prompt + model response
- Grammar: sentence-based exercises with answers
- Literature: text-based questions with answers
- Map: location-based questions with answers

Return STRICTLY as raw JSON (NO markdown, NO \`\`\`json):
{
  "metadata": {"board":"${board}","class":"${cls}","subject":"${subject}","year":${year},"set":"${set}","totalMarks":${bp.totalMarks},"time":"${bp.time}","generatedBy":"QuesGen AI"},
  "generalInstructions": ["instruction 1","instruction 2","instruction 3","instruction 4","instruction 5"],
  "sections": [
    {
      "id": "A",
      "name": "Section A",
      "type": "MCQ",
      "marksPerQuestion": 1,
      "questions": [
        {"no":1,"text":"Question text?","options":{"A":"opt1","B":"opt2","C":"opt3","D":"opt4"},"answer":"B","topic":"Topic name"}
      ]
    },
    {
      "id": "B",
      "name": "Section B",
      "type": "SA",
      "marksPerQuestion": 3,
      "questions": [
        {"no":21,"text":"Question text.","modelAnswer":"Model answer here.","topic":"Topic name","marks":3}
      ]
    }
  ],
  "answerKey": [
    {"qNo":1,"answer":"B","marks":1},
    {"qNo":21,"keyPoints":["key point 1","key point 2"],"marks":3}
  ]
}
Generate the complete paper now with ALL questions as per blueprint.`;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.65, responseMimeType: 'application/json' },
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'Gemini API error');

  let jsonString = data.candidates[0].content.parts[0].text;
  if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7, -3);
  else if (jsonString.startsWith('```')) jsonString = jsonString.slice(3, -3);

  return JSON.parse(jsonString.trim());
};
