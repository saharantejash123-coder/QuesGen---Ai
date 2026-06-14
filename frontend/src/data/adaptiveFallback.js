// Curated MCQ bank for Adaptive Testing fallback
// Used when Gemini AI is unavailable — questions are shuffled per session

const BANK = {
  Physics: {
    Mechanics: [
      {text:"A ball is thrown vertically upward with 20 m/s. What is its speed at the highest point?",options:["20 m/s","10 m/s","5 m/s","0 m/s"],answer:"0 m/s",difficulty:1,explanation:"At the highest point all kinetic energy converts to potential energy and velocity becomes zero."},
      {text:"Newton's second law states that force equals:",options:["mass × velocity","mass × acceleration","mass × distance","mass × time"],answer:"mass × acceleration",difficulty:1,explanation:"F = ma is Newton's second law — net force equals mass multiplied by acceleration."},
      {text:"A 5 kg object accelerates at 3 m/s². The net force is:",options:["15 N","8 N","1.67 N","2 N"],answer:"15 N",difficulty:1,explanation:"F = ma = 5 × 3 = 15 N."},
      {text:"Which quantity is conserved in an elastic collision?",options:["Kinetic energy only","Momentum only","Both KE and momentum","Neither"],answer:"Both KE and momentum",difficulty:2,explanation:"In a perfectly elastic collision, both kinetic energy and momentum are conserved."},
      {text:"A body moves in a circular path at constant speed. Its acceleration is:",options:["Zero","Directed toward centre","Directed away from centre","Tangential"],answer:"Directed toward centre",difficulty:2,explanation:"Centripetal acceleration always points toward the centre of the circular path."},
      {text:"The work done by friction is always:",options:["Positive","Negative","Zero","Depends on the surface"],answer:"Negative",difficulty:2,explanation:"Friction opposes motion, so the work done by friction is always negative (opposite to displacement)."},
      {text:"If a car doubles its speed, its braking distance becomes:",options:["Doubled","Tripled","Four times","Same"],answer:"Four times",difficulty:3,explanation:"Braking distance ∝ v². Doubling speed quadruples the stopping distance."},
      {text:"The moment of inertia depends on:",options:["Mass only","Shape only","Mass and its distribution","Speed"],answer:"Mass and its distribution",difficulty:2,explanation:"Moment of inertia = Σmr², so it depends on both mass and how far mass is from the axis."},
      {text:"Law of conservation of momentum holds when:",options:["No forces act","Net external force is zero","Only internal forces act","Both B and C"],answer:"Both B and C",difficulty:3,explanation:"When net external force = 0, only internal forces act, and total momentum of the system is conserved."},
      {text:"A projectile at 45° gives:",options:["Maximum height","Minimum range","Maximum range","Minimum time of flight"],answer:"Maximum range",difficulty:2,explanation:"Range R = v²sin2θ/g is maximum when 2θ = 90°, i.e., θ = 45°."},
    ],
    Optics: [
      {text:"Which lens corrects myopia (nearsightedness)?",options:["Convex","Concave","Bifocal","Cylindrical"],answer:"Concave",difficulty:1,explanation:"Myopia means the focal point falls in front of the retina. A concave (diverging) lens corrects this."},
      {text:"The angle of incidence equals the angle of reflection — this is:",options:["Snell's Law","Law of reflection","Ohm's Law","Huygen's principle"],answer:"Law of reflection",difficulty:1,explanation:"The first law of reflection states that the angle of incidence equals the angle of reflection."},
      {text:"Total internal reflection occurs when light moves from:",options:["Air to glass","Dense to rare medium (above critical angle)","Rare to dense medium","Vacuum to water"],answer:"Dense to rare medium (above critical angle)",difficulty:2,explanation:"TIR occurs when light travels from a denser medium to a rarer medium and the angle of incidence exceeds the critical angle."},
      {text:"A convex mirror is used in rear-view mirrors because:",options:["It magnifies objects","It gives a wider field of view","It forms real images","It focuses parallel rays"],answer:"It gives a wider field of view",difficulty:1,explanation:"Convex mirrors diverge light and always form a virtual, erect, diminished image — giving a wider field of view."},
      {text:"The critical angle for glass-air interface (n=1.5) is approximately:",options:["30°","42°","60°","90°"],answer:"42°",difficulty:3,explanation:"sin C = 1/n = 1/1.5 = 0.667, so C ≈ 41.8° ≈ 42°."},
      {text:"Which colour of visible light has the shortest wavelength?",options:["Red","Green","Blue","Violet"],answer:"Violet",difficulty:1,explanation:"Violet light has the shortest wavelength (~380 nm) in the visible spectrum, and highest frequency."},
      {text:"A concave mirror with focal length 10 cm has object at 30 cm. Image distance is:",options:["15 cm","20 cm","10 cm","30 cm"],answer:"15 cm",difficulty:3,explanation:"1/v + 1/u = 1/f. With sign convention: 1/v = 1/(-10) - 1/(-30) = -3/30+1/30 = -2/30. v = -15 cm."},
      {text:"Mirage is caused by:",options:["Reflection","Diffraction","Total internal reflection","Scattering"],answer:"Total internal reflection",difficulty:2,explanation:"In a mirage, hot air near the ground acts as a rarer medium. Light undergoes TIR and appears as a water surface."},
      {text:"The power of a lens with focal length 25 cm is:",options:["4 D","2.5 D","0.25 D","25 D"],answer:"4 D",difficulty:2,explanation:"P = 1/f(m) = 1/0.25 = 4 dioptre."},
      {text:"Optical fibres work on the principle of:",options:["Refraction","Reflection","Total internal reflection","Diffraction"],answer:"Total internal reflection",difficulty:1,explanation:"Light signals travel through optical fibres by repeatedly undergoing total internal reflection at the fibre walls."},
    ],
    Electromagnetism: [
      {text:"Faraday's law of electromagnetic induction states that induced EMF is proportional to:",options:["Current","Rate of change of magnetic flux","Magnetic field strength","Resistance"],answer:"Rate of change of magnetic flux",difficulty:1,explanation:"EMF = -dΦ/dt. The induced EMF equals the negative rate of change of magnetic flux (Faraday's law)."},
      {text:"Lenz's law is a consequence of the law of conservation of:",options:["Charge","Momentum","Energy","Mass"],answer:"Energy",difficulty:2,explanation:"Lenz's law ensures that induced currents oppose the change causing them, which is consistent with energy conservation."},
      {text:"An AC generator works on the principle of:",options:["Ohm's Law","Electromagnetic induction","Thermal effect of current","Chemical effect of current"],answer:"Electromagnetic induction",difficulty:1,explanation:"An AC generator converts mechanical energy to electrical energy using Faraday's law of electromagnetic induction."},
      {text:"The SI unit of magnetic flux is:",options:["Tesla","Weber","Ampere","Henry"],answer:"Weber",difficulty:1,explanation:"Magnetic flux Φ = B·A. Its SI unit is Weber (Wb) = T·m²."},
      {text:"A transformer steps up voltage. Its secondary coil has:",options:["More turns than primary","Fewer turns than primary","Same turns as primary","No turns"],answer:"More turns than primary",difficulty:1,explanation:"Vs/Vp = Ns/Np. To step up voltage, Ns > Np."},
      {text:"If the frequency of AC is doubled, inductive reactance:",options:["Halves","Doubles","Stays the same","Quadruples"],answer:"Doubles",difficulty:2,explanation:"XL = 2πfL. Reactance is directly proportional to frequency."},
      {text:"Which device converts AC to DC?",options:["Transformer","Rectifier","Amplifier","Oscillator"],answer:"Rectifier",difficulty:1,explanation:"A rectifier (using diodes) converts alternating current to direct current."},
      {text:"The magnetic field inside a solenoid is:",options:["Non-uniform","Zero","Uniform","Radial"],answer:"Uniform",difficulty:1,explanation:"Inside an ideal solenoid, the magnetic field is uniform and parallel to its axis: B = μ₀nI."},
    ],
    Thermodynamics: [
      {text:"First law of thermodynamics is based on conservation of:",options:["Momentum","Charge","Energy","Mass"],answer:"Energy",difficulty:1,explanation:"ΔU = Q - W. The first law states that energy can neither be created nor destroyed — it is conservation of energy."},
      {text:"An ideal gas expands adiabatically. Temperature:",options:["Increases","Decreases","Stays the same","Cannot be determined"],answer:"Decreases",difficulty:2,explanation:"In adiabatic expansion Q = 0, so ΔU = -W. The gas does work, internal energy falls, and temperature decreases."},
      {text:"Carnot engine efficiency depends on:",options:["Working substance","Source and sink temperatures","Size of engine","Speed"],answer:"Source and sink temperatures",difficulty:2,explanation:"η = 1 - T₂/T₁. Carnot efficiency depends only on the temperatures of the heat source and sink."},
      {text:"Absolute zero temperature in Celsius is:",options:["-100°C","-173°C","-273°C","-373°C"],answer:"-273°C",difficulty:1,explanation:"0 K = -273.15°C. At absolute zero, molecules have minimum kinetic energy."},
      {text:"In an isothermal process:",options:["Temperature changes","Pressure is constant","Temperature is constant","Volume is constant"],answer:"Temperature is constant",difficulty:1,explanation:"Isothermal = constant temperature. For an ideal gas, PV = constant in an isothermal process."},
    ],
  },

  Chemistry: {
    'Acids & Bases': [
      {text:"pH of pure water at 25°C is:",options:["0","5","7","14"],answer:"7",difficulty:1,explanation:"Pure water has equal H⁺ and OH⁻ concentrations (10⁻⁷ M each), giving pH = -log(10⁻⁷) = 7."},
      {text:"Which acid is present in vinegar?",options:["Citric acid","Lactic acid","Acetic acid","Formic acid"],answer:"Acetic acid",difficulty:1,explanation:"Vinegar is a dilute solution of acetic acid (CH₃COOH), typically 4-8%."},
      {text:"Acid turns blue litmus paper to:",options:["Red","Green","Yellow","White"],answer:"Red",difficulty:1,explanation:"Acids donate H⁺ ions which change the pH-sensitive dye in blue litmus to red."},
      {text:"A strong base completely:",options:["Ionises in water","Neutralises all acids","Reacts with metals","Dissolves in acid"],answer:"Ionises in water",difficulty:2,explanation:"A strong base (e.g., NaOH, KOH) completely dissociates into ions in water."},
      {text:"Which of the following is a buffer solution?",options:["HCl + NaCl","CH₃COOH + CH₃COONa","NaOH + NaCl","H₂SO₄ + Na₂SO₄"],answer:"CH₃COOH + CH₃COONa",difficulty:3,explanation:"A buffer = weak acid + its conjugate base (or weak base + conjugate acid). CH₃COOH/CH₃COONa is a classic acetate buffer."},
      {text:"The Brønsted-Lowry definition of an acid is:",options:["Electron pair acceptor","Proton donor","Proton acceptor","Electron pair donor"],answer:"Proton donor",difficulty:2,explanation:"According to Brønsted-Lowry theory, an acid is a proton (H⁺) donor."},
      {text:"Neutralisation of HCl with NaOH produces:",options:["H₂ gas","NaCl and H₂O","NaHCO₃","Cl₂ gas"],answer:"NaCl and H₂O",difficulty:1,explanation:"HCl + NaOH → NaCl + H₂O. This is a typical acid-base neutralisation."},
      {text:"Which is the strongest acid?",options:["CH₃COOH","HCl","H₂CO₃","H₃PO₄"],answer:"HCl",difficulty:2,explanation:"HCl is a strong acid (fully ionises), while the others are weak acids with partial ionisation."},
    ],
    'Metals & Non-metals': [
      {text:"Which metal is liquid at room temperature?",options:["Caesium","Gallium","Mercury","Sodium"],answer:"Mercury",difficulty:1,explanation:"Mercury (Hg) is the only metal that is liquid at standard room temperature (25°C)."},
      {text:"Rusting of iron requires both:",options:["Water and CO₂","O₂ and CO₂","Water and O₂","Only water"],answer:"Water and O₂",difficulty:1,explanation:"Rusting is an electrochemical process requiring both moisture (water) and oxygen."},
      {text:"Which metal is the best conductor of electricity?",options:["Copper","Gold","Silver","Aluminium"],answer:"Silver",difficulty:2,explanation:"Silver has the highest electrical conductivity of all metals. Copper is second, but more cost-effective."},
      {text:"Non-metals generally form:",options:["Cations","Metallic bonds","Covalent or ionic bonds","Only ionic bonds"],answer:"Covalent or ionic bonds",difficulty:2,explanation:"Non-metals form covalent bonds with each other and ionic bonds when reacting with metals."},
      {text:"Which metal is extracted by electrolysis?",options:["Iron","Copper","Aluminium","Zinc"],answer:"Aluminium",difficulty:2,explanation:"Aluminium is very reactive, so it can't be extracted by carbon reduction — electrolysis of molten Al₂O₃ is used."},
      {text:"Diamond is a form of which non-metal?",options:["Silicon","Sulphur","Carbon","Phosphorus"],answer:"Carbon",difficulty:1,explanation:"Diamond is an allotrope of carbon in which each carbon atom is covalently bonded to four others in a tetrahedral arrangement."},
      {text:"Which non-metal is a good conductor of electricity?",options:["Sulphur","Phosphorus","Graphite","Iodine"],answer:"Graphite",difficulty:2,explanation:"Graphite (a carbon allotrope) conducts electricity because it has delocalised electrons in its layered structure."},
      {text:"The process of covering iron with zinc to prevent rusting is called:",options:["Tinning","Galvanisation","Electroplating","Anodising"],answer:"Galvanisation",difficulty:1,explanation:"Galvanisation is the process of coating iron or steel with zinc to protect it from corrosion."},
    ],
    'Organic Chemistry': [
      {text:"The functional group −OH is present in:",options:["Aldehydes","Alcohols","Carboxylic acids","Esters"],answer:"Alcohols",difficulty:1,explanation:"The hydroxyl group (−OH) is the characteristic functional group of alcohols."},
      {text:"Methane (CH₄) belongs to the series:",options:["Alkene","Alkyne","Alkane","Arene"],answer:"Alkane",difficulty:1,explanation:"Alkanes have the general formula CₙH₂ₙ₊₂ with all single bonds. CH₄ (n=1) is the simplest alkane."},
      {text:"Which reaction converts an alkene to an alkane?",options:["Substitution","Addition","Elimination","Condensation"],answer:"Addition",difficulty:2,explanation:"Alkenes undergo addition reactions (e.g., hydrogenation) where atoms add across the double bond to form alkanes."},
      {text:"The IUPAC name of CH₃CH₂OH is:",options:["Methanol","Propanol","Ethanol","Butanol"],answer:"Ethanol",difficulty:1,explanation:"CH₃CH₂OH has 2 carbon atoms with the −OH group: IUPAC name is ethanol."},
      {text:"Fermentation of glucose produces:",options:["Methane and CO₂","Ethanol and CO₂","Acetic acid and H₂O","Lactic acid and H₂"],answer:"Ethanol and CO₂",difficulty:2,explanation:"C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. Yeast enzymes convert glucose to ethanol and CO₂."},
    ],
  },

  Mathematics: {
    Algebra: [
      {text:"If x² − 5x + 6 = 0, the roots are:",options:["2 and 3","1 and 6","2 and 4","3 and 4"],answer:"2 and 3",difficulty:1,explanation:"x² − 5x + 6 = (x−2)(x−3) = 0, so x = 2 or x = 3."},
      {text:"The discriminant of 2x² − 4x + 2 = 0 is:",options:["8","0","−8","4"],answer:"0",difficulty:2,explanation:"D = b² − 4ac = 16 − 16 = 0. Equal roots."},
      {text:"The value of (a+b)² − (a−b)² is:",options:["4ab","2ab","a²+b²","2(a²+b²)"],answer:"4ab",difficulty:2,explanation:"(a+b)² − (a−b)² = (a²+2ab+b²) − (a²−2ab+b²) = 4ab."},
      {text:"Sum of roots of ax² + bx + c = 0 is:",options:["c/a","−b/a","b/a","−c/a"],answer:"−b/a",difficulty:2,explanation:"For ax² + bx + c = 0, sum of roots = −b/a and product of roots = c/a (Vieta's formulas)."},
      {text:"HCF of 12 and 18 is:",options:["3","4","6","9"],answer:"6",difficulty:1,explanation:"12 = 2²×3, 18 = 2×3². HCF = 2×3 = 6."},
      {text:"LCM of 6, 8 and 12 is:",options:["24","48","36","12"],answer:"24",difficulty:1,explanation:"6=2×3, 8=2³, 12=2²×3. LCM = 2³×3 = 24."},
      {text:"If the mean of 5, 10, 15, 20, x is 12, then x =",options:["8","10","12","14"],answer:"10",difficulty:2,explanation:"(5+10+15+20+x)/5=12 → 50+x=60 → x=10."},
      {text:"The nth term of AP: 3, 7, 11, ... is:",options:["4n−1","3n+4","4n+3","3+4n"],answer:"4n−1",difficulty:2,explanation:"a=3, d=4. aₙ = a+(n−1)d = 3+4n−4 = 4n−1."},
      {text:"Which of the following is irrational?",options:["√9","√16","√7","√25"],answer:"√7",difficulty:1,explanation:"√7 ≈ 2.6457... is non-terminating non-repeating, hence irrational. The others are perfect squares."},
      {text:"Solve: 2x + 3 = 11. The value of x is:",options:["3","4","5","6"],answer:"4",difficulty:1,explanation:"2x = 11 − 3 = 8, so x = 4."},
    ],
    Trigonometry: [
      {text:"sin 30° equals:",options:["1","√3/2","1/2","1/√2"],answer:"1/2",difficulty:1,explanation:"sin 30° = 1/2 is a standard trigonometric value."},
      {text:"tan 45° equals:",options:["0","1","√3","1/√2"],answer:"1",difficulty:1,explanation:"tan 45° = sin45°/cos45° = (1/√2)/(1/√2) = 1."},
      {text:"cos 60° equals:",options:["√3/2","1/2","1","0"],answer:"1/2",difficulty:1,explanation:"cos 60° = 1/2 is a standard value."},
      {text:"sin²θ + cos²θ equals:",options:["0","2","1","sin2θ"],answer:"1",difficulty:1,explanation:"sin²θ + cos²θ = 1 is the fundamental Pythagorean identity."},
      {text:"In a right triangle, if sin A = 3/5, then cos A =",options:["4/5","3/4","5/3","4/3"],answer:"4/5",difficulty:2,explanation:"sin²A + cos²A = 1. cos²A = 1 − 9/25 = 16/25. cos A = 4/5."},
      {text:"The angle of elevation of the sun is 30°. The shadow of a 10m tall pole is:",options:["10√3 m","10/√3 m","5√3 m","20 m"],answer:"10√3 m",difficulty:2,explanation:"tan 30° = height/shadow = 10/shadow. shadow = 10/tan30° = 10√3 m."},
      {text:"sec²θ − tan²θ equals:",options:["0","−1","1","2"],answer:"1",difficulty:2,explanation:"sec²θ = 1 + tan²θ, so sec²θ − tan²θ = 1."},
    ],
    Geometry: [
      {text:"The sum of interior angles of a hexagon is:",options:["540°","720°","900°","360°"],answer:"720°",difficulty:1,explanation:"Sum = (n−2)×180° = (6−2)×180° = 720°."},
      {text:"In a circle, the angle subtended by the diameter at any point on the circle is:",options:["45°","60°","90°","180°"],answer:"90°",difficulty:1,explanation:"Angle in a semicircle = 90°. (Thales' theorem)"},
      {text:"The diagonal of a square with side a is:",options:["a","a√2","a√3","2a"],answer:"a√2",difficulty:1,explanation:"By Pythagoras: d² = a² + a² = 2a², so d = a√2."},
      {text:"Area of an equilateral triangle with side a is:",options:["a²/4","√3a²/4","√3a/4","a²√3"],answer:"√3a²/4",difficulty:2,explanation:"Area of equilateral triangle = (√3/4)a²."},
      {text:"Two tangents drawn from an external point to a circle are:",options:["Unequal","Equal","Perpendicular to each other","Parallel"],answer:"Equal",difficulty:1,explanation:"Tangents drawn from an external point to a circle are equal in length."},
      {text:"The volume of a cone with radius r and height h is:",options:["πr²h","2πrh","πr²h/3","4πr³/3"],answer:"πr²h/3",difficulty:1,explanation:"Volume of cone = (1/3)πr²h."},
    ],
  },

  Biology: {
    'Cell Biology': [
      {text:"Which organelle is the powerhouse of the cell?",options:["Nucleus","Ribosome","Mitochondria","Chloroplast"],answer:"Mitochondria",difficulty:1,explanation:"Mitochondria produce ATP through cellular respiration — hence called the powerhouse of the cell."},
      {text:"DNA is found mainly in the:",options:["Cytoplasm","Cell wall","Nucleus","Ribosome"],answer:"Nucleus",difficulty:1,explanation:"The nucleus contains the cell's genetic material (DNA) in the form of chromosomes."},
      {text:"Cell wall of plant cells is made of:",options:["Protein","Chitin","Cellulose","Pectin"],answer:"Cellulose",difficulty:1,explanation:"Plant cell walls are primarily composed of cellulose, a polysaccharide that provides structural support."},
      {text:"Ribosomes are the site of:",options:["DNA replication","Protein synthesis","Energy production","Lipid synthesis"],answer:"Protein synthesis",difficulty:1,explanation:"Ribosomes translate mRNA into polypeptide chains — they are the protein synthesis machinery."},
      {text:"Which cell organelle is absent in animal cells?",options:["Mitochondria","Cell wall","Nucleus","Ribosome"],answer:"Cell wall",difficulty:1,explanation:"Animal cells lack a cell wall (and chloroplasts). They are bounded only by the cell membrane."},
      {text:"Osmosis is the movement of water from:",options:["High solute to low solute","Low solute to high solute","High pressure to low pressure","Low pressure to high pressure"],answer:"Low solute to high solute",difficulty:2,explanation:"Osmosis is the movement of water from a region of low solute concentration to high solute concentration through a semipermeable membrane."},
      {text:"Which type of cell division produces gametes?",options:["Mitosis","Meiosis","Binary fission","Budding"],answer:"Meiosis",difficulty:1,explanation:"Meiosis is a reductive division that produces four haploid gametes from a diploid cell."},
      {text:"The process of programmed cell death is called:",options:["Mitosis","Meiosis","Apoptosis","Necrosis"],answer:"Apoptosis",difficulty:3,explanation:"Apoptosis is a controlled, programmed cell death process essential for development and homeostasis."},
    ],
    'Human Physiology': [
      {text:"Which blood group is called the universal donor?",options:["A","B","AB","O"],answer:"O",difficulty:1,explanation:"Type O blood lacks A and B antigens on red blood cells, so it can be donated to any ABO blood group."},
      {text:"Insulin is produced by:",options:["Liver","Pancreas","Kidneys","Thyroid"],answer:"Pancreas",difficulty:1,explanation:"Beta cells of the islets of Langerhans in the pancreas produce insulin."},
      {text:"The nephron is the functional unit of the:",options:["Liver","Lungs","Kidney","Heart"],answer:"Kidney",difficulty:1,explanation:"Each kidney contains about one million nephrons — the structural and functional units of kidney filtration."},
      {text:"Which part of the brain controls balance and coordination?",options:["Cerebrum","Cerebellum","Medulla","Thalamus"],answer:"Cerebellum",difficulty:1,explanation:"The cerebellum coordinates voluntary movements, maintains balance, and fine-tunes motor skills."},
      {text:"The largest gland in the human body is the:",options:["Pancreas","Thyroid","Liver","Adrenal gland"],answer:"Liver",difficulty:1,explanation:"The liver is the largest internal organ and gland, weighing about 1.5 kg in adults."},
    ],
    Genetics: [
      {text:"DNA stands for:",options:["Deoxyribonucleic Acid","Deoxyribonucleotide Acid","Dimethyl Nucleic Acid","Di-nitrogenous Acid"],answer:"Deoxyribonucleic Acid",difficulty:1,explanation:"DNA = Deoxyribonucleic Acid — the molecule that carries genetic information."},
      {text:"Which scientist is known as the Father of Genetics?",options:["Darwin","Mendel","Watson","Lamarck"],answer:"Mendel",difficulty:1,explanation:"Gregor Mendel, through pea plant experiments, established the laws of heredity — he is the Father of Genetics."},
      {text:"The normal human chromosome number is:",options:["46","48","44","23"],answer:"46",difficulty:1,explanation:"Humans have 46 chromosomes (23 pairs) — 22 pairs of autosomes and 1 pair of sex chromosomes."},
      {text:"A dominant allele is represented by:",options:["Lowercase letter","Uppercase letter","A number","A symbol"],answer:"Uppercase letter",difficulty:1,explanation:"In Mendelian genetics, dominant alleles are written with capital letters (e.g., T), recessive with lowercase (t)."},
      {text:"In a monohybrid cross Tt × Tt, the ratio of dominant to recessive phenotype is:",options:["1:1","2:1","3:1","1:2"],answer:"3:1",difficulty:2,explanation:"Tt × Tt gives TT:Tt:tt = 1:2:1 genotype, so 3 dominant : 1 recessive phenotype."},
    ],
  },

  'Social Science': {
    History: [
      {text:"The French Revolution began in:",options:["1776","1789","1799","1815"],answer:"1789",difficulty:1,explanation:"The French Revolution began in 1789 with the storming of the Bastille on July 14, 1789."},
      {text:"Who wrote 'Hind Swaraj'?",options:["Nehru","Ambedkar","Gandhi","Tilak"],answer:"Gandhi",difficulty:1,explanation:"Mahatma Gandhi wrote 'Hind Swaraj' (Indian Home Rule) in 1909, outlining his philosophy of non-violent resistance."},
      {text:"The Non-Cooperation Movement was launched in:",options:["1919","1920","1921","1922"],answer:"1920",difficulty:1,explanation:"Gandhi launched the Non-Cooperation Movement in 1920 as a mass campaign against British rule."},
      {text:"The Great Depression began in:",options:["1919","1929","1939","1945"],answer:"1929",difficulty:1,explanation:"The Great Depression started with the Wall Street Crash in October 1929 and lasted through the 1930s."},
      {text:"First World War ended in:",options:["1914","1916","1918","1920"],answer:"1918",difficulty:1,explanation:"WWI ended with the Armistice on November 11, 1918."},
      {text:"The Salt March of 1930 was organised to:",options:["Boycott British goods","Protest the salt tax","Demand voting rights","Stop World War II"],answer:"Protest the salt tax",difficulty:1,explanation:"Gandhi led the 241-mile Dandi Salt March in 1930 to protest the British monopoly on salt production and the salt tax."},
      {text:"The Quit India Movement was launched in:",options:["1940","1942","1944","1945"],answer:"1942",difficulty:1,explanation:"Gandhi launched the Quit India Movement on August 8, 1942 with the call 'Do or Die'."},
    ],
    Geography: [
      {text:"Which river is called the 'Sorrow of Bengal'?",options:["Ganga","Damodar","Brahmaputra","Mahanadi"],answer:"Damodar",difficulty:1,explanation:"The Damodar River in West Bengal and Jharkhand was called 'Sorrow of Bengal' due to its frequent devastating floods."},
      {text:"The Tropic of Cancer passes through how many Indian states?",options:["6","7","8","9"],answer:"8",difficulty:2,explanation:"The Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, WB, Tripura, Mizoram."},
      {text:"Which soil is most suitable for cotton cultivation?",options:["Alluvial soil","Red soil","Black soil","Laterite soil"],answer:"Black soil",difficulty:1,explanation:"Black (Regur) soil has high clay content, retains moisture well, and is rich in lime — ideal for cotton."},
      {text:"The Chipko Movement was related to:",options:["Water conservation","Soil conservation","Protection of forests","Solar energy"],answer:"Protection of forests",difficulty:1,explanation:"The Chipko Movement (1973, Uttarakhand) was a forest conservation movement where people hugged trees to prevent felling."},
      {text:"India's highest peak is:",options:["K2","Kanchenjunga","Nanda Devi","Godwin Austen"],answer:"Kanchenjunga",difficulty:2,explanation:"Kanchenjunga (8,586 m) in Sikkim is India's highest peak. K2 and Godwin Austen are in Pakistan-administered Kashmir."},
    ],
    Economics: [
      {text:"GDP stands for:",options:["Gross Domestic Product","Global Development Project","General Domestic Policy","Gross Development Plan"],answer:"Gross Domestic Product",difficulty:1,explanation:"GDP is the total monetary value of all goods and services produced within a country in a specific period."},
      {text:"NABARD is associated with:",options:["Industrial development","Agricultural development","Urban development","Export promotion"],answer:"Agricultural development",difficulty:1,explanation:"NABARD (National Bank for Agriculture and Rural Development) focuses on agricultural and rural development."},
      {text:"Which body controls money supply in India?",options:["Finance Ministry","SEBI","RBI","Planning Commission"],answer:"RBI",difficulty:1,explanation:"The Reserve Bank of India (RBI) controls money supply, interest rates, and monetary policy."},
      {text:"Self-help groups mainly help in:",options:["Big business loans","Women's micro-credit","Government grants","Import-export"],answer:"Women's micro-credit",difficulty:2,explanation:"SHGs are small groups (mostly women) that save money collectively and access micro-credit for income-generating activities."},
      {text:"Globalisation refers to:",options:["Local trade growth","Integration of world economies","Government policies","Rural development"],answer:"Integration of world economies",difficulty:1,explanation:"Globalisation is the process of increasing interconnection and integration of world economies through trade, investment, and technology."},
    ],
  },

  English: {
    Grammar: [
      {text:"Choose the correct form: She ___ to school every day.",options:["go","goes","going","gone"],answer:"goes",difficulty:1,explanation:"Subject 'she' is third-person singular, so the verb takes -s/es: 'goes'."},
      {text:"The passive voice of 'He reads a book' is:",options:["A book read by him","A book is read by him","A book was read by him","A book has been read by him"],answer:"A book is read by him",difficulty:2,explanation:"Present simple active → present simple passive: 'is + past participle'. 'He reads' → 'is read by him'."},
      {text:"Which sentence is in the past perfect tense?",options:["She went to school","She had gone to school","She has gone to school","She goes to school"],answer:"She had gone to school",difficulty:2,explanation:"Past perfect = had + past participle ('had gone')."},
      {text:"Choose the correct conjunction: He studied hard, ___ he failed.",options:["so","because","but","and"],answer:"but",difficulty:1,explanation:"'But' is used to show contrast — studied hard vs. failed."},
      {text:"The plural of 'criterion' is:",options:["Criterions","Criteria","Criterias","Criterions"],answer:"Criteria",difficulty:2,explanation:"'Criterion' is a Greek-origin word. Its correct plural is 'criteria'."},
      {text:"Identify the figure of speech: 'The wind whispered through the trees.'",options:["Simile","Metaphor","Personification","Alliteration"],answer:"Personification",difficulty:1,explanation:"Giving human qualities (whispering) to a non-human thing (wind) is personification."},
      {text:"Change to indirect speech: She said, 'I am happy.'",options:["She said that she is happy","She said that she was happy","She told that she is happy","She says that she was happy"],answer:"She said that she was happy",difficulty:2,explanation:"In reported speech, 'am' (present) backshifts to 'was' (past) after a past reporting verb."},
    ],
    Vocabulary: [
      {text:"The antonym of 'ancient' is:",options:["Old","Modern","Historic","Past"],answer:"Modern",difficulty:1,explanation:"'Ancient' means very old. Its antonym (opposite) is 'modern' meaning contemporary."},
      {text:"A synonym of 'benevolent' is:",options:["Kind","Cruel","Lazy","Strict"],answer:"Kind",difficulty:1,explanation:"'Benevolent' means well-meaning and charitable — synonym: kind/generous."},
      {text:"'He is the black sheep of the family' is an example of:",options:["Simile","Idiom","Metaphor","Proverb"],answer:"Idiom",difficulty:1,explanation:"An idiom is a phrase whose meaning is different from the literal meanings of its words. 'Black sheep' means the odd one out."},
      {text:"The word 'ephemeral' means:",options:["Lasting forever","Short-lived","Very large","Very small"],answer:"Short-lived",difficulty:3,explanation:"'Ephemeral' (from Greek ephemeros) means lasting for a very short time."},
      {text:"Choose the correctly spelt word:",options:["Accomodation","Accommodation","Acommodation","Acomodation"],answer:"Accommodation",difficulty:2,explanation:"'Accommodation' has double 'c' and double 'm': ac-com-mo-da-tion."},
    ],
    Tenses: [
      {text:"Which sentence is in simple past tense?",options:["She will go tomorrow","She goes every day","She went yesterday","She is going now"],answer:"She went yesterday",difficulty:1,explanation:"Simple past uses the past form of the verb ('went') without any auxiliary."},
      {text:"'She has been studying for three hours.' This is:",options:["Present perfect","Past continuous","Present perfect continuous","Simple present"],answer:"Present perfect continuous",difficulty:2,explanation:"Have/has + been + V-ing = Present Perfect Continuous. It shows an action that started in the past and continues."},
      {text:"The future continuous tense is formed with:",options:["will + V1","will have + V3","will be + V-ing","will have been + V-ing"],answer:"will be + V-ing",difficulty:2,explanation:"Future Continuous = will be + present participle (V-ing), e.g., 'He will be working tomorrow.'"},
    ],
  },

  Hindi: {
    'व्याकरण': [
      {text:"'राम स्कूल जाता है।' — इस वाक्य में 'राम' है:",options:["कर्म","कर्ता","क्रिया","विशेषण"],answer:"कर्ता",difficulty:1,explanation:"जो काम करे वह कर्ता होता है। 'राम' यहाँ काम करने वाला है, इसलिए कर्ता है।"},
      {text:"संज्ञा के कितने भेद हैं?",options:["दो","तीन","पाँच","सात"],answer:"पाँच",difficulty:2,explanation:"संज्ञा के पाँच भेद हैं: व्यक्तिवाचक, जातिवाचक, भाववाचक, समूहवाचक, द्रव्यवाचक।"},
      {text:"'मीठा' शब्द में कौन-सा विशेषण है?",options:["गुणवाचक","परिमाणवाचक","संख्यावाचक","सार्वनामिक"],answer:"गुणवाचक",difficulty:1,explanation:"'मीठा' किसी गुण (स्वाद) का बोध कराता है, इसलिए यह गुणवाचक विशेषण है।"},
      {text:"'वह आता है' — वाक्य का काल है:",options:["भूतकाल","वर्तमानकाल","भविष्यतकाल","संदिग्ध"],answer:"वर्तमानकाल",difficulty:1,explanation:"'है' क्रिया वर्तमान समय को दर्शाती है, इसलिए यह वर्तमानकाल का वाक्य है।"},
      {text:"निम्न में से कौन-सा तत्सम शब्द है?",options:["काम","आग","अग्नि","काज"],answer:"अग्नि",difficulty:2,explanation:"'अग्नि' संस्कृत का मूल शब्द (तत्सम) है। 'आग' इसका तद्भव रूप है।"},
      {text:"'राष्ट्र' में कौन-सा उपसर्ग है?",options:["रा","राष्","कोई नहीं","राष्ट्र"],answer:"कोई नहीं",difficulty:3,explanation:"'राष्ट्र' एक मूल शब्द है। इसमें कोई उपसर्ग या प्रत्यय नहीं है।"},
    ],
    'कविता': [
      {text:"'मेघ आए' कविता के रचयिता हैं:",options:["निराला","प्रसाद","सर्वेश्वर दयाल सक्सेना","मैथिलीशरण गुप्त"],answer:"सर्वेश्वर दयाल सक्सेना",difficulty:2,explanation:"'मेघ आए' कविता सर्वेश्वर दयाल सक्सेना द्वारा रचित है जो आधुनिक हिंदी कविता का प्रसिद्ध उदाहरण है।"},
      {text:"'दोहा' छंद में चरणों की संख्या होती है:",options:["दो","तीन","चार","छह"],answer:"चार",difficulty:2,explanation:"दोहे में चार चरण होते हैं — दो पंक्तियाँ, प्रत्येक में दो चरण।"},
      {text:"'उत्साह' कविता में 'बादल' किसका प्रतीक है?",options:["वर्षा का","क्रांति का","आनंद का","शांति का"],answer:"क्रांति का",difficulty:3,explanation:"निराला की 'उत्साह' कविता में बादल क्रांति, परिवर्तन और नई ऊर्जा का प्रतीक है।"},
    ],
  },
};

// Generic pool used when a specific chapter isn't in the bank
const GENERIC_MCQ = [
  {text:"Which of the following is a renewable source of energy?",options:["Coal","Natural gas","Solar energy","Petroleum"],answer:"Solar energy",difficulty:1,chapter:"General",explanation:"Solar energy is renewable — it comes from the sun, which will keep shining for billions of years."},
  {text:"The process of converting light energy into chemical energy is:",options:["Respiration","Photosynthesis","Fermentation","Digestion"],answer:"Photosynthesis",difficulty:1,chapter:"General",explanation:"Plants convert sunlight + CO₂ + water → glucose + oxygen during photosynthesis."},
  {text:"Which planet is closest to the Sun?",options:["Venus","Earth","Mars","Mercury"],answer:"Mercury",difficulty:1,chapter:"General",explanation:"Mercury is the closest planet to the Sun, orbiting at about 57.9 million km."},
  {text:"Water boils at 100°C at:",options:["High altitude","Sea level","Low temperature","High pressure"],answer:"Sea level",difficulty:1,chapter:"General",explanation:"Water boils at 100°C at sea level (1 atm). At higher altitudes, it boils at a lower temperature."},
  {text:"The chemical symbol for gold is:",options:["Go","Gd","Au","Ag"],answer:"Au",difficulty:1,chapter:"General",explanation:"Gold's symbol Au comes from the Latin word 'Aurum'."},
  {text:"The speed of light in vacuum is approximately:",options:["3×10⁴ m/s","3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s"],answer:"3×10⁸ m/s",difficulty:1,chapter:"General",explanation:"The speed of light c ≈ 2.998 × 10⁸ m/s in vacuum."},
  {text:"The human genome contains approximately how many base pairs?",options:["3 million","30 million","3 billion","30 billion"],answer:"3 billion",difficulty:2,chapter:"General",explanation:"The human genome consists of approximately 3 billion base pairs spread across 23 chromosomes."},
  {text:"The process of heating steel to a high temperature and then slowly cooling it is called:",options:["Tempering","Quenching","Annealing","Case hardening"],answer:"Annealing",difficulty:3,chapter:"General",explanation:"Annealing reduces internal stresses, increases ductility by slowly cooling heated metal."},
  {text:"Which country launched the first artificial satellite?",options:["USA","China","India","USSR"],answer:"USSR",difficulty:1,chapter:"General",explanation:"The Soviet Union (USSR) launched Sputnik 1 on October 4, 1957 — the first artificial satellite."},
  {text:"The hardest natural substance is:",options:["Steel","Quartz","Diamond","Iron"],answer:"Diamond",difficulty:1,chapter:"General",explanation:"Diamond, a form of pure carbon, is the hardest natural material (10 on the Mohs scale)."},
];

// Shuffle array in-place using Fisher-Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns `count` questions for the given subject + chapter.
 * Adds `id`, `chapter`, and ensures all required fields exist.
 * Shuffles options so the correct answer isn't always in the same position.
 */
export function getFallbackAdaptiveQuestions(subject, chapter, count, weakAreas = {}) {
  const subjectBank = BANK[subject] || {};
  const chapterPool = subjectBank[chapter] || [];

  // Merge chapter pool + generic pool (so we always have enough)
  let pool = [...chapterPool, ...GENERIC_MCQ];

  // Bias toward weak chapters: if this chapter score is low, repeat its questions more
  const chScore = weakAreas[chapter] ?? 70;
  if (chScore < 50 && chapterPool.length > 0) {
    pool = [...chapterPool, ...pool]; // double the chapter questions
  }

  pool = shuffle(pool);

  const selected = [];
  for (let i = 0; i < count; i++) {
    const raw = pool[i % pool.length];
    const shuffledOptions = shuffle(raw.options);
    selected.push({
      id: `fb_${subject}_${chapter}_${i}_${Date.now()}`,
      text: raw.text,
      options: shuffledOptions,
      answer: raw.answer,
      difficulty: raw.difficulty || 2,
      chapter: chapter,
      explanation: raw.explanation || '',
      source: 'curated',
    });
  }
  return selected;
}
