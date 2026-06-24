import { generatePaperWithLLM } from '../services/llmService';

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// ─── Blueprints per subject ────────────────────────────────────────────────────
const BLUEPRINTS = {
  Science:          { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: Objective Type',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: Very Short Answer',marksPerQuestion:2,count:6,type:'VSA'},{id:'C',name:'Section C: Short Answer',marksPerQuestion:3,count:7,type:'SA'},{id:'D',name:'Section D: Long Answer',marksPerQuestion:5,count:3,type:'LA'}]},
  Mathematics:      { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: Multiple Choice',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: Very Short Answer',marksPerQuestion:2,count:5,type:'VSA'},{id:'C',name:'Section C: Short Answer',marksPerQuestion:3,count:6,type:'SA'},{id:'D',name:'Section D: Long Answer',marksPerQuestion:5,count:4,type:'LA'}]},
  Physics:          { totalMarks:70, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:16,type:'MCQ'},{id:'B',name:'Section B: Very Short Answer',marksPerQuestion:2,count:5,type:'VSA'},{id:'C',name:'Section C: Short Answer',marksPerQuestion:3,count:7,type:'SA'},{id:'D',name:'Section D: Long Answer',marksPerQuestion:5,count:3,type:'LA'}]},
  Chemistry:        { totalMarks:70, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:16,type:'MCQ'},{id:'B',name:'Section B: Very Short Answer',marksPerQuestion:2,count:5,type:'VSA'},{id:'C',name:'Section C: Short Answer',marksPerQuestion:3,count:7,type:'SA'},{id:'D',name:'Section D: Long Answer',marksPerQuestion:5,count:3,type:'LA'}]},
  Biology:          { totalMarks:70, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:16,type:'MCQ'},{id:'B',name:'Section B: Very Short Answer',marksPerQuestion:2,count:5,type:'VSA'},{id:'C',name:'Section C: Short Answer',marksPerQuestion:3,count:7,type:'SA'},{id:'D',name:'Section D: Long Answer',marksPerQuestion:5,count:3,type:'LA'}]},
  'Social Science': { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: Short Answer I',marksPerQuestion:3,count:7,type:'SA'},{id:'C',name:'Section C: Long Answer',marksPerQuestion:5,count:5,type:'LA'}]},
  English:          { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: Reading',marksPerQuestion:1,count:10,type:'MCQ'},{id:'B',name:'Section B: Grammar',marksPerQuestion:2,count:5,type:'VSA'},{id:'C',name:'Section C: Writing',marksPerQuestion:3,count:5,type:'SA'},{id:'D',name:'Section D: Literature',marksPerQuestion:5,count:4,type:'LA'}]},
  Hindi:            { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: लघु उत्तर',marksPerQuestion:2,count:6,type:'VSA'},{id:'C',name:'Section C: दीर्घ उत्तर',marksPerQuestion:5,count:4,type:'LA'}]},
  Accountancy:      { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: Short Answer',marksPerQuestion:3,count:6,type:'SA'},{id:'C',name:'Section C: Long Answer',marksPerQuestion:6,count:5,type:'LA'}]},
  Economics:        { totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: Short Answer',marksPerQuestion:3,count:6,type:'SA'},{id:'C',name:'Section C: Long Answer',marksPerQuestion:6,count:5,type:'LA'}]},
  'Business Studies':{ totalMarks:80, timeMinutes:180, sections:[{id:'A',name:'Section A: MCQ',marksPerQuestion:1,count:20,type:'MCQ'},{id:'B',name:'Section B: Short Answer',marksPerQuestion:3,count:6,type:'SA'},{id:'C',name:'Section C: Long Answer',marksPerQuestion:6,count:5,type:'LA'}]},
};
const DEFAULT_BLUEPRINT = BLUEPRINTS.Science;

function getBlueprint(subject) {
  const clean = subject.replace(/\s*\(.*\)$/, '');
  return BLUEPRINTS[clean] || DEFAULT_BLUEPRINT;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export const generatePaperAsync = async (board, cls, subject, options = {}) => {
  const base = getBlueprint(subject);

  // Teacher overrides: custom question count → single all-MCQ section
  const blueprint = { ...base };
  const nq = options.numQuestions ? parseInt(options.numQuestions, 10) : 0;
  const tm = options.timeMinutes  ? parseInt(options.timeMinutes, 10)  : 0;
  if (nq > 0) {
    blueprint.sections  = [{ id: 'A', name: 'Section A: Multiple Choice Questions', marksPerQuestion: 1, count: nq, type: 'MCQ' }];
    blueprint.totalMarks = nq;
  }
  if (tm > 0) blueprint.timeMinutes = tm;

  if (!GEMINI_API_KEY) {
    throw new Error('No API key found. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  console.log('[Oracle] Attempting Gemini paper generation...');
  const llmData = await generatePaperWithLLM(GEMINI_API_KEY, board, cls, subject, blueprint);
  if (llmData?.sections?.length > 0) {
    console.log('[Oracle] Gemini succeeded');
    return {
      metadata: { board, class: cls, subject, totalMarks: blueprint.totalMarks, timeMinutes: blueprint.timeMinutes, date: new Date().toISOString(), source: 'AI-Generated' },
      sections: llmData.sections.map((s, i) => ({
        ...s,
        questions: s.questions.map((q, j) => ({ ...q, id: `llm_${i}_${j}`, conf: q.conf || Math.floor(Math.random() * 20 + 75) })),
      })),
    };
  }

  throw new Error('QuesGen AI could not generate the paper. Please check your internet connection or API key and try again.');
};

// Legacy exports kept for compatibility
export const GEMINI_API_KEY_EXPORT = GEMINI_API_KEY;
export const fetchBlueprints = async () => null;
export const fetchQuestions  = async () => [];
