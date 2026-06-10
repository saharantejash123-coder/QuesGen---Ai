const db = require('./database');
const bcrypt = require('bcrypt');

const mockUsers = [
  { name: 'Aarav Rajput', initials: 'AR', role: 'student', subtitle: 'Class 12 · CBSE', email: 'student@gmail.com', pass: 'student123' },
  { name: 'Prof. Sharma', initials: 'PS', role: 'teacher', subtitle: 'Physics · CBSE', email: 'teacher@gmail.com', pass: 'teacher123' },
  { name: 'System Admin', initials: 'AD', role: 'admin', subtitle: 'Superuser', email: 'admin@gmail.com', pass: 'admin123' }
];

const seedUsers = async () => {
  console.log('Seeding users...');
  const stmt = db.prepare('INSERT OR IGNORE INTO users (name, initials, role, subtitle, email, password) VALUES (?, ?, ?, ?, ?, ?)');
  
  for (const user of mockUsers) {
    const hash = await bcrypt.hash(user.pass, 10);
    stmt.run([user.name, user.initials, user.role, user.subtitle, user.email, hash]);
  }
  stmt.finalize();
  console.log('Users seeded.');
};

// Data from oracleData.js
const oracleBlueprints = {
  CBSE: {
    'Class 10': {
      Science: {
        sections: [
          { id: 'A', name: 'Section A: Objective Type', marksPerQuestion: 1, count: 20, type: 'MCQ' },
          { id: 'B', name: 'Section B: Very Short Answer', marksPerQuestion: 2, count: 6, type: 'VSA' },
          { id: 'C', name: 'Section C: Short Answer', marksPerQuestion: 3, count: 7, type: 'SA' },
          { id: 'D', name: 'Section D: Long Answer', marksPerQuestion: 5, count: 3, type: 'LA' },
          { id: 'E', name: 'Section E: Case Based', marksPerQuestion: 4, count: 3, type: 'Case' }
        ],
        totalMarks: 80,
        timeMinutes: 180
      },
      Mathematics: {
        sections: [
          { id: 'A', name: 'Section A: Objective Type', marksPerQuestion: 1, count: 20, type: 'MCQ' },
          { id: 'B', name: 'Section B: Very Short Answer', marksPerQuestion: 2, count: 5, type: 'VSA' },
          { id: 'C', name: 'Section C: Short Answer', marksPerQuestion: 3, count: 6, type: 'SA' },
          { id: 'D', name: 'Section D: Long Answer', marksPerQuestion: 5, count: 4, type: 'LA' },
          { id: 'E', name: 'Section E: Case Based', marksPerQuestion: 4, count: 3, type: 'Case' }
        ],
        totalMarks: 80,
        timeMinutes: 180
      }
    },
    'Class 12': {
      Physics: {
        sections: [
          { id: 'A', name: 'Section A: Objective Type', marksPerQuestion: 1, count: 16, type: 'MCQ' },
          { id: 'B', name: 'Section B: Very Short Answer', marksPerQuestion: 2, count: 5, type: 'VSA' },
          { id: 'C', name: 'Section C: Short Answer', marksPerQuestion: 3, count: 7, type: 'SA' },
          { id: 'D', name: 'Section D: Case Based', marksPerQuestion: 4, count: 2, type: 'Case' },
          { id: 'E', name: 'Section E: Long Answer', marksPerQuestion: 5, count: 3, type: 'LA' }
        ],
        totalMarks: 70,
        timeMinutes: 180
      }
    }
  },
  RBSE: {
    'Class 10': {
      Science: {
        sections: [
          { id: 'A', name: 'Section A: Multiple Choice', marksPerQuestion: 1, count: 15, type: 'MCQ' },
          { id: 'B', name: 'Section B: Short Answer', marksPerQuestion: 2, count: 12, type: 'SA' },
          { id: 'C', name: 'Section C: Long Answer', marksPerQuestion: 4, count: 6, type: 'LA' },
          { id: 'D', name: 'Section D: Essay Type', marksPerQuestion: 5, count: 3, type: 'Essay' }
        ],
        totalMarks: 80,
        timeMinutes: 195
      }
    }
  }
};

const dummyQuestions = [
  // Class 10 Science
  { text: "What is the chemical formula of rust?", type: 'MCQ', options: ['Fe2O3', 'Fe3O4', 'FeO', 'Fe2O3.xH2O'], ans: 'Fe2O3.xH2O', chapter: 'Chemical Reactions', diff: 'Easy', conf: 92 },
  { text: "Which acid is present in tomato?", type: 'MCQ', options: ['Oxalic acid', 'Citric acid', 'Lactic acid', 'Tartaric acid'], ans: 'Oxalic acid', chapter: 'Acids, Bases', diff: 'Medium', conf: 85 },
  { text: "What happens when dilute hydrochloric acid is added to iron filings?", type: 'VSA', ans: 'Hydrogen gas and iron chloride are produced.', chapter: 'Chemical Reactions', diff: 'Medium', conf: 88 },
  { text: "Why do we apply paint on iron articles?", type: 'VSA', ans: 'To prevent rusting by cutting off contact with oxygen and moisture.', chapter: 'Chemical Reactions', diff: 'Easy', conf: 75 },
  { text: "Explain the mechanism of breathing in humans.", type: 'SA', ans: 'Inhalation (diaphragm flattens, ribs move up/out, chest cavity expands, air enters). Exhalation (diaphragm relaxes, ribs move down/in, chest cavity contracts, air exits).', chapter: 'Life Processes', diff: 'Medium', conf: 94 },
  { text: "Draw a labelled diagram of the human excretory system.", type: 'LA', ans: '[Diagram of Human Excretory System showing kidneys, ureters, bladder, urethra]', chapter: 'Life Processes', diff: 'Hard', conf: 89 },
  { text: "An electric bulb is rated 220 V and 100 W. When operated on 110 V, the power consumed will be:", type: 'MCQ', options: ['100 W', '75 W', '50 W', '25 W'], ans: '25 W', chapter: 'Electricity', diff: 'Hard', conf: 91 },
  { text: "Define 1 dioptre of power of a lens.", type: 'VSA', ans: '1 dioptre is the power of a lens whose focal length is 1 metre.', chapter: 'Light', diff: 'Easy', conf: 82 },
  { text: "Write the balanced chemical equation for photosynthesis.", type: 'SA', ans: '6CO2 + 12H2O (in presence of Sunlight/Chlorophyll) -> C6H12O6 + 6O2 + 6H2O', chapter: 'Life Processes', diff: 'Medium', conf: 96 },
  { text: "State Ohm's Law. How can it be verified experimentally?", type: 'LA', ans: "Ohm's law states that the current flowing through a conductor is directly proportional to the potential difference applied across its ends, provided temperature remains constant (V = IR). Experimental verification involves measuring V and I for a resistor using voltmeter and ammeter, plotting a V-I graph which yields a straight line.", chapter: 'Electricity', diff: 'Hard', conf: 95 },
  { text: "Case Study: A student uses a convex lens of focal length 20 cm to form an image of an object placed 30 cm from the lens. (a) Find the position of the image. (b) What is the magnification? (c) Is the image real or virtual?", type: 'Case', ans: '(a) v = 60 cm (b) m = -2 (c) Real and inverted', chapter: 'Light', diff: 'Hard', conf: 87 },
  { text: "Case Study: pH of different solutions are given: A(2), B(7), C(10). (a) Which is most acidic? (b) Which has highest [H+]? (c) What is nature of B?", type: 'Case', ans: '(a) A (b) A (c) Neutral', chapter: 'Acids, Bases', diff: 'Medium', conf: 84 },
  { text: "Case Study: Mendel crossed tall pea plants with short pea plants. (a) What was the F1 generation? (b) What was the ratio in F2? (c) Define dominant trait.", type: 'Case', ans: '(a) All tall (b) 3:1 (c) Trait expressed in F1', chapter: 'Heredity', diff: 'Medium', conf: 93 },

  // Class 12 Physics
  { text: "The electric field inside a spherical shell of uniform surface charge density is:", type: 'MCQ', options: ['Zero', 'Constant, non-zero', 'Directly proportional to distance from centre', 'Inversely proportional to distance'], ans: 'Zero', chapter: 'Electrostatics', diff: 'Medium', conf: 90 },
  { text: "Write two properties of equipotential surfaces.", type: 'VSA', ans: '1. No work is done in moving a charge over an equipotential surface. 2. Electric field is always perpendicular to it.', chapter: 'Electrostatics', diff: 'Easy', conf: 85 },
  { text: "Derive an expression for the capacitance of a parallel plate capacitor with a dielectric slab.", type: 'SA', ans: 'C = (ε0 * A) / (d - t + t/K)', chapter: 'Electrostatics', diff: 'Hard', conf: 88 },
  { text: "Explain the working of a moving coil galvanometer.", type: 'LA', ans: 'Based on the principle that a current carrying coil placed in a magnetic field experiences a torque. τ = NIAB sinθ. Restoring torque = kα. Equating them gives I = (k/NAB)α.', chapter: 'Magnetic Effects', diff: 'Hard', conf: 92 },
  { text: "Case Study: Young's Double Slit Experiment demonstrates interference of light. If slit separation is d and screen distance is D. (a) What is fringe width? (b) What happens if D is increased? (c) Why use monochromatic light?", type: 'Case', ans: '(a) β = λD/d (b) Fringe width increases (c) To get clear fringes of single color', chapter: 'Wave Optics', diff: 'Hard', conf: 89 },

  // Class 10 Math
  { text: "The HCF of 96 and 404 is:", type: 'MCQ', options: ['4', '12', '96', '404'], ans: '4', chapter: 'Real Numbers', diff: 'Medium', conf: 88 },
  { text: "Find the discriminant of 2x^2 - 4x + 3 = 0.", type: 'VSA', ans: 'D = b^2 - 4ac = (-4)^2 - 4(2)(3) = 16 - 24 = -8', chapter: 'Quadratic Equations', diff: 'Easy', conf: 81 },
  { text: "Prove that √3 is an irrational number.", type: 'SA', ans: 'Assume √3 is rational (p/q, co-prime). 3 = p^2/q^2 => p^2 = 3q^2 => 3 divides p. Let p = 3c. 9c^2 = 3q^2 => q^2 = 3c^2 => 3 divides q. Contradiction. Hence irrational.', chapter: 'Real Numbers', diff: 'Hard', conf: 95 },
  { text: "State and prove the Basic Proportionality Theorem (Thales Theorem).", type: 'LA', ans: 'Statement: If a line is drawn parallel to one side of a triangle intersecting the other two sides, then it divides the two sides in the same ratio. Proof: Area of triangles...', chapter: 'Triangles', diff: 'Hard', conf: 98 },
  { text: "Case Study: A tent is in the shape of a cylinder surmounted by a conical top. Radius = 2m, height of cylinder = 2.1m, slant height of cone = 2.8m. (a) Find CSA of cylinder. (b) Find CSA of cone. (c) Total canvas area?", type: 'Case', ans: '(a) 26.4 m^2 (b) 17.6 m^2 (c) 44 m^2', chapter: 'Surface Areas', diff: 'Medium', conf: 86 }
];

const seedBlueprints = () => {
  console.log('Seeding blueprints...');
  const stmt = db.prepare('INSERT INTO blueprints (board, class, subject, data) VALUES (?, ?, ?, ?)');
  
  for (const board in oracleBlueprints) {
    for (const cls in oracleBlueprints[board]) {
      for (const subject in oracleBlueprints[board][cls]) {
        stmt.run([board, cls, subject, JSON.stringify(oracleBlueprints[board][cls][subject])]);
      }
    }
  }
  stmt.finalize();
  console.log('Blueprints seeded.');
};

const seedDummyQuestions = () => {
  console.log('Seeding dummy questions...');
  const stmt = db.prepare('INSERT OR IGNORE INTO questions (id, board, class, subject, chapter, text, options, answer, type, diff, conf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  let i = 0;
  for (const q of dummyQuestions) {
    let subject = 'Science';
    if (['Real Numbers', 'Quadratic Equations', 'Triangles', 'Surface Areas'].includes(q.chapter)) subject = 'Mathematics';
    if (['Electrostatics', 'Magnetic Effects', 'Wave Optics'].includes(q.chapter)) subject = 'Physics';
    
    stmt.run([`gen_${q.type}_${i}`, 'CBSE', 'Class 10', subject, q.chapter, q.text, JSON.stringify(q.options || []), q.ans, q.type, q.diff, q.conf]);
    i++;
  }
  stmt.finalize();
  console.log('Dummy questions seeded.');
};

setTimeout(async () => {
  await seedUsers();
  seedBlueprints();
  seedDummyQuestions();
  console.log("Database seeded successfully.");
}, 1000);
