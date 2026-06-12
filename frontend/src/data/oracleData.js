import { generatePaperWithLLM } from '../services/llmService';

// Shared Gemini API Key
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// ─────────────────────────────────────────────────────
// HARDCODED FALLBACK QUESTION BANK
// Used when both LLM and backend API fail
// ─────────────────────────────────────────────────────
const FALLBACK_QUESTIONS = {
  MCQ: [
    { text: "What is the chemical formula of baking soda?", options: ["NaHCO₃", "Na₂CO₃", "NaCl", "NaOH"], answer: "NaHCO₃", chapter: "Chemical Reactions", diff: "Easy" },
    { text: "Which of the following is a non-renewable source of energy?", options: ["Solar energy", "Wind energy", "Coal", "Tidal energy"], answer: "Coal", chapter: "Sources of Energy", diff: "Easy" },
    { text: "The SI unit of electric current is:", options: ["Volt", "Ohm", "Ampere", "Watt"], answer: "Ampere", chapter: "Electricity", diff: "Easy" },
    { text: "Which gas is released during photosynthesis?", options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], answer: "Oxygen", chapter: "Life Processes", diff: "Easy" },
    { text: "The image formed by a plane mirror is:", options: ["Real and inverted", "Virtual and erect", "Real and erect", "Virtual and inverted"], answer: "Virtual and erect", chapter: "Light", diff: "Easy" },
    { text: "pH of a neutral solution at 25°C is:", options: ["0", "7", "14", "1"], answer: "7", chapter: "Acids, Bases and Salts", diff: "Easy" },
    { text: "Which metal is stored in kerosene?", options: ["Iron", "Copper", "Sodium", "Gold"], answer: "Sodium", chapter: "Metals and Non-metals", diff: "Medium" },
    { text: "The process of decomposition of a substance by electricity is called:", options: ["Electrolysis", "Hydrolysis", "Catalysis", "Thermolysis"], answer: "Electrolysis", chapter: "Chemical Reactions", diff: "Medium" },
    { text: "Which part of the brain controls involuntary actions?", options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Pons"], answer: "Medulla oblongata", chapter: "Control and Coordination", diff: "Medium" },
    { text: "The focal length of a concave mirror is 15 cm. Its radius of curvature is:", options: ["7.5 cm", "15 cm", "30 cm", "45 cm"], answer: "30 cm", chapter: "Light", diff: "Medium" },
    { text: "In a food chain, the third trophic level is always occupied by:", options: ["Producers", "Herbivores", "Carnivores", "Decomposers"], answer: "Carnivores", chapter: "Our Environment", diff: "Medium" },
    { text: "Resistance of a conductor depends on:", options: ["Its length", "Its area of cross-section", "Nature of material", "All of the above"], answer: "All of the above", chapter: "Electricity", diff: "Medium" },
    { text: "Which of the following is NOT an allotrope of carbon?", options: ["Diamond", "Graphite", "Buckminsterfullerene", "Calcium carbonate"], answer: "Calcium carbonate", chapter: "Carbon and its Compounds", diff: "Medium" },
    { text: "The functional group –COOH is present in:", options: ["Alcohols", "Aldehydes", "Carboxylic acids", "Ketones"], answer: "Carboxylic acids", chapter: "Carbon and its Compounds", diff: "Medium" },
    { text: "An electric bulb is rated 220V and 100W. The resistance of the bulb is:", options: ["484 Ω", "100 Ω", "220 Ω", "22 Ω"], answer: "484 Ω", chapter: "Electricity", diff: "Hard" },
    { text: "The ratio of de Broglie wavelengths of a proton and alpha particle of same energy is:", options: ["1:1", "2:1", "1:2", "4:1"], answer: "2:1", chapter: "Dual Nature", diff: "Hard" },
    { text: "Which of the following lenses would you prefer for reading small letters?", options: ["A convex lens of focal length 50 cm", "A concave lens of focal length 50 cm", "A convex lens of focal length 5 cm", "A concave lens of focal length 5 cm"], answer: "A convex lens of focal length 5 cm", chapter: "Light", diff: "Hard" },
    { text: "Mendel's law of independent assortment is applicable to genes located on:", options: ["Same chromosome", "Different chromosomes", "Sex chromosomes only", "Autosomes only"], answer: "Different chromosomes", chapter: "Heredity and Evolution", diff: "Hard" },
    { text: "The power of accommodation of the eye is controlled by:", options: ["Pupil", "Cornea", "Ciliary muscles", "Iris"], answer: "Ciliary muscles", chapter: "Human Eye", diff: "Hard" },
    { text: "Which of the following is the correct order of decreasing reactivity?", options: ["K > Na > Ca > Mg", "Na > K > Ca > Mg", "Ca > Mg > K > Na", "Mg > Ca > Na > K"], answer: "K > Na > Ca > Mg", chapter: "Metals and Non-metals", diff: "Hard" },
  ],
  VSA: [
    { text: "Define 1 dioptre of power of a lens.", answer: "1 dioptre is the power of a lens whose focal length is 1 metre.", chapter: "Light", diff: "Easy" },
    { text: "What happens when dilute hydrochloric acid is added to iron filings?", answer: "Hydrogen gas and iron chloride are produced: Fe + 2HCl → FeCl₂ + H₂↑", chapter: "Chemical Reactions", diff: "Medium" },
    { text: "Why do we apply paint on iron articles?", answer: "To prevent rusting by cutting off contact with oxygen and moisture.", chapter: "Chemical Reactions", diff: "Easy" },
    { text: "State the role of HCl in our stomach.", answer: "HCl creates an acidic medium to activate pepsin enzyme and kills harmful bacteria.", chapter: "Life Processes", diff: "Easy" },
    { text: "What is the function of the gap (synapse) between two neurons?", answer: "The synapse allows chemical signals to pass from one neuron to the next via neurotransmitters.", chapter: "Control and Coordination", diff: "Medium" },
    { text: "Write the electron dot structure of ethane (C₂H₆).", answer: "H:C::C:H with three H atoms on each carbon, sharing one electron pair between the two C atoms.", chapter: "Carbon and its Compounds", diff: "Medium" },
    { text: "Why does a compass needle get deflected near a current-carrying conductor?", answer: "A current-carrying conductor produces a magnetic field around it, which deflects the compass needle.", chapter: "Magnetic Effects", diff: "Medium" },
    { text: "What is the importance of DNA copying in reproduction?", answer: "DNA copying ensures transfer of genetic information to offspring and maintains body design features.", chapter: "Reproduction", diff: "Medium" },
  ],
  SA: [
    { text: "Explain the mechanism of breathing in humans.", answer: "During inhalation, the diaphragm flattens, ribs move upward and outward, chest cavity expands, and air rushes in. During exhalation, the diaphragm relaxes, ribs move downward and inward, chest cavity contracts, and air is pushed out.", chapter: "Life Processes", diff: "Medium" },
    { text: "Write the balanced chemical equation for photosynthesis and explain each reactant.", answer: "6CO₂ + 12H₂O → (Sunlight/Chlorophyll) → C₆H₁₂O₆ + 6O₂ + 6H₂O. Carbon dioxide from air and water from soil are converted into glucose and oxygen in the presence of sunlight and chlorophyll.", chapter: "Life Processes", diff: "Medium" },
    { text: "Describe the structure and function of nephron.", answer: "A nephron consists of Bowman's capsule, proximal convoluted tubule, loop of Henle, distal convoluted tubule, and collecting duct. It filters blood, reabsorbs useful substances, and produces urine.", chapter: "Life Processes", diff: "Hard" },
    { text: "Differentiate between biodegradable and non-biodegradable waste with examples.", answer: "Biodegradable waste can be broken down by microorganisms (e.g., food waste, paper). Non-biodegradable waste cannot be decomposed naturally (e.g., plastic, glass). Biodegradable waste enriches soil while non-biodegradable causes pollution.", chapter: "Our Environment", diff: "Easy" },
    { text: "What is electromagnetic induction? State Faraday's law.", answer: "Electromagnetic induction is the production of electric current in a conductor when it is moved through a magnetic field. Faraday's law states that the magnitude of the induced EMF is proportional to the rate of change of magnetic flux linked with the circuit.", chapter: "Magnetic Effects", diff: "Hard" },
    { text: "Explain how equal genetic variation is maintained in sexually reproducing organisms.", answer: "During sexual reproduction, both parents contribute equal amounts of DNA. Meiosis ensures gametes have half the chromosome number. Fertilization restores the full chromosome number. This ensures equal genetic contribution from both parents.", chapter: "Heredity and Evolution", diff: "Medium" },
    { text: "What are homologous structures? Give two examples and explain their significance.", answer: "Homologous structures have similar basic structure but different functions, indicating common ancestry. Examples: forelimbs of humans (grasping) and wings of birds (flying). They provide evidence for evolution from common ancestors.", chapter: "Heredity and Evolution", diff: "Medium" },
    { text: "Draw a ray diagram to show the formation of image by a convex lens when the object is placed between F and 2F.", answer: "When object is between F and 2F: Image is formed beyond 2F on the other side. It is real, inverted and magnified. Two rays are drawn - one parallel to principal axis (refracts through F) and one through optical centre (goes straight).", chapter: "Light", diff: "Medium" },
  ],
  LA: [
    { text: "State Ohm's Law. How can it be verified experimentally? Draw a circuit diagram and V-I graph.", answer: "Ohm's law states that the current flowing through a conductor is directly proportional to the potential difference applied across its ends, provided temperature remains constant (V = IR). Experimental verification involves: (1) Connect a resistor with ammeter in series and voltmeter in parallel. (2) Vary voltage using rheostat. (3) Record I and V readings. (4) Plot V-I graph — a straight line through origin confirms Ohm's law. Slope gives resistance R.", chapter: "Electricity", diff: "Hard" },
    { text: "Describe the human digestive system. Explain the process of digestion in the stomach and small intestine.", answer: "The human digestive system includes mouth, oesophagus, stomach, small intestine, large intestine, and associated glands. In the stomach: (1) HCl activates pepsinogen to pepsin. (2) Pepsin digests proteins into peptones. (3) Mucus protects stomach lining. In the small intestine: (1) Bile emulsifies fats. (2) Pancreatic juice contains trypsin, lipase, amylase. (3) Intestinal juice completes digestion. (4) Villi absorb nutrients into blood.", chapter: "Life Processes", diff: "Hard" },
    { text: "Explain the refining process of metals. How is copper refined electrolytically? Draw a neat diagram.", answer: "Electrolytic refining: Impure copper is made the anode, pure copper strip is the cathode, and acidified copper sulphate solution is the electrolyte. On passing current: At anode — impure copper dissolves (Cu → Cu²⁺ + 2e⁻). At cathode — pure copper is deposited (Cu²⁺ + 2e⁻ → Cu). Impurities settle as anode mud. This process produces 99.99% pure copper.", chapter: "Metals and Non-metals", diff: "Hard" },
    { text: "What is meant by the series and parallel combination of resistances? Derive expressions for the equivalent resistance in both cases.", answer: "Series combination: Resistors connected end-to-end, same current flows through each. Total R = R₁ + R₂ + R₃. Derivation: V = V₁ + V₂ + V₃ = IR₁ + IR₂ + IR₃ = I(R₁+R₂+R₃) = IR_eq. Parallel combination: Resistors connected between same two points, voltage is same. 1/R = 1/R₁ + 1/R₂ + 1/R₃. Derivation: I = I₁ + I₂ + I₃ = V/R₁ + V/R₂ + V/R₃ = V(1/R₁+1/R₂+1/R₃) = V/R_eq.", chapter: "Electricity", diff: "Hard" },
  ],
  Case: [
    { text: "Case Study: A student uses a convex lens of focal length 20 cm to form an image of an object placed 30 cm from the lens.\n(a) Find the position of the image.\n(b) What is the magnification?\n(c) Is the image real or virtual?\n(d) Draw a ray diagram for this case.", options: null, answer: "(a) Using 1/v - 1/u = 1/f: 1/v = 1/20 + 1/(-30) = 1/60, v = 60 cm\n(b) m = v/u = 60/(-30) = -2\n(c) Real and inverted\n(d) Ray diagram with object between F and 2F", chapter: "Light", diff: "Hard" },
    { text: "Case Study: pH values of different solutions are given: Solution A (pH=2), Solution B (pH=7), Solution C (pH=10), Solution D (pH=13).\n(a) Which solution is most acidic?\n(b) Which solution is most basic?\n(c) Which solution is neutral?\n(d) Arrange the solutions in order of increasing hydrogen ion concentration.", options: null, answer: "(a) Solution A (pH=2)\n(b) Solution D (pH=13)\n(c) Solution B (pH=7)\n(d) D < C < B < A", chapter: "Acids, Bases and Salts", diff: "Medium" },
    { text: "Case Study: Mendel crossed tall pea plants (TT) with short pea plants (tt).\n(a) What was the phenotype of F1 generation?\n(b) What was the phenotypic ratio in F2 generation?\n(c) Name the type of cross performed to obtain F2.\n(d) Define the term 'dominant trait'.", options: null, answer: "(a) All tall plants (Tt)\n(b) 3 Tall : 1 Short (3:1)\n(c) Self-pollination / Monohybrid cross\n(d) The trait that expresses itself in F1 generation when two contrasting traits are crossed.", chapter: "Heredity and Evolution", diff: "Medium" },
  ],
  Essay: [
    { text: "Discuss the importance of sustainable development. How can we contribute to a sustainable future?", answer: "Sustainable development meets present needs without compromising future generations. Key aspects: (1) Using renewable energy sources (2) Reducing waste through recycling (3) Conserving biodiversity (4) Promoting sustainable agriculture (5) Individual actions like reducing carbon footprint, water conservation, and responsible consumption.", chapter: "Our Environment", diff: "Hard" },
  ]
};

// ─────────────────────────────────────────────────────
// HARDCODED BLUEPRINT (always available)
// ─────────────────────────────────────────────────────
const DEFAULT_BLUEPRINT = {
  totalMarks: 80,
  timeMinutes: 180,
  sections: [
    { id: 'A', name: 'Section A: Objective Type', marksPerQuestion: 1, count: 20, type: 'MCQ' },
    { id: 'B', name: 'Section B: Very Short Answer', marksPerQuestion: 2, count: 6, type: 'VSA' },
    { id: 'C', name: 'Section C: Short Answer', marksPerQuestion: 3, count: 7, type: 'SA' },
    { id: 'D', name: 'Section D: Long Answer', marksPerQuestion: 5, count: 3, type: 'LA' },
  ]
};

// Helper to fetch blueprints from backend
export const fetchBlueprints = async () => {
  try {
    const res = await fetch('/api/data/blueprints');
    if (!res.ok) throw new Error('Failed to fetch blueprints');
    return await res.json();
  } catch (error) {
    console.warn('Blueprint fetch failed, using defaults:', error.message);
    return null;
  }
};

// Helper to fetch questions from backend
export const fetchQuestions = async (board, cls, subject) => {
  try {
    // Strip language suffix like " (Hindi)" for the query
    const cleanSubject = subject.replace(/\s*\(.*\)$/, '');
    const query = new URLSearchParams({ board, class: cls, subject: cleanSubject }).toString();
    const res = await fetch(`/api/data/questions?${query}`);
    if (!res.ok) throw new Error('Failed to fetch questions');
    const data = await res.json();
    return data && data.length > 0 ? data : [];
  } catch (error) {
    console.warn('Questions fetch failed, will use fallback:', error.message);
    return [];
  }
};

// Shuffle array helper
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get fallback questions for a given section type
function getFallbackQuestionsForType(type, count) {
  // Map section type to our fallback bank keys
  const typeMap = {
    'MCQ': 'MCQ',
    'VSA': 'VSA',
    'SA': 'SA',
    'LA': 'LA',
    'Case': 'Case',
    'Essay': 'Essay',
  };
  
  const bankKey = typeMap[type] || 'MCQ';
  const bank = FALLBACK_QUESTIONS[bankKey] || FALLBACK_QUESTIONS['MCQ'];
  const shuffled = shuffleArray(bank);
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const q = shuffled[i % shuffled.length];
    result.push({
      text: q.text,
      options: q.options || null,
      type: type,
      conf: Math.floor(Math.random() * (99 - 70) + 70),
      id: `fallback_${type}_${i}`
    });
  }
  return result;
}

export const generatePaperAsync = async (board, cls, subject) => {
  try {
    return await _generatePaperCore(board, cls, subject);
  } catch (e) {
    console.error('generatePaperAsync unexpected error, using fallback:', e.message);
    return {
      metadata: { board, class: cls, subject, totalMarks: DEFAULT_BLUEPRINT.totalMarks, timeMinutes: DEFAULT_BLUEPRINT.timeMinutes, date: new Date().toISOString(), source: 'Fallback-Bank' },
      sections: DEFAULT_BLUEPRINT.sections.map(sec => ({ ...sec, questions: getFallbackQuestionsForType(sec.type, sec.count) }))
    };
  }
};

const _generatePaperCore = async (board, cls, subject) => {
  // Try to fetch blueprints from backend
  const blueprints = await fetchBlueprints();
  
  // Clean subject name for blueprint lookup
  const cleanSubject = subject.replace(/\s*\(.*\)$/, '');

  const blueprint = (blueprints && blueprints[board] && blueprints[board][cls] && blueprints[board][cls][cleanSubject])
    || (blueprints && blueprints['CBSE'] && blueprints['CBSE']['Class 10'] && blueprints['CBSE']['Class 10']['Science'])
    || DEFAULT_BLUEPRINT;

  // ── Attempt 1: Try LLM generation ──
  if (GEMINI_API_KEY) {
    try {
      console.log('Attempting LLM paper generation...');
      const llmData = await generatePaperWithLLM(GEMINI_API_KEY, board, cls, subject, blueprint);
      if (llmData && llmData.sections && llmData.sections.length > 0) {
        return {
          metadata: {
            board, class: cls, subject,
            totalMarks: blueprint.totalMarks,
            timeMinutes: blueprint.timeMinutes,
            date: new Date().toISOString(),
            source: 'AI-Generated'
          },
          sections: llmData.sections.map((s, i) => ({
            ...s,
            questions: s.questions.map((q, j) => ({
              ...q,
              id: `llm_${i}_${j}`,
              conf: q.conf || Math.floor(Math.random() * (99 - 70) + 70)
            }))
          }))
        };
      }
    } catch (e) {
      console.warn("LLM API failed, falling back to static questions:", e.message);
    }
  }

  // ── Attempt 2: Try backend questions ──
  const questions = await fetchQuestions(board, cls, subject);
  
  const paper = {
    metadata: {
      board, class: cls, subject,
      totalMarks: blueprint.totalMarks,
      timeMinutes: blueprint.timeMinutes,
      date: new Date().toISOString(),
      source: questions.length > 0 ? 'Static-Bank' : 'Fallback-Bank'
    },
    sections: []
  };

  blueprint.sections.forEach(sec => {
    let secQuestions;
    
    if (questions.length > 0) {
      // Use backend questions
      secQuestions = questions.filter(q => q.type === sec.type);
      if (secQuestions.length === 0) secQuestions = questions;
    }
    
    // ── Attempt 3: If no backend questions, use hardcoded fallback ──
    if (!secQuestions || secQuestions.length === 0) {
      const fallback = getFallbackQuestionsForType(sec.type, sec.count);
      paper.sections.push({
        ...sec,
        questions: fallback
      });
      return; // next section
    }

    // Build questions from backend data
    const shuffled = shuffleArray(secQuestions);
    let resultQuestions = [];
    for (let i = 0; i < sec.count; i++) {
      resultQuestions.push({ 
        ...shuffled[i % shuffled.length], 
        id: `gen_${sec.type}_${i}`, 
        conf: Math.floor(Math.random() * (99 - 70) + 70) 
      });
    }

    paper.sections.push({
      ...sec,
      questions: resultQuestions
    });
  });

  return paper;
};
