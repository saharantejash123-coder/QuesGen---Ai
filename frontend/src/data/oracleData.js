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

// ─── Fallback question bank (used when AI is unavailable) ─────────────────────
const FALLBACK_BANK = {
  Science: {
    MCQ: [
      {text:"Which of the following is a physical change?",options:["Burning of wood","Rusting of iron","Melting of ice","Cooking of food"],answer:"Melting of ice"},
      {text:"The process by which plants make food is called:",options:["Respiration","Photosynthesis","Transpiration","Digestion"],answer:"Photosynthesis"},
      {text:"Which gas is released during photosynthesis?",options:["Carbon dioxide","Nitrogen","Oxygen","Hydrogen"],answer:"Oxygen"},
      {text:"The unit of electric current is:",options:["Volt","Ampere","Ohm","Watt"],answer:"Ampere"},
      {text:"Which lens is used to correct myopia?",options:["Convex lens","Concave lens","Bifocal lens","Cylindrical lens"],answer:"Concave lens"},
      {text:"Newton's first law of motion is also called:",options:["Law of acceleration","Law of inertia","Law of gravitation","Law of friction"],answer:"Law of inertia"},
      {text:"The chemical formula of water is:",options:["H2O2","HO","H2O","H3O"],answer:"H2O"},
      {text:"Which part of the cell controls all activities?",options:["Cell wall","Cell membrane","Nucleus","Cytoplasm"],answer:"Nucleus"},
      {text:"Sound cannot travel through:",options:["Water","Air","Steel","Vacuum"],answer:"Vacuum"},
      {text:"The SI unit of force is:",options:["Joule","Newton","Pascal","Watt"],answer:"Newton"},
      {text:"Which blood group is called the universal donor?",options:["A","B","AB","O"],answer:"O"},
      {text:"The angle of incidence equals the angle of reflection — this is:",options:["Snell's Law","Law of reflection","Ohm's Law","Law of refraction"],answer:"Law of reflection"},
      {text:"Ozone layer is present in the:",options:["Troposphere","Stratosphere","Mesosphere","Thermosphere"],answer:"Stratosphere"},
      {text:"The metal used in electric wires is:",options:["Iron","Copper","Zinc","Aluminium"],answer:"Copper"},
      {text:"Which organ produces bile juice?",options:["Pancreas","Stomach","Liver","Kidneys"],answer:"Liver"},
      {text:"Resistance is measured in:",options:["Volts","Amperes","Ohms","Watts"],answer:"Ohms"},
      {text:"The process of conversion of water vapour to liquid is:",options:["Evaporation","Condensation","Sublimation","Precipitation"],answer:"Condensation"},
      {text:"Which is the largest planet in the solar system?",options:["Earth","Mars","Jupiter","Saturn"],answer:"Jupiter"},
      {text:"The speed of light in vacuum is approximately:",options:["3×10⁶ m/s","3×10⁸ m/s","3×10⁴ m/s","3×10¹⁰ m/s"],answer:"3×10⁸ m/s"},
      {text:"Acid turns blue litmus paper to:",options:["Red","Green","Yellow","White"],answer:"Red"},
    ],
    VSA: [
      {text:"Define the term 'Work' in physics. Give one example."},
      {text:"What is the difference between speed and velocity?"},
      {text:"Name the process by which roots absorb water from the soil."},
      {text:"What is an electromagnet? Give one use."},
      {text:"Define pH. What is the pH of pure water?"},
      {text:"What are isotopes? Give one example."},
      {text:"State Ohm's Law."},
      {text:"What is meant by 'biodegradable waste'? Give two examples."},
    ],
    SA: [
      {text:"Explain the process of photosynthesis with a labelled diagram of a leaf."},
      {text:"State Newton's three laws of motion with one example each."},
      {text:"Describe the structure of the human eye and explain how we see."},
      {text:"What is the difference between acids and bases? Give two examples of each."},
      {text:"Explain the water cycle with a neat diagram."},
      {text:"What is magnetic field? How can you demonstrate it using iron filings?"},
      {text:"Describe the process of digestion in the human body from mouth to small intestine."},
      {text:"Explain the difference between series and parallel circuits with diagrams."},
    ],
    LA: [
      {text:"Explain with diagrams how a concave and a convex lens forms images. Mention two applications of each."},
      {text:"Describe the human excretory system. What is dialysis and when is it required?"},
      {text:"What are the various sources of energy? Compare renewable and non-renewable sources with examples."},
    ],
  },
  Mathematics: {
    MCQ: [
      {text:"The value of √2 is approximately:",options:["1.414","1.732","2.236","1.618"],answer:"1.414"},
      {text:"If x² - 5x + 6 = 0, the roots are:",options:["2 and 3","1 and 6","2 and 4","3 and 4"],answer:"2 and 3"},
      {text:"The HCF of 12 and 18 is:",options:["3","4","6","9"],answer:"6"},
      {text:"The area of a circle with radius 7 cm is:",options:["44 cm²","154 cm²","22 cm²","308 cm²"],answer:"154 cm²"},
      {text:"The sum of angles in a triangle is:",options:["90°","180°","270°","360°"],answer:"180°"},
      {text:"tan 45° equals:",options:["0","1","√3","1/√2"],answer:"1"},
      {text:"The probability of getting a head on a fair coin toss is:",options:["0","1/4","1/2","1"],answer:"1/2"},
      {text:"Which of these is a rational number?",options:["√2","π","√3","7/3"],answer:"7/3"},
      {text:"The LCM of 6 and 8 is:",options:["12","16","24","48"],answer:"24"},
      {text:"The slope of the line y = 3x + 2 is:",options:["2","3","1/3","1/2"],answer:"3"},
      {text:"3² + 4² equals:",options:["5","25","7²","49"],answer:"25"},
      {text:"In an AP with first term 2 and common difference 3, the 5th term is:",options:["14","15","16","17"],answer:"14"},
      {text:"The median of 3, 5, 7, 9, 11 is:",options:["5","7","9","11"],answer:"7"},
      {text:"How many diagonals does a hexagon have?",options:["6","8","9","12"],answer:"9"},
      {text:"sin 30° equals:",options:["1","√3/2","1/2","1/√2"],answer:"1/2"},
      {text:"Which quadrant is the point (-3, 4) in?",options:["I","II","III","IV"],answer:"II"},
      {text:"Volume of a cube with side 5 cm is:",options:["25 cm³","75 cm³","100 cm³","125 cm³"],answer:"125 cm³"},
      {text:"The distance formula between (0,0) and (3,4) gives:",options:["3","4","5","7"],answer:"5"},
      {text:"If the mean of 5, 10, 15, 20, x is 12, then x =",options:["8","10","12","14"],answer:"10"},
      {text:"In a right triangle, the hypotenuse is 13 and one side is 5. The other side is:",options:["8","10","12","15"],answer:"12"},
    ],
    VSA: [
      {text:"Write the prime factorisation of 144."},
      {text:"Find the roots of the equation x² - 9 = 0."},
      {text:"If P(A) = 0.4, find P(not A)."},
      {text:"Write the formula for the nth term of an arithmetic progression."},
      {text:"Find the area of a triangle with base 8 cm and height 5 cm."},
    ],
    SA: [
      {text:"Prove that √2 is irrational."},
      {text:"Solve the pair of linear equations: 2x + 3y = 12 and x - y = 1, by the substitution method."},
      {text:"A bag contains 3 red, 5 blue and 2 green balls. A ball is drawn at random. Find the probability that it is (i) blue (ii) not red."},
      {text:"Find the sum of the first 20 terms of the AP: 5, 8, 11, 14, ..."},
      {text:"The diagonal of a square is 10 cm. Find its area and perimeter."},
      {text:"Using the quadratic formula, solve 2x² - 7x + 3 = 0."},
    ],
    LA: [
      {text:"Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact. Hence, find the length of a tangent drawn from a point 10 cm away from the centre of a circle of radius 6 cm."},
      {text:"A cone, a hemisphere and a cylinder stand on equal bases and have equal heights. Find the ratio of their volumes."},
      {text:"The following distribution gives the daily wages of 50 workers:\nWages (₹): 100-120, 120-140, 140-160, 160-180, 180-200\nWorkers: 12, 14, 8, 6, 10\nFind mean, median and mode."},
      {text:"Two water taps together can fill a tank in 9⅜ hours. The tap of larger diameter takes 10 hours less than the smaller one to fill the tank separately. Find the time each tap will take to fill the tank."},
    ],
  },
  Physics: {
    MCQ: [
      {text:"The SI unit of power is:",options:["Joule","Newton","Watt","Pascal"],answer:"Watt"},
      {text:"A body at rest has:",options:["Kinetic energy","Potential energy","Both KE and PE","Neither KE nor PE"],answer:"Potential energy"},
      {text:"The speed of light in vacuum is:",options:["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10⁴ m/s"],answer:"3×10⁸ m/s"},
      {text:"Ohm's law relates:",options:["V and P","V, I and R","I and P","R and P"],answer:"V, I and R"},
      {text:"The focal length of a concave mirror is:",options:["Positive","Negative","Zero","Infinite"],answer:"Negative"},
      {text:"Which colour of light has the highest frequency?",options:["Red","Yellow","Green","Violet"],answer:"Violet"},
      {text:"The formula for kinetic energy is:",options:["mgh","½mv²","mv","Fs"],answer:"½mv²"},
      {text:"Magnetic field lines are:",options:["Closed curves","Open curves","Straight lines","Parallel lines"],answer:"Closed curves"},
      {text:"The image formed by a plane mirror is:",options:["Real, inverted","Virtual, erect","Real, erect","Virtual, inverted"],answer:"Virtual, erect"},
      {text:"Resistance increases when temperature:",options:["Decreases","Increases","Stays same","Becomes zero"],answer:"Increases"},
      {text:"The phenomenon of light bending round obstacles is:",options:["Reflection","Refraction","Diffraction","Dispersion"],answer:"Diffraction"},
      {text:"1 kWh equals:",options:["3.6×10³ J","3.6×10⁵ J","3.6×10⁶ J","3.6×10⁹ J"],answer:"3.6×10⁶ J"},
      {text:"Which quantity is NOT a vector?",options:["Force","Velocity","Speed","Acceleration"],answer:"Speed"},
      {text:"Refractive index of a medium is:",options:["c/v","v/c","c×v","c+v"],answer:"c/v"},
      {text:"A current-carrying conductor in a magnetic field experiences:",options:["Electric force","Magnetic force","Both","Neither"],answer:"Magnetic force"},
      {text:"Total internal reflection occurs when light travels from:",options:["Air to glass","Glass to air","Water to air (above critical angle)","Vacuum to water"],answer:"Glass to air"},
    ],
    VSA: [
      {text:"State Newton's second law of motion."},
      {text:"What is meant by 'critical angle' in optics?"},
      {text:"Define electric potential difference."},
      {text:"What is the principle of a transformer?"},
      {text:"State the law of conservation of energy."},
    ],
    SA: [
      {text:"Derive the formula for the equivalent resistance of two resistors in parallel."},
      {text:"Explain the working of a solenoid. How does it act as a magnet?"},
      {text:"A ball is thrown vertically upward with velocity 20 m/s. Find the maximum height reached and time to return to the ground. (g = 10 m/s²)"},
      {text:"Explain the refraction of light through a glass slab. Why does the emergent ray remain parallel to the incident ray?"},
      {text:"What is electromagnetic induction? State Faraday's law and Lenz's law."},
      {text:"Describe the construction and working of an AC generator."},
      {text:"Calculate the power dissipated in a 5Ω resistor when a current of 2A flows through it. Also find the energy consumed in 30 minutes."},
    ],
    LA: [
      {text:"Draw a ray diagram for image formation by a convex lens when the object is placed beyond 2F. Derive the lens formula 1/f = 1/v - 1/u."},
      {text:"State and explain the laws of reflection and refraction. Describe an experiment to verify Snell's law."},
      {text:"Explain the domestic electric circuit. Why are fuses and MCBs used? What precautions should be taken to avoid electrical hazards?"},
    ],
  },
  Biology: {
    MCQ: [
      {text:"Which organelle is the powerhouse of the cell?",options:["Nucleus","Ribosome","Mitochondria","Chloroplast"],answer:"Mitochondria"},
      {text:"DNA is found mainly in the:",options:["Cytoplasm","Cell wall","Nucleus","Ribosome"],answer:"Nucleus"},
      {text:"Photosynthesis occurs in:",options:["Mitochondria","Chloroplasts","Nucleus","Ribosomes"],answer:"Chloroplasts"},
      {text:"Which blood cells fight infection?",options:["Red blood cells","White blood cells","Platelets","Plasma"],answer:"White blood cells"},
      {text:"The process of producing offspring without gametes is:",options:["Sexual reproduction","Asexual reproduction","Fertilisation","Meiosis"],answer:"Asexual reproduction"},
      {text:"Insulin is produced by:",options:["Liver","Pancreas","Kidneys","Thyroid"],answer:"Pancreas"},
      {text:"The basic unit of life is:",options:["Organ","Tissue","Cell","Organism"],answer:"Cell"},
      {text:"Haemoglobin is found in:",options:["White blood cells","Platelets","Red blood cells","Plasma"],answer:"Red blood cells"},
      {text:"Which part of the brain controls balance and coordination?",options:["Cerebrum","Cerebellum","Medulla","Thalamus"],answer:"Cerebellum"},
      {text:"The process by which cells divide to form gametes is:",options:["Mitosis","Meiosis","Binary fission","Budding"],answer:"Meiosis"},
      {text:"Bile is stored in the:",options:["Liver","Pancreas","Gall bladder","Stomach"],answer:"Gall bladder"},
      {text:"Which vitamin is produced by skin in sunlight?",options:["Vitamin A","Vitamin B","Vitamin C","Vitamin D"],answer:"Vitamin D"},
      {text:"The nephron is the functional unit of the:",options:["Liver","Lungs","Kidneys","Heart"],answer:"Kidneys"},
      {text:"Which gas do plants absorb during photosynthesis?",options:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],answer:"Carbon dioxide"},
      {text:"The longest bone in the human body is the:",options:["Humerus","Tibia","Femur","Fibula"],answer:"Femur"},
      {text:"Transpiration in plants occurs mainly through:",options:["Roots","Stem","Stomata","Flowers"],answer:"Stomata"},
    ],
    VSA: [
      {text:"What is osmosis? How does it differ from diffusion?"},
      {text:"Name the two types of reproduction in plants with one example each."},
      {text:"What is the role of the placenta in human reproduction?"},
      {text:"Define homeostasis. Give one example."},
      {text:"What are hormones? Name the hormone responsible for growth."},
    ],
    SA: [
      {text:"Explain the process of digestion from the mouth to the small intestine. Name the enzymes involved."},
      {text:"Describe the structure and function of the human heart."},
      {text:"What is photosynthesis? Write the overall equation and explain the role of chlorophyll."},
      {text:"Explain the nitrogen cycle with a neat diagram."},
      {text:"Describe mitosis and its significance."},
      {text:"What is the endocrine system? Explain the role of two endocrine glands."},
      {text:"Explain how the immune system protects the body from disease. What are antibodies?"},
    ],
    LA: [
      {text:"Describe the human respiratory system. Explain the mechanism of breathing in and breathing out."},
      {text:"Explain the process of DNA replication. Why is it important for cell division?"},
      {text:"Discuss the various methods of contraception. What are the health implications of early pregnancy?"},
    ],
  },
  Chemistry: {
    MCQ: [
      {text:"Atomic number of carbon is:",options:["4","6","8","12"],answer:"6"},
      {text:"Which of the following is an exothermic reaction?",options:["Photosynthesis","Dissolution of NH4Cl","Burning of coal","Electrolysis of water"],answer:"Burning of coal"},
      {text:"pH of a neutral solution is:",options:["0","7","10","14"],answer:"7"},
      {text:"The formula of sodium chloride is:",options:["Na2Cl","NaCl","NaCl2","Na2Cl2"],answer:"NaCl"},
      {text:"Which gas is produced when zinc reacts with dilute HCl?",options:["Oxygen","Carbon dioxide","Hydrogen","Chlorine"],answer:"Hydrogen"},
      {text:"An element with atomic number 11 belongs to:",options:["Period 2, Group 1","Period 3, Group 1","Period 2, Group 17","Period 3, Group 17"],answer:"Period 3, Group 1"},
      {text:"Which bond involves sharing of electrons?",options:["Ionic bond","Covalent bond","Metallic bond","Hydrogen bond"],answer:"Covalent bond"},
      {text:"The oxidation state of oxygen in water is:",options:["+2","-1","-2","0"],answer:"-2"},
      {text:"Which metal is liquid at room temperature?",options:["Caesium","Gallium","Mercury","Francium"],answer:"Mercury"},
      {text:"Rusting of iron requires:",options:["Only water","Only oxygen","Water and oxygen","Water and carbon dioxide"],answer:"Water and oxygen"},
      {text:"A catalyst:",options:["Is consumed in the reaction","Changes ΔG of reaction","Increases the rate without being consumed","Shifts equilibrium"],answer:"Increases the rate without being consumed"},
      {text:"Which acid is present in vinegar?",options:["Citric acid","Lactic acid","Acetic acid","Formic acid"],answer:"Acetic acid"},
      {text:"The process of converting ore to metal is called:",options:["Mining","Refining","Smelting","Electroplating"],answer:"Smelting"},
      {text:"Isotopes of an element have the same:",options:["Mass number","Neutron number","Atomic number","Both A and B"],answer:"Atomic number"},
      {text:"Which polymer is used to make non-stick cookware?",options:["PVC","Nylon","Teflon","Polyethene"],answer:"Teflon"},
      {text:"The valency of sulphur in H₂SO₄ is:",options:["2","4","6","8"],answer:"6"},
    ],
    VSA: [
      {text:"What is the difference between a physical change and a chemical change? Give one example of each."},
      {text:"Define molar mass. What is the molar mass of CO₂?"},
      {text:"What is electrolysis? Name the products at anode and cathode during electrolysis of dilute H₂SO₄."},
      {text:"Define activation energy of a chemical reaction."},
      {text:"What is an alloy? Give two examples."},
    ],
    SA: [
      {text:"Explain the concept of electronegativity. How does it vary across a period and down a group?"},
      {text:"Balance the equation: Fe₂O₃ + CO → Fe + CO₂. Classify the type of reaction."},
      {text:"What are the properties of ionic compounds? How do they differ from covalent compounds?"},
      {text:"Explain the Bohr model of the atom. What were its limitations?"},
      {text:"Write notes on (a) corrosion of metals and (b) methods to prevent corrosion."},
      {text:"What is a buffer solution? Explain with an example how it resists pH change."},
      {text:"Describe the preparation, properties and uses of ammonia."},
    ],
    LA: [
      {text:"Explain the extraction of iron in a blast furnace. Write the reactions occurring at each stage."},
      {text:"What is the periodic table? Explain the trends in atomic radius, ionisation energy and electronegativity across a period and down a group."},
      {text:"Explain the mechanism of addition reactions with alkenes. Give three examples of commercially important addition reactions."},
    ],
  },
  'Social Science': {
    MCQ: [
      {text:"The Indian Constitution came into effect on:",options:["15 August 1947","26 January 1950","26 November 1949","2 October 1950"],answer:"26 January 1950"},
      {text:"Which river is known as the 'Sorrow of Bengal'?",options:["Ganga","Damodar","Brahmaputra","Mahanadi"],answer:"Damodar"},
      {text:"The Great Depression occurred in:",options:["1919","1929","1939","1945"],answer:"1929"},
      {text:"The Tropic of Cancer passes through how many Indian states?",options:["6","7","8","9"],answer:"8"},
      {text:"Which Article of the Indian Constitution abolishes untouchability?",options:["Article 14","Article 17","Article 19","Article 21"],answer:"Article 17"},
      {text:"GDP stands for:",options:["Gross Domestic Product","Gross Development Plan","General Domestic Policy","Global Development Project"],answer:"Gross Domestic Product"},
      {text:"The First World War ended in:",options:["1914","1916","1918","1920"],answer:"1918"},
      {text:"Which soil type is most suitable for cotton cultivation?",options:["Alluvial soil","Red soil","Black soil","Laterite soil"],answer:"Black soil"},
      {text:"The Right to Education Act was passed in:",options:["2001","2005","2009","2010"],answer:"2009"},
      {text:"NABARD is associated with:",options:["Industrial development","Agricultural development","Urban development","Export promotion"],answer:"Agricultural development"},
      {text:"Who wrote 'Hind Swaraj'?",options:["Nehru","Ambedkar","Gandhi","Tilak"],answer:"Gandhi"},
      {text:"The Vindhyas and Satpuras belong to which type of mountains?",options:["Fold mountains","Block mountains","Volcanic mountains","Residual mountains"],answer:"Block mountains"},
      {text:"Which body exercises control over money supply in India?",options:["Finance Ministry","SEBI","RBI","Planning Commission"],answer:"RBI"},
      {text:"Non-cooperation Movement was launched in:",options:["1919","1920","1921","1922"],answer:"1920"},
      {text:"Headquarters of the United Nations is in:",options:["Washington","London","New York","Geneva"],answer:"New York"},
      {text:"Which country is the largest producer of coffee?",options:["India","Brazil","Ethiopia","Colombia"],answer:"Brazil"},
      {text:"PR system in elections gives representation based on:",options:["Geography","Votes received","Population","Literacy rate"],answer:"Votes received"},
      {text:"Chipko Movement was related to:",options:["Water conservation","Afforestation","Protection of forests","Soil conservation"],answer:"Protection of forests"},
      {text:"The Planning Commission of India was replaced by:",options:["Finance Commission","NITI Aayog","Economic Advisory Council","GST Council"],answer:"NITI Aayog"},
      {text:"Which gas causes the 'greenhouse effect'?",options:["Oxygen","Nitrogen","Carbon dioxide","Helium"],answer:"Carbon dioxide"},
    ],
    SA: [
      {text:"What were the main causes of the French Revolution?"},
      {text:"Describe the factors responsible for soil erosion in India. Suggest measures to prevent it."},
      {text:"What is democracy? Explain any three features of a democratic government."},
      {text:"What is globalisation? How has it affected the Indian economy?"},
      {text:"Explain the concept of sustainable development with examples."},
      {text:"What were the effects of the First World War on India?"},
      {text:"Describe the role of self-help groups in women empowerment."},
    ],
    LA: [
      {text:"Describe the role of Mahatma Gandhi in India's independence movement. What was the significance of the Salt March of 1930?"},
      {text:"Explain federalism in India. How is power divided between the Centre and the States? Discuss one recent Centre-State conflict."},
      {text:"Describe the challenges to democracy in India. How can citizens strengthen democratic institutions?"},
      {text:"What is the impact of globalisation on developing countries like India? Discuss the advantages and disadvantages."},
      {text:"Describe the major types of landforms in India and explain how they influence human settlement and economic activities."},
    ],
  },
  English: {
    MCQ: [
      {text:"Choose the correct form: She ___ to school every day.",options:["go","goes","going","gone"],answer:"goes"},
      {text:"The antonym of 'ancient' is:",options:["Old","Modern","Historic","Past"],answer:"Modern"},
      {text:"Which figure of speech is used in 'The wind whispered through the trees'?",options:["Simile","Metaphor","Personification","Alliteration"],answer:"Personification"},
      {text:"Choose the correctly punctuated sentence:",options:["Its raining outside.","It's raining outside.","Its' raining outside.","It is, raining outside."],answer:"It's raining outside."},
      {text:"The passive voice of 'He reads a book' is:",options:["A book read by him.","A book is read by him.","A book was read by him.","A book has been read by him."],answer:"A book is read by him."},
      {text:"A synonym of 'benevolent' is:",options:["Kind","Cruel","Lazy","Strict"],answer:"Kind"},
      {text:"Which sentence is in the simple past tense?",options:["She will go tomorrow.","She goes every day.","She went yesterday.","She is going now."],answer:"She went yesterday."},
      {text:"'He is the black sheep of the family' is an example of:",options:["Simile","Idiom","Metaphor","Proverb"],answer:"Idiom"},
      {text:"Choose the correct spelling:",options:["Accomodation","Accommodation","Acommodation","Accomodtion"],answer:"Accommodation"},
      {text:"The plural of 'criterion' is:",options:["Criterions","Criteria","Criterias","Criterions"],answer:"Criteria"},
    ],
    VSA: [
      {text:"Write the meaning of the phrase 'break the ice' and use it in a sentence."},
      {text:"Change the voice: 'The teacher praised the student.'"},
      {text:"Write a notice (in about 50 words) for your school announcing an annual sports day."},
      {text:"What is a metaphor? Give one example."},
      {text:"Supply the missing letters: _cc_mm_d_t__n"},
    ],
    SA: [
      {text:"Write a letter to the editor of a local newspaper about increasing air pollution in your city. Suggest remedies."},
      {text:"Describe the character of the main protagonist from a story you have read in your textbook."},
      {text:"Write a short paragraph (100 words) on 'The Importance of Reading'."},
      {text:"Report the following speech in indirect form: The teacher said, 'Open your books and start reading.'"},
      {text:"Write a dialogue between two friends about the pros and cons of social media."},
    ],
    LA: [
      {text:"Write an essay in about 250 words on 'Technology: A Boon or a Bane for Students'."},
      {text:"Read the following passage and answer the questions:\n\n'Education is the most powerful weapon which you can use to change the world.' — Nelson Mandela\n\nThis quote reminds us that knowledge is more powerful than arms or money. When people are educated, they can think critically, solve problems, and contribute meaningfully to society...\n\n(a) What does the passage suggest about education?\n(b) Find a word from the passage that means 'in a significant way'.\n(c) Why is critical thinking important?\n(d) Suggest a suitable title for the passage."},
      {text:"Write a story beginning with: 'It was a dark and stormy night when the phone rang unexpectedly...'"},
      {text:"Discuss the theme of courage and resilience in any poem or prose from your English textbook."},
    ],
  },
};

// Get questions for a given subject and type, with shuffle
function getFallbackQuestions(subject, type, count) {
  const cleanSubject = subject.replace(/\s*\(.*\)$/, '');
  const bank = FALLBACK_BANK[cleanSubject] || FALLBACK_BANK.Science;
  const pool = [...(bank[type] || bank.MCQ || [])];

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({ ...pool[i % pool.length], id: `fb_${type}_${i}`, conf: Math.floor(Math.random() * 20 + 75) });
  }
  return result;
}

function getBlueprint(subject) {
  const clean = subject.replace(/\s*\(.*\)$/, '');
  return BLUEPRINTS[clean] || DEFAULT_BLUEPRINT;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export const generatePaperAsync = async (board, cls, subject) => {
  const blueprint = getBlueprint(subject);

  // ── Attempt 1: LLM generation ──────────────────────────────────────────────
  if (GEMINI_API_KEY) {
    try {
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
    } catch (e) {
      console.warn('[Oracle] Gemini failed:', e.message);
    }
  }

  // ── Fallback: curated question bank (always works) ─────────────────────────
  console.log('[Oracle] Using curated fallback question bank');
  return {
    metadata: { board, class: cls, subject, totalMarks: blueprint.totalMarks, timeMinutes: blueprint.timeMinutes, date: new Date().toISOString(), source: 'Curated-Bank' },
    sections: blueprint.sections.map(sec => ({
      ...sec,
      questions: getFallbackQuestions(subject, sec.type, sec.count),
    })),
  };
};

// Legacy exports kept for compatibility
export const GEMINI_API_KEY_EXPORT = GEMINI_API_KEY;
export const fetchBlueprints = async () => null;
export const fetchQuestions  = async () => [];
