// CBSE Physics & Chemistry Practical Experiments Database
// Spans Class 6 to Class 12 CBSE Curriculum

export const EXPERIMENTS = [
  // ================= CLASS 10 PHYSICS: OHM'S LAW =================
  {
    id: 'exp-ohms-law',
    title: "Verification of Ohm's Law and Finding Unknown Resistance",
    classNum: 10,
    classLabel: 'Class 10',
    subject: 'Physics',
    category: 'Electricity & Magnetism',
    syllabusCode: 'CBSE Class 10 Exp-1 (Physics)',
    difficulty: 'Medium',
    icon: '⚡',
    aim: 'To determine the resistance per unit length of a given wire by plotting a graph of potential difference versus current.',
    theory: 'Ohm’s law states that the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends, provided its temperature and other physical conditions remain unchanged: V = I · R, where R is the resistance of the conductor.',
    formula: 'R = V / I  (Slope of V vs I graph gives R)',
    standardValue: 5.0, // ohms
    standardUnit: 'Ω',
    equipments: [
      { name: 'DC Power Supply', spec: '0 - 12V Variable DC', icon: '🔋', purpose: 'Provides constant regulated potential difference.' },
      { name: 'Voltmeter', spec: '0 - 5V DC (Least Count: 0.1V)', icon: '📟', purpose: 'Measures potential difference across test resistance wire.' },
      { name: 'Ammeter', spec: '0 - 2A DC (Least Count: 0.05A)', icon: '⏱️', purpose: 'Measures current flowing through the circuit.' },
      { name: 'Nichrome Resistance Wire', spec: 'Standard 50 cm length (~5.0 Ω)', icon: '〰️', purpose: 'Test conductor for Ohm’s Law verification.' },
      { name: 'Rheostat', spec: '0 - 100 Ω, 2A slider', icon: '🎛️', purpose: 'Controls circuit resistance to adjust current step-by-step.' },
      { name: 'One-Way Plug Key', spec: 'Brass plug with bakelite base', icon: '🔑', purpose: 'Opens and closes the circuit safely.' },
      { name: 'Connecting Wires', spec: 'Copper insulated thick wires with crocodile pins', icon: '🔌', purpose: 'Connects electrical components with minimal contact resistance.' }
    ],
    procedureSteps: [
      'Clean the ends of connecting wires with sandpaper to remove oxide insulation.',
      'Connect the battery, ammeter, resistance wire, rheostat, and plug key in series.',
      'Connect the voltmeter in parallel across the nichrome resistance wire (ensure correct polarities: + to +, - to -).',
      'Ensure the plug key is open before adjusting the circuit. Set rheostat to maximum resistance.',
      'Insert the plug key. Slowly slide rheostat to vary the current in 5-6 uniform steps (0.2A, 0.4A, 0.6A, 0.8A, 1.0A).',
      'For each step, immediately record Voltmeter (V) and Ammeter (I) readings.',
      'Remove the plug key between readings to avoid overheating of the resistance wire.',
      'Plot a graph of Potential Difference (V) on Y-axis vs Current (I) on X-axis and compute slope R = ΔV / ΔI.'
    ],
    simType: 'ohms-law',
    vivaQuestions: [
      {
        q: "What is Ohm's Law and under what conditions is it valid?",
        a: "Current I is directly proportional to potential difference V across a conductor, provided temperature, strain, and material dimensions remain strictly constant."
      },
      {
        q: "Why should the key be removed between taking two observations?",
        a: "Continuous passage of electric current causes Joule heating (H = I²Rt). Temperature rise increases the resistance of the nichrome wire, causing deviation from linearity."
      },
      {
        q: "Why is an ammeter connected in series and voltmeter in parallel?",
        a: "An ideal ammeter has zero resistance, so connecting in series measures full current without altering it. An ideal voltmeter has infinite resistance, so connecting in parallel samples potential difference without drawing current."
      },
      {
        q: "What does the slope of the V vs I graph represent?",
        a: "The slope (ΔV / ΔI) represents the electrical resistance (R) of the given wire in Ohms (Ω)."
      }
    ]
  },

  // ================= CLASS 12 CHEMISTRY: TITRATION (KMnO4 vs MOHR'S SALT) =================
  {
    id: 'exp-redox-titration',
    title: 'Redox Titration: KMnO4 vs Mohr’s Salt (Standard Fe²⁺)',
    classNum: 12,
    classLabel: 'Class 12',
    subject: 'Chemistry',
    category: 'Volumetric & Quantitative Analysis',
    syllabusCode: 'CBSE Class 12 Exp-2 (Chemistry)',
    difficulty: 'Hard',
    icon: '🧪',
    aim: 'To determine the molarity and strength of a given potassium permanganate (KMnO4) solution by titrating it against standard 0.05 M Mohr’s salt solution.',
    theory: 'Potassium permanganate acts as a powerful self-indicator oxidizing agent in dilute H2SO4 medium. It oxidizes ferrous ions (Fe²⁺) from Mohr’s salt to ferric ions (Fe³⁺) while itself being reduced from MnO4⁻ (purple, +7) to Mn²⁺ (colorless, +2). The end point is marked by the appearance of a permanent faint pink color.',
    formula: '2 KMnO4 + 8 H2SO4 + 10 FeSO4(NH4)2SO4 → K2SO4 + 2 MnSO4 + 5 Fe2(SO4)3 + 10 (NH4)2SO4 + 8 H2O\n(a1 × M1 × V1) / n1 = (a2 × M2 × V2) / n2',
    standardValue: 10.0, // mL of KMnO4 for 10 mL 0.05M Mohr's salt
    standardUnit: 'mL',
    equipments: [
      { name: 'Burette & Stand', spec: '50 mL graduated with stopcock (LC 0.1 mL)', icon: '🧪', purpose: 'Dispenses potassium permanganate drop-by-drop.' },
      { name: 'Pipette', spec: '10 mL volumetric with safety bulb', icon: '💉', purpose: 'Accurately measures 10.0 mL of standard Mohr’s salt solution.' },
      { name: 'Conical Flask', spec: '250 mL Borosilicate glass', icon: '🍶', purpose: 'Reaction vessel for titration.' },
      { name: 'White Glazed Tile', spec: 'Ceramic 15 × 15 cm', icon: '⬜', purpose: 'Provides crisp contrast to detect the subtle faint pink endpoint.' },
      { name: 'KMnO4 Solution', spec: '0.02 M approximately (deep purple)', icon: '🟣', purpose: 'Titrant and self-indicator in burette.' },
      { name: 'Mohr’s Salt Solution', spec: '0.05 M Standard solution', icon: '🟢', purpose: 'Primary standard ferrous ammonium sulfate.' },
      { name: 'Dilute Sulfuric Acid (H2SO4)', spec: '2 M dilute laboratory grade', icon: '⚠️', purpose: 'Provides essential acidic medium for permanganate reduction.' }
    ],
    procedureSteps: [
      'Rinse and fill the burette with KMnO4 solution. Clamp it vertically. Check for air bubbles below the stopcock.',
      'Read the UPPER meniscus of the dark purple KMnO4 at eye level and note initial burette reading.',
      'Pipette out exactly 10.0 mL of standard Mohr’s salt solution into a clean 250 mL conical flask.',
      'Add one full test tube (~15-20 mL) of dilute H2SO4 to the conical flask.',
      'Place the conical flask on the white tile below the burette tip.',
      'Titrate by adding KMnO4 drop-by-drop while continuously swirling the conical flask.',
      'Stop adding KMnO4 the instant a single drop produces a permanent faint pink color that persists for at least 30 seconds.',
      'Record the final burette reading (Upper meniscus) and repeat until concordant readings (differing by ≤ 0.1 mL) are obtained.'
    ],
    simType: 'titration',
    vivaQuestions: [
      {
        q: "Why is KMnO4 called a self-indicator?",
        a: "KMnO4 has an intense purple color. The reduced product (Mn²⁺) is virtually colorless. At the equivalence point, a single extra drop of KMnO4 imparts a visible permanent faint pink tint, requiring no external indicator."
      },
      {
        q: "Why is dilute H2SO4 used instead of HCl or HNO3 in this titration?",
        a: "HCl reacts with KMnO4 to release toxic chlorine gas (oxidized). HNO3 is itself a strong oxidizing agent that would oxidize Fe²⁺, giving incorrect titre values. Dilute H2SO4 does not interfere."
      },
      {
        q: "Why do we read the upper meniscus for KMnO4 solution in the burette?",
        a: "KMnO4 is intensely colored and opaque, making the bottom of the meniscus invisible. Therefore, the top/upper meniscus is read to eliminate parallax ambiguity."
      },
      {
        q: "What causes a brown precipitate during titration?",
        a: "Insufficient acid (H2SO4) leads to incomplete reduction of MnO4⁻, forming brown hydrated manganese dioxide (MnO2) precipitate instead of soluble Mn²⁺."
      }
    ]
  },

  // ================= CLASS 11 PHYSICS: SIMPLE PENDULUM =================
  {
    id: 'exp-simple-pendulum',
    title: 'Determination of "g" Using a Simple Pendulum (T² vs L Graph)',
    classNum: 11,
    classLabel: 'Class 11',
    subject: 'Physics',
    category: 'Mechanics & Oscillations',
    syllabusCode: 'CBSE Class 11 Exp-1 (Physics)',
    difficulty: 'Medium',
    icon: '⏳',
    aim: 'To determine the acceleration due to gravity (g) at a place using a simple pendulum and by plotting L vs T² graph.',
    theory: 'For small angular amplitude oscillations (θ < 15°), a simple pendulum executes Simple Harmonic Motion (SHM). Its time period T is given by T = 2π√(L/g), where L is the effective length (length of string l + radius of bob r + hook length e). Squaring gives T² = (4π²/g) · L. The slope of the L vs T² graph equals g / (4π²).',
    formula: 'g = 4π² · (L / T²)  or  g = 4π² / Slope(T² vs L)',
    standardValue: 9.8, // m/s^2
    standardUnit: 'm/s²',
    equipments: [
      { name: 'Heavy Metallic Bob with Hook', spec: 'Brass spherical bob (dia ~2.5 cm)', icon: '⚪', purpose: 'Acts as concentrated mass with well-defined center of gravity.' },
      { name: 'Rigid Iron Stand with Clamp', spec: 'Heavy cast-iron base with vertical rod', icon: '🏗️', purpose: 'Provides rigid, non-yielding support for pendulum suspension.' },
      { name: 'Split Cork', spec: 'Two semi-cylindrical rubber/cork halves', icon: '🪵', purpose: 'Firmly clamps the thread at the exact point of suspension.' },
      { name: 'Fine Inextensible Thread', spec: 'Tightly spun cotton string (~150 cm)', icon: '🧵', purpose: 'Suspends the bob without stretching during oscillation.' },
      { name: 'Vernier Calipers', spec: 'Least count 0.01 cm', icon: '📏', purpose: 'Accurately measures diameter and radius of the bob.' },
      { name: 'Meter Scale', spec: '1 Meter wooden/metal scale (LC 1 mm)', icon: '📐', purpose: 'Measures length of string from suspension to top of bob.' },
      { name: 'Digital Stopwatch', spec: 'Precision 0.01s', icon: '⏱️', purpose: 'Measures time taken for 20 complete oscillations.' }
    ],
    procedureSteps: [
      'Measure diameter of bob using Vernier Calipers and find radius r = d / 2.',
      'Pass thread through split cork and clamp tightly in the stand.',
      'Adjust string length l so effective length L = l + r + hook is exactly 60 cm.',
      'Mark equilibrium mean position on the bench/graph paper behind the pendulum.',
      'Displace bob gently through a SMALL angle (less than 10° - 15°) along a straight line and release smoothly without spin.',
      'Start the stopwatch as bob passes mean position. Count 20 complete oscillations.',
      'Stop timer at the completion of the 20th oscillation and calculate time period T = t / 20 and T².',
      'Repeat for lengths 70 cm, 80 cm, 90 cm, 100 cm, 110 cm.',
      'Plot L on X-axis vs T² on Y-axis, draw the best-fit straight line passing through origin, and compute g = 4π² · (L / T²).'
    ],
    simType: 'pendulum',
    vivaQuestions: [
      {
        q: "Why must the angular displacement be kept small (less than 15°)?",
        a: "The restoring force is F = -mg sin θ. The motion is strictly Simple Harmonic Motion (SHM) only when sin θ ≈ θ in radians, which is valid only for small angles (θ < 15°)."
      },
      {
        q: "What is the effective length of a simple pendulum?",
        a: "The distance from the point of suspension to the center of gravity of the bob: L = length of string (l) + hook length (e) + radius of bob (r)."
      },
      {
        q: "Does the time period depend on the mass of the bob or amplitude?",
        a: "No, time period is independent of the mass and material of the bob, as well as amplitude (for small oscillations)."
      },
      {
        q: "What is a seconds pendulum?",
        a: "A pendulum whose time period is exactly 2 seconds (taking 1 second for a single swing from one extreme to the other). On Earth's surface, its length is approximately 99.4 cm."
      }
    ]
  },

  // ================= CLASS 12 PHYSICS: PRISM MINIMUM DEVIATION =================
  {
    id: 'exp-prism-refraction',
    title: 'Refractive Index of Glass Prism (Angle of Minimum Deviation)',
    classNum: 12,
    classLabel: 'Class 12',
    subject: 'Physics',
    category: 'Optics & Light',
    syllabusCode: 'CBSE Class 12 Exp-3 (Physics)',
    difficulty: 'Hard',
    icon: '🔺',
    aim: 'To determine the angle of minimum deviation (Dm) for a given glass prism by plotting a graph between angle of incidence (i) and angle of deviation (δ), and calculate its refractive index.',
    theory: 'When a ray of light passes through a triangular prism, it suffers refraction at both faces. The angle between the incident ray produced forward and emergent ray produced backward is called angle of deviation (δ). At minimum deviation (Dm), the ray passes symmetrically through the prism parallel to the base, and angle of incidence equals angle of emergence (i = e).',
    formula: 'μ = sin((A + Dm) / 2) / sin(A / 2)  [Where A = 60° for equilateral prism]',
    standardValue: 1.52, // Crown glass refractive index
    standardUnit: 'μ',
    equipments: [
      { name: 'Equilateral Glass Prism', spec: 'Refracting angle A = 60°, crown glass', icon: '🔺', purpose: 'Refracts light rays through its triangular cross-section.' },
      { name: 'Drawing Board & Graph Paper', spec: 'Soft pine wood board with graph paper', icon: '📋', purpose: 'Provides stable surface for pin tracing and angle alignment.' },
      { name: 'Optical Pins (4 Nos)', spec: 'Stainless steel sharp pins with flat heads', icon: '📍', purpose: 'Define incident ray (P1, P2) and emergent ray (P3, P4).' },
      { name: 'Circular Protractor', spec: '360° graduation (precision 0.5°)', icon: '📐', purpose: 'Measures angle of incidence (i) and deviation (δ).' },
      { name: 'Clear Metric Ruler', spec: '30 cm transparent ruler', icon: '📏', purpose: 'Draws normal, incident, and emergent rays.' },
      { name: 'Board Fixing Pins / Clips', spec: 'Thumb pins', icon: '📌', purpose: 'Fixes graph paper securely without wrinkling.' }
    ],
    procedureSteps: [
      'Fix a sheet of graph paper on the drawing board using thumb pins.',
      'Place prism at the center and draw its triangular boundary ABC with a sharp pencil. Angle A = 60°.',
      'Draw a normal NM to face AB. Draw an incident ray line making angle i = 35° with the normal.',
      'Fix two pins P1 and P2 vertically along the incident ray line, separated by at least 6-8 cm.',
      'Look into the opposite face AC with one eye closed. Fix pin P3 and then P4 so that all 4 pins appear to lie in a straight line.',
      'Remove prism and pins, encircle pin pricks, draw emergent line through P3 and P4.',
      'Extend incident ray forward and emergent ray backward. Measure angle of deviation (δ) between them.',
      'Repeat the procedure for angles of incidence i = 35°, 40°, 45°, 50°, 55°, 60°.',
      'Plot i on X-axis vs δ on Y-axis. Identify the minimum point of the U-shaped curve (Dm) and compute refractive index μ.'
    ],
    simType: 'prism',
    vivaQuestions: [
      {
        q: "What is angle of minimum deviation (Dm)?",
        a: "It is the smallest angle by which a light ray can be deviated by the prism. At this angle, the ray travels parallel to the base inside an equilateral prism, and i = e, r1 = r2."
      },
      {
        q: "Why must optical pins be separated by at least 5 to 8 cm?",
        a: "Close pins cause parallax error and large angular deviation errors when projecting straight rays across the board."
      },
      {
        q: "How does the refractive index depend on the color (wavelength) of light?",
        a: "By Cauchy’s dispersion formula: μ = A + B/λ². Since violet light has shorter wavelength than red, μ_violet > μ_red, causing violet to deviate the most."
      },
      {
        q: "What will happen if the prism is immersed in water?",
        a: "The relative refractive index of glass with respect to water (w_μ_g = μ_g / μ_w) is less than that with respect to air. Hence, angle of minimum deviation decreases."
      }
    ]
  },

  // ================= CLASS 10 CHEMISTRY: METALS & ACIDS (ZINC + HCl) =================
  {
    id: 'exp-zinc-acid-reaction',
    title: 'Reaction of Zinc with Dilute Hydrochloric Acid (H2 Gas Pop Test)',
    classNum: 10,
    classLabel: 'Class 10',
    subject: 'Chemistry',
    category: 'Chemical Reactions & Gas Evolution',
    syllabusCode: 'CBSE Class 10 Exp-2 (Chemistry)',
    difficulty: 'Easy',
    icon: '💥',
    aim: 'To observe the reaction of zinc granules with dilute hydrochloric acid, collect the evolved gas, and test for hydrogen gas with a burning splinter.',
    theory: 'Zinc is more reactive than hydrogen in the electrochemical activity series. When zinc reacts with dilute hydrochloric acid, single displacement occurs: zinc displaces hydrogen, forming zinc chloride salt and liberating hydrogen gas (H2). Hydrogen is combustible and burns in air with a characteristic "pop" sound.',
    formula: 'Zn (s) + 2 HCl (aq) → ZnCl2 (aq) + H2 (g) ↑\n2 H2 (g) + O2 (g) → 2 H2O (l) + Energy (Pop sound explosion)',
    standardValue: 1.0,
    standardUnit: 'Reaction Completed',
    equipments: [
      { name: 'Hard Glass Boiling Tube & Stand', spec: '25 × 150 mm Borosilicate tube', icon: '🧪', purpose: 'Reaction container capable of handling exothermic reaction.' },
      { name: 'Delivery Tube with Rubber Cork', spec: 'L-shaped bent glass tube with one-hole cork', icon: '🔬', purpose: 'Channels evolved hydrogen gas safely.' },
      { name: 'Zinc Granules', spec: 'Pure granular metallic zinc', icon: '🪙', purpose: 'Reducing metal reactant.' },
      { name: 'Dilute Hydrochloric Acid (HCl)', spec: '1M analytical grade acid', icon: '🧫', purpose: 'Acid reactant providing hydronium ions.' },
      { name: 'Trough with Soap Solution', spec: 'Glass crystallization dish with soapy water', icon: '🫧', purpose: 'Traps hydrogen gas in buoyant soap bubbles for safe testing.' },
      { name: 'Burning Wooden Splinter / Matchstick', spec: 'Laboratory wooden splints', icon: '🔥', purpose: 'Provides flame ignition to confirm hydrogen pop test.' }
    ],
    procedureSteps: [
      'Place about 5 g of cleaned zinc granules into the test tube clamped in a stand.',
      'Carefully add 5 mL of dilute hydrochloric acid using a dropper or funnel.',
      'Immediately fit the rubber cork with delivery tube tightly to prevent gas leakage.',
      'Notice vigorous effervescence as brisk bubbles of hydrogen gas evolve. Feel the bottom of the tube (exothermic reaction).',
      'Pass the gas through the soap solution in the trough to create gas-filled soap bubbles.',
      'Bring a burning matchstick or splinter near the rising gas bubbles.',
      'Observe the soap bubbles burst with a distinct sharp "POP" sound and pale blue flame.',
      'Record observations in the lab notebook.'
    ],
    simType: 'reactions',
    subType: 'zinc-hcl',
    vivaQuestions: [
      {
        q: "Why does hydrogen gas burn with a 'pop' sound?",
        a: "Hydrogen mixes rapidly with atmospheric oxygen. When ignited, the explosive instantaneous combustion produces sudden shock waves heard as a sharp 'pop'."
      },
      {
        q: "Why is nitric acid (HNO3) generally not used for preparing H2 gas with metals?",
        a: "Nitric acid is a strong oxidizing agent. It immediately oxidizes the evolved hydrogen into water (H2O) and itself gets reduced to oxides of nitrogen (NO2, NO, N2O)."
      },
      {
        q: "Is the reaction between zinc and dilute HCl exothermic or endothermic?",
        a: "It is an exothermic reaction. Heat is liberated into the surroundings, warming the test tube."
      }
    ]
  },

  // ================= CLASS 9 CHEMISTRY: CONSERVATION OF MASS =================
  {
    id: 'exp-conservation-of-mass',
    title: 'Verification of the Law of Conservation of Mass in a Chemical Reaction',
    classNum: 9,
    classLabel: 'Class 9',
    subject: 'Chemistry',
    category: 'Foundations & Stoichiometry',
    syllabusCode: 'CBSE Class 9 Exp-1 (Chemistry)',
    difficulty: 'Easy',
    icon: '⚖️',
    aim: 'To verify the law of conservation of mass in a chemical reaction between barium chloride and sodium sulfate.',
    theory: 'The Law of Conservation of Mass states that mass can neither be created nor destroyed in a chemical reaction. The total mass of the reactants before the reaction is always strictly equal to the total mass of the products formed: Total Mass of Reactants = Total Mass of Products.',
    formula: 'BaCl2 (aq) + Na2SO4 (aq) → BaSO4 (s) ↓ (White ppt) + 2 NaCl (aq)\nMass(m1) before mixing = Mass(m2) after mixing',
    standardValue: 125.40, // Grams total
    standardUnit: 'g',
    equipments: [
      { name: 'Conical Flask (250 mL)', spec: 'Borosilicate flat bottom flask', icon: '🍶', purpose: 'Houses sodium sulfate solution and suspended ignition tube.' },
      { name: 'Small Ignition Tube with Thread', spec: '75 mm glass tube tied with cotton thread', icon: '🧪', purpose: 'Separates barium chloride solution before deliberate mixing.' },
      { name: 'Digital Analytical Balance', spec: 'Precision 0.01 g', icon: '⚖️', purpose: 'Measures total mass before and after reaction.' },
      { name: 'Tight Rubber Cork', spec: 'Air-tight silicone stopper', icon: '🔘', purpose: 'Seals flask to ensure closed system with zero mass loss.' },
      { name: 'Barium Chloride Solution (5%)', spec: 'Clear aqueous BaCl2', icon: '💧', purpose: 'Precipitating cation provider.' },
      { name: 'Sodium Sulfate Solution (5%)', spec: 'Clear aqueous Na2SO4', icon: '💧', purpose: 'Sulfate anion provider.' }
    ],
    procedureSteps: [
      'Take 10 mL of 5% sodium sulfate (Na2SO4) solution in a clean 250 mL conical flask.',
      'Take 5 mL of 5% barium chloride (BaCl2) solution in the small ignition tube.',
      'Suspend the ignition tube carefully inside the conical flask using thread without spilling any liquid.',
      'Fit the rubber cork tightly onto the mouth of the conical flask.',
      'Place the entire assembly on the digital balance and accurately record initial mass (m1).',
      'Tilt and swirl the conical flask so that the two solutions mix thoroughly.',
      'Observe the instantaneous formation of an insoluble milky white precipitate of barium sulfate (BaSO4).',
      'Weigh the conical flask assembly again on the balance and record final mass (m2). Compare m1 and m2.'
    ],
    simType: 'reactions',
    subType: 'mass-conservation',
    vivaQuestions: [
      {
        q: "What is the Law of Conservation of Mass?",
        a: "Formulated by Antoine Lavoisier in 1789: In any closed chemical reaction, the total mass of the products is always equal to the total mass of the reactants."
      },
      {
        q: "Why is a tight cork required on the flask?",
        a: "To ensure the system remains closed so that no vapors, moisture, or matter can escape or enter during the experiment."
      },
      {
        q: "What is the white precipitate formed and what type of reaction is this?",
        a: "The precipitate is Barium Sulfate (BaSO4). This is a double displacement precipitation reaction."
      }
    ]
  },

  // ================= CLASS 9 PHYSICS: ARCHIMEDES' PRINCIPLE =================
  {
    id: 'exp-archimedes-principle',
    title: 'Verification of Archimedes’ Principle and Upthrust',
    classNum: 9,
    classLabel: 'Class 9',
    subject: 'Physics',
    category: 'Mechanics & Fluids',
    syllabusCode: 'CBSE Class 9 Exp-2 (Physics)',
    difficulty: 'Medium',
    icon: '🌊',
    aim: 'To establish the relation between the loss in weight of a solid body when fully immersed in water and the weight of water displaced by it.',
    theory: 'Archimedes’ principle states that when a body is completely or partially immersed in a fluid at rest, it experiences an upward buoyant force (upthrust) equal to the weight of the fluid displaced by it: Loss of weight in water = Weight of water displaced.',
    formula: 'Upthrust F_b = W_air - W_water = Weight of Displaced Liquid = V · ρ_water · g',
    standardValue: 40.0, // grams-weight
    standardUnit: 'g-wt',
    equipments: [
      { name: 'Spring Balance', spec: '0 - 250 g-wt (Least Count 2.5 g-wt)', icon: '⚖️', purpose: 'Measures weight of solid in air and apparent weight in water.' },
      { name: 'Graduated Measuring Cylinder', spec: '100 mL glass cylinder (LC 1 mL)', icon: '🧪', purpose: 'Measures volume of displaced water.' },
      { name: 'Eureka / Overflow Can', spec: 'Metallic can with angled overflow spout', icon: '🫗', purpose: 'Channels exactly displaced water into collecting beaker.' },
      { name: 'Solid Metallic Cylinder (Brass)', spec: 'Dense non-porous metallic cylinder (~150 g)', icon: '🔩', purpose: 'Immersion body.' },
      { name: 'Collecting Beaker', spec: 'Lightweight tare beaker (50 mL)', icon: '🥛', purpose: 'Catches overflow water from spout.' },
      { name: 'Fine Thread', spec: 'Strong thin nylon string', icon: '🧵', purpose: 'Suspends the metallic body without adding buoyancy.' }
    ],
    procedureSteps: [
      'Note the zero error and least count of the spring balance.',
      'Fill the overflow can with water until water overflows from the spout. Wait until dripping completely stops.',
      'Place a dry, weighed measuring cylinder below the spout.',
      'Tie the brass cylinder with thread and suspend it from the spring balance. Note weight in air (W1).',
      'Gently lower the cylinder into the overflow can until it is completely submerged without touching sides or bottom.',
      'Note the new reduced weight on the spring balance (W2). Loss of weight = W1 - W2.',
      'Collect all the overflow water in the measuring cylinder and read its volume (V) and compute displaced weight.',
      'Verify that: Apparent Loss in Weight = Weight of Displaced Water.'
    ],
    simType: 'archimedes',
    vivaQuestions: [
      {
        q: "State Archimedes' Principle.",
        a: "When a body is immersed wholly or partially in a fluid, it experiences an upward buoyant force equal to the weight of the fluid displaced by it."
      },
      {
        q: "Why does an iron nail sink in water while a massive iron ship floats?",
        a: "An iron nail has small volume, so the weight of water displaced is less than its weight. A ship is hollow, giving it large volume and large displaced water weight equal to the ship's total weight."
      },
      {
        q: "What causes buoyant force (upthrust)?",
        a: "Liquid pressure increases with depth (P = hρg). Hence, upward hydrostatic pressure on the bottom face of an immersed object exceeds downward pressure on its top face."
      }
    ]
  },

  // ================= CLASS 6/7 SCIENCE: ELECTRIC CIRCUIT & CONDUCTORS =================
  {
    id: 'exp-electric-circuit-conductors',
    title: 'Testing Conductors and Insulators Using a Simple Electric Circuit',
    classNum: 6,
    classLabel: 'Class 6 & 7',
    subject: 'Physics',
    category: 'Electricity & Circuits',
    syllabusCode: 'CBSE Class 6 Exp-4 (Science)',
    difficulty: 'Easy',
    icon: '💡',
    aim: 'To design a conductivity tester circuit and classify everyday materials into electrical conductors and insulators.',
    theory: 'An electric circuit provides a closed, unbroken loop through which electric current can flow from the positive to negative terminal of a cell. Materials that allow electric current to pass freely are called electrical conductors (metals, graphite). Materials that block electric current are called electrical insulators (rubber, plastic, wood, glass).',
    formula: 'I = V / R (Bulb glows if R_sample is very low; remains off if R_sample is high)',
    standardValue: 1.0,
    standardUnit: 'Circuit Closed',
    equipments: [
      { name: '1.5V Electric Cell (Dry Battery)', spec: 'Standard AA 1.5V alkaline cell', icon: '🔋', purpose: 'Source of electrical energy.' },
      { name: 'Miniature Torch Bulb & Holder', spec: '2.5V 0.3A incandescent bulb', icon: '💡', purpose: 'Visual indicator of current flow.' },
      { name: 'Single Pole Knife Switch', spec: 'Manual brass contacts', icon: '🔌', purpose: 'Opens and closes circuit loop.' },
      { name: 'Test Leads with Crocodile Clips', spec: 'Red and black flexible leads with clips', icon: '📎', purpose: 'Clamps test samples between circuit gap.' },
      { name: 'Assorted Test Samples', spec: 'Copper key, Plastic ruler, Iron nail, Wooden splint, Graphite pencil, Rubber eraser', icon: '🧲', purpose: 'Materials for conductivity evaluation.' }
    ],
    procedureSteps: [
      'Connect the battery, knife switch, torch bulb holder, and two free test leads in series.',
      'Touch the two crocodile clips directly together. Confirm the bulb glows brightly (circuit continuity test).',
      'Open the tester leads to create an air gap. Notice the bulb goes dark (air is an insulator).',
      'Insert test sample 1 (e.g. Copper wire / key) between the clips and close switch.',
      'Observe whether the bulb glows, glows dim, or remains unlit.',
      'Repeat with each sample: Plastic ruler, Iron nail, Graphite pencil lead, Rubber eraser, and Glass rod.',
      'Classify materials in the observation table as Electrical Conductors or Insulators.'
    ],
    simType: 'electric-circuit',
    vivaQuestions: [
      {
        q: "What is an electric circuit?",
        a: "A closed continuous conducting loop along which an electric current flows from the positive terminal to negative terminal of a power source."
      },
      {
        q: "Why is pencil lead (graphite) a conductor even though carbon is a non-metal?",
        a: "Graphite has layered hexagonal lattice structure with free delocalized valence electrons that can drift under an electric field."
      },
      {
        q: "Why are electrical wires coated with plastic or PVC?",
        a: "Plastic is an electrical insulator that prevents electric shocks and short circuits by containing the current inside the copper core."
      }
    ]
  },

  // ================= CLASS 10 CHEMISTRY: pH DETERMINATION =================
  {
    id: 'exp-ph-testing',
    title: 'Determination of pH of Given Solutions Using pH Paper & Universal Indicator',
    classNum: 10,
    classLabel: 'Class 10',
    subject: 'Chemistry',
    category: 'Acids, Bases & Salts',
    syllabusCode: 'CBSE Class 10 Exp-3 (Chemistry)',
    difficulty: 'Easy',
    icon: '🌈',
    aim: 'To find the pH of dilute HCl, dilute NaOH, ethanoic acid, lemon juice, pure water, and sodium bicarbonate solution using pH paper and universal indicator scale.',
    theory: 'pH is a logarithmic measure of hydronium ion concentration: pH = -log10[H3O+]. A pH of 7 indicates a neutral solution at 25°C. Solutions with pH < 7 are acidic (red/orange/yellow), while solutions with pH > 7 are basic/alkaline (blue/indigo/violet). Universal indicator exhibits distinct color shades across the full 1 to 14 scale.',
    formula: 'pH = -log[H+]  (pH 0-6: Acidic, pH 7: Neutral, pH 8-14: Basic)',
    standardValue: 7.0,
    standardUnit: 'pH scale',
    equipments: [
      { name: 'Ceramic Spotting Tile / Well Plate', spec: '6-cavity porcelain glazed plate', icon: '🥼', purpose: 'Holds drops of test solutions cleanly.' },
      { name: 'Broad-Range pH Paper Strips', spec: 'Range pH 1 to 14 with standard color chart', icon: '📑', purpose: 'Colorimetric test strips.' },
      { name: 'Fine Glass Droppers (6 Nos)', spec: 'Calibrated clean glass droppers', icon: '🧪', purpose: 'Transfers droplets without cross-contamination.' },
      { name: 'Universal Indicator Solution', spec: 'Standard mixed indicator solution', icon: '🎨', purpose: 'Produces vibrant color transitions in liquid.' },
      { name: 'Test Solutions Set', spec: 'Dilute HCl (0.1M), Dilute NaOH (0.1M), CH3COOH, Lemon Juice, Distilled Water, NaHCO3', icon: '🧴', purpose: 'Standard sample solutions.' }
    ],
    procedureSteps: [
      'Place 6 clean, dry strips of pH paper on a clean glazed tile.',
      'Label each spot corresponding to the 6 test solutions.',
      'Using a clean dropper, take a drop of dilute HCl and touch it gently to strip 1. Observe instantaneous color change.',
      'Compare the developed color with the standard pH reference color chart.',
      'Rinse dropper or use fresh clean droppers for each remaining solution: NaOH, ethanoic acid, lemon juice, distilled water, and sodium bicarbonate.',
      'Record observed color, corresponding pH value, and infer acidic/basic/neutral nature in the observation table.'
    ],
    simType: 'reactions',
    subType: 'ph-litmus',
    vivaQuestions: [
      {
        q: "What does pH stand for and what does it measure?",
        a: "pH stands for 'potenz' (German for power) of hydrogen. It quantitatively measures the molar concentration of hydrogen ions [H+] in aqueous solution."
      },
      {
        q: "Why does pH of pure water equal 7 at 25°C?",
        a: "Water self-ionizes: Kw = [H+][OH-] = 1.0 × 10^-14 at 25°C. For neutral water, [H+] = [OH-] = 10^-7 M, giving pH = -log(10^-7) = 7."
      },
      {
        q: "What color does pH paper turn with strong acid vs strong base?",
        a: "Strong acid (pH 1-2) turns red. Strong base (pH 13-14) turns deep violet or dark purple."
      }
    ]
  },

  // ================= CLASS 7/8 SCIENCE: DISPLACEMENT REACTION (Fe + CuSO4) =================
  {
    id: 'exp-displacement-iron-copper',
    title: 'Displacement Reaction: Iron Nails in Copper Sulphate Solution',
    classNum: 8,
    classLabel: 'Class 8 & 10',
    subject: 'Chemistry',
    category: 'Chemical Reactions',
    syllabusCode: 'CBSE Class 10 Exp-4 / Class 8 (Science)',
    difficulty: 'Easy',
    icon: '🧲',
    aim: 'To observe the displacement reaction between iron nails and copper sulphate solution and infer the relative chemical reactivity of iron and copper.',
    theory: 'In the reactivity series, iron (Fe) is positioned higher than copper (Cu). When an iron nail is immersed in blue copper sulphate solution, iron atoms lose electrons to form ferrous ions (Fe²⁺), while copper ions (Cu²⁺) gain electrons and deposit as reddish-brown metallic copper on the nail. The blue color fades and turns pale green due to formation of iron(II) sulphate.',
    formula: 'Fe (s) + CuSO4 (aq) [Blue] → FeSO4 (aq) [Light Green] + Cu (s) ↓ [Reddish-Brown]',
    standardValue: 1.0,
    standardUnit: 'Reaction Completed',
    equipments: [
      { name: 'Test Tubes (2 Nos) & Stand', spec: 'Standard 18 × 150 mm test tubes', icon: '🧪', purpose: 'One test tube for reaction, one as reference control.' },
      { name: 'Clean Iron Nails (3 Nos)', spec: 'Unrusted iron nails cleaned with sandpaper', icon: '🔩', purpose: 'Iron reactant with fresh metal surface.' },
      { name: 'Copper Sulphate Crystals (CuSO4·5H2O)', spec: 'Blue vitriol analytical reagent', icon: '🔷', purpose: 'Dissolved in water to make 5% blue solution.' },
      { name: 'Sandpaper', spec: 'Fine emery sheet', icon: '📄', purpose: 'Polishes nails to remove grease, paint, and iron oxide rust.' },
      { name: 'Thread & Test Tube Clamp', spec: 'Cotton thread', icon: '🧵', purpose: 'Suspends iron nails gently inside the solution.' }
    ],
    procedureSteps: [
      'Take two clean test tubes marked A and B. Add 10 mL of blue copper sulphate solution to each.',
      'Take three iron nails and thoroughly rub them with sandpaper until shining metallic iron surface is exposed.',
      'Keep test tube A on the stand as an untreated color reference control.',
      'Tie two cleaned iron nails with thread and immerse them into test tube B for 15-20 minutes.',
      'Remove the nails and inspect their surface: observe the dense reddish-brown coating of metallic copper.',
      'Compare the liquid color of test tube B with test tube A: notice the blue color has transformed to light pale green.',
      'Record observations in the lab notebook.'
    ],
    simType: 'reactions',
    subType: 'displacement-iron-copper',
    vivaQuestions: [
      {
        q: "Why does the blue color of copper sulphate solution change to pale green?",
        a: "The blue color is due to hydrated Cu²⁺ ions. As Fe displaces Cu, Cu²⁺ ions precipitate out as copper metal, and green ferrous ions (Fe²⁺) enter the solution forming FeSO4."
      },
      {
        q: "Why must iron nails be cleaned with sandpaper before immersion?",
        a: "To remove the protective oxide film (rust Fe2O3·xH2O) and oil coatings from the nail surface, allowing direct contact between iron metal and copper ions."
      },
      {
        q: "Would copper displace iron from an iron sulphate solution?",
        a: "No, copper is less reactive than iron (lower reduction potential / lower in reactivity series), so no reaction occurs."
      }
    ]
  }
];

// Helper to filter experiments
export function getFilteredExperiments({ classNum, subject, searchQuery }) {
  return EXPERIMENTS.filter((exp) => {
    // Class filter
    if (classNum && classNum !== 'all' && exp.classNum !== parseInt(classNum, 10)) {
      return false;
    }
    // Subject filter
    if (subject && subject !== 'all' && exp.subject.toLowerCase() !== subject.toLowerCase()) {
      return false;
    }
    // Search query filter
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = exp.title.toLowerCase().includes(q);
      const matchAim = exp.aim.toLowerCase().includes(q);
      const matchCategory = exp.category.toLowerCase().includes(q);
      const matchSyllabus = exp.syllabusCode.toLowerCase().includes(q);
      const matchEquipments = exp.equipments.some((eq) => eq.name.toLowerCase().includes(q));
      if (!matchTitle && !matchAim && !matchCategory && !matchSyllabus && !matchEquipments) {
        return false;
      }
    }
    return true;
  });
}
