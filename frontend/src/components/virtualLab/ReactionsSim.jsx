import React, { useState } from 'react';

export default function ReactionsSim({ experiment, onAnalyzeMistakes, isAnalyzing }) {
  const subType = experiment.subType || 'zinc-hcl';

  // Subtype 1: Zinc + HCl
  const [zincAdded, setZincAdded] = useState(false);
  const [acidAdded, setAcidAdded] = useState(false);
  const [corkFitted, setCorkFitted] = useState(false);
  const [gasEvolving, setGasEvolving] = useState(false);
  const [matchstickBrought, setMatchstickBrought] = useState(false);
  const [popSoundTriggered, setPopSoundTriggered] = useState(false);

  // Subtype 2: Mass conservation
  const [ignitionTubeSuspended, setIgnitionTubeSuspended] = useState(true);
  const [corkSealed, setCorkSealed] = useState(true);
  const [tiltedMixed, setTiltedMixed] = useState(false);
  const initialMass = 125.40;
  // If cork not sealed when tilting, 0.3g vapor escapes!
  const finalMass = tiltedMixed ? (corkSealed ? 125.40 : 125.10) : 125.40;

  // Subtype 3: pH & Litmus testing
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [testedStrips, setTestedStrips] = useState({});

  // Subtype 4: Displacement Iron + CuSO4
  const [nailsCleaned, setNailsCleaned] = useState(false);
  const [nailsImmersed, setNailsImmersed] = useState(false);
  const [reactionProgress, setReactionProgress] = useState(0); // 0 to 100%

  // Common recorded observations
  const [recordedNotes, setRecordedNotes] = useState([]);

  // Zinc + HCl actions
  const handleAddZinc = () => setZincAdded(true);
  const handleAddAcid = () => {
    if (!zincAdded) {
      alert("⚠️ First add zinc granules into the boiling test tube!");
      return;
    }
    setAcidAdded(true);
    setGasEvolving(true);
  };
  const handleFitCork = () => setCorkFitted(true);
  const handleBringFlame = () => {
    if (!gasEvolving) {
      alert("⚠️ No gas has evolved yet. Add zinc granules and dilute HCl first.");
      return;
    }
    setMatchstickBrought(true);
    setPopSoundTriggered(true);
  };

  // pH testing solutions
  const solutions = [
    { id: 'hcl', name: 'Dilute HCl (0.1M)', pH: 1.0, color: '#ef4444', label: 'Strong Acid (Red)' },
    { id: 'naoh', name: 'Dilute NaOH (0.1M)', pH: 13.0, color: '#7c3aed', label: 'Strong Base (Violet)' },
    { id: 'acetic', name: 'Ethanoic Acid', pH: 3.5, color: '#f97316', label: 'Weak Acid (Orange)' },
    { id: 'lemon', name: 'Lemon Juice', pH: 2.2, color: '#ea580c', label: 'Organic Acid (Red-Orange)' },
    { id: 'water', name: 'Distilled Water', pH: 7.0, color: '#22c55e', label: 'Neutral (Green)' },
    { id: 'bicarb', name: 'Sodium Bicarbonate', pH: 8.5, color: '#06b6d4', label: 'Mild Base (Blue-Green)' }
  ];

  const handleTestStrip = (sol) => {
    setTestedStrips((prev) => ({
      ...prev,
      [sol.id]: {
        name: sol.name,
        color: sol.color,
        pH: sol.pH,
        label: sol.label
      }
    }));
  };

  // Analyze mistakes for Reactions
  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];
    let score = 95;
    let calcVal = 1.0;
    let theoVal = 1.0;
    let unit = 'Completed';

    if (subType === 'zinc-hcl') {
      if (!corkFitted && gasEvolving) {
        detectedMistakes.push({
          title: "Escaping Gas (Delivery Tube Cork Not Fitted)",
          category: "Safety & Apparatus Error",
          description: "You added acid to zinc without sealing the test tube with the delivery tube cork. Hydrogen gas escaped into the room instead of being channeled into the soap solution.",
          howToFix: "Always ensure the rubber cork with delivery tube is fitted tightly immediately upon adding acid."
        });
      } else {
        goodPractices.push("Fitted delivery tube tightly to channel evolved hydrogen gas.");
      }

      if (!popSoundTriggered) {
        detectedMistakes.push({
          title: "Incomplete Hydrogen Gas Identification",
          category: "Confirmatory Test Missing",
          description: "You did not perform the burning splinter test to confirm the presence of combustible hydrogen gas via the characteristic pop sound.",
          howToFix: "Bring a burning wooden splinter near the gas bubbles to confirm hydrogen's presence with a pop sound."
        });
      } else {
        goodPractices.push("Successfully performed the 'POP' sound test with burning splinter to confirm H2 gas.");
      }
    } else if (subType === 'mass-conservation') {
      calcVal = finalMass;
      theoVal = initialMass;
      unit = 'g';

      if (!corkSealed && tiltedMixed) {
        detectedMistakes.push({
          title: "Unsealed Open System (Cork Missing During Reaction)",
          category: "Systematic Mass Error",
          description: "The conical flask was mixed without sealing the cork. Escaping aerosol droplets caused a 0.30g mass discrepancy, violating closed system conditions.",
          howToFix: "CBSE Rule: The flask MUST be tightly stoppered with a rubber cork to maintain a strictly closed system."
        });
      } else {
        goodPractices.push("Maintained an airtight closed system ensuring zero mass loss across reaction.");
      }

      if (!tiltedMixed) {
        detectedMistakes.push({
          title: "Solutions Never Mixed",
          category: "Procedure Omission",
          description: "You weighed the apparatus but did not tilt the flask to initiate the precipitation reaction between BaCl2 and Na2SO4.",
          howToFix: "Gently tilt and swirl the flask so the inner ignition tube spills into the outer solution."
        });
      } else {
        goodPractices.push("Mixed barium chloride and sodium sulfate, forming insoluble white BaSO4 precipitate.");
      }
    } else if (subType === 'ph-litmus') {
      const testedCount = Object.keys(testedStrips).length;
      calcVal = testedCount;
      theoVal = 6;
      unit = 'samples tested';

      if (testedCount < 4) {
        detectedMistakes.push({
          title: "Incomplete Set of pH Tests (Fewer than 4 solutions)",
          category: "Data Inadequacy",
          description: `You only tested ${testedCount} solution(s). CBSE practical instructions require testing the full range of acids, bases, and neutral liquids.`,
          howToFix: "Test all 6 provided solutions with separate pH paper strips to study the complete pH color spectrum."
        });
      } else {
        goodPractices.push(`Thoroughly determined the pH of ${testedCount} different chemical solutions.`);
      }
    } else if (subType === 'displacement-iron-copper') {
      if (!nailsCleaned) {
        detectedMistakes.push({
          title: "Uncleaned Iron Nails (Oxide Rust Barrier)",
          category: "Surface Preparation Error",
          description: "You immersed the iron nails without rubbing them with sandpaper. The surface oxide and grease layers prevent iron from reacting with Cu2+ ions.",
          howToFix: "Always rub iron nails with sandpaper until the metallic luster appears before immersing in CuSO4."
        });
      } else {
        goodPractices.push("Polished iron nails thoroughly with sandpaper before immersion.");
      }

      if (!nailsImmersed) {
        detectedMistakes.push({
          title: "Nails Never Immersed in CuSO4",
          category: "Procedure Omission",
          description: "The nails were not dipped into the blue copper sulphate solution.",
          howToFix: "Suspend the cleaned nails in test tube B containing copper sulphate solution for 15 minutes."
        });
      } else {
        goodPractices.push("Observed displacement of copper onto iron nail and color change from blue to pale green FeSO4.");
      }
    }

    score -= detectedMistakes.length * 20;
    score = Math.max(35, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: recordedNotes,
      calculatedValue: calcVal,
      theoreticalValue: theoVal,
      unit: unit,
      accuracyScore: score
    });
  };

  return (
    <div className="vlab-sim-container">
      {/* Top Toolbar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          {subType === 'zinc-hcl' && (
            <>
              <button
                className={`vlab-btn ${zincAdded ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
                onClick={handleAddZinc}
                disabled={zincAdded}
              >
                {zincAdded ? '✅ Zinc Granules Added' : '🪙 Add Zinc Granules'}
              </button>
              <button
                className={`vlab-btn ${acidAdded ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
                onClick={handleAddAcid}
                disabled={acidAdded}
              >
                {acidAdded ? '✅ Dilute HCl Added' : '🧪 Add Dilute HCl'}
              </button>
              <button
                className={`vlab-btn ${corkFitted ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
                onClick={handleFitCork}
                disabled={corkFitted}
              >
                {corkFitted ? '✅ Cork & Delivery Tube Fitted' : '🔘 Fit Rubber Cork'}
              </button>
              <button
                className={`vlab-btn ${matchstickBrought ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
                onClick={handleBringFlame}
                disabled={popSoundTriggered}
              >
                🔥 Test Gas with Burning Splinter
              </button>
            </>
          )}

          {subType === 'mass-conservation' && (
            <>
              <button
                className={`vlab-btn ${corkSealed ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
                onClick={() => setCorkSealed(!corkSealed)}
              >
                {corkSealed ? '🔒 Flask Cork Sealed' : '⚠️ Cork Open (Unsealed!)'}
              </button>
              <button
                className={`vlab-btn ${tiltedMixed ? 'vlab-btn-active' : 'vlab-btn-action'}`}
                onClick={() => setTiltedMixed(true)}
                disabled={tiltedMixed}
              >
                {tiltedMixed ? '✅ Solutions Mixed (Reaction Done)' : '🔄 Tilt Flask to Mix BaCl2 & Na2SO4'}
              </button>
            </>
          )}

          {subType === 'displacement-iron-copper' && (
            <>
              <button
                className={`vlab-btn ${nailsCleaned ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
                onClick={() => setNailsCleaned(true)}
                disabled={nailsCleaned}
              >
                {nailsCleaned ? '✅ Nails Rubbed with Sandpaper' : '📄 Clean Nails with Sandpaper'}
              </button>
              <button
                className={`vlab-btn ${nailsImmersed ? 'vlab-btn-active' : 'vlab-btn-action'}`}
                onClick={() => {
                  setNailsImmersed(true);
                  setReactionProgress(100);
                }}
                disabled={nailsImmersed}
              >
                {nailsImmersed ? '✅ Nails Immersed (Reaction Completed)' : '🧲 Immerse Nails in CuSO4'}
              </button>
            </>
          )}
        </div>

        <div className="vlab-sim-actions-group">
          <button className="vlab-btn vlab-btn-analyze" onClick={handlePerformAnalysis}>
            ✨ Analyze Experiment &amp; Check Mistakes
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="vlab-workspace-grid">
        
        {/* Left Bench: Interactive Chemical Setup */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>🧪 Reaction Workbench</h4>
            <span className="vlab-circuit-status status-live">
              {experiment.syllabusCode}
            </span>
          </div>

          {/* Subtype 1: Zinc + HCl */}
          {subType === 'zinc-hcl' && (
            <div className="vlab-reaction-stage">
              <svg className="vlab-chem-svg" viewBox="0 0 340 260">
                {/* Stand */}
                <rect x="30" y="20" width="10" height="230" fill="#334155" />
                <rect x="15" y="240" width="80" height="12" fill="#1e293b" rx="2" />
                {/* Clamp */}
                <rect x="30" y="80" width="40" height="8" fill="#475569" />

                {/* Boiling Tube */}
                <rect x="65" y="45" width="30" height="150" rx="15" fill="none" stroke="#cbd5e1" strokeWidth="2" />

                {/* Liquid Level */}
                {acidAdded && (
                  <path
                    d="M 66 140 L 94 140 L 94 180 A 14 14 0 0 1 66 180 Z"
                    fill="rgba(56, 189, 248, 0.4)"
                  />
                )}

                {/* Zinc Granules */}
                {zincAdded && (
                  <g>
                    <circle cx="75" cy="184" r="4" fill="#94a3b8" />
                    <circle cx="83" cy="186" r="3.5" fill="#64748b" />
                    <circle cx="86" cy="180" r="4.5" fill="#94a3b8" />
                    <circle cx="78" cy="177" r="3" fill="#cbd5e1" />
                  </g>
                )}

                {/* Effervescence Bubbles */}
                {gasEvolving && (
                  <g>
                    <circle cx="78" cy="130" r="2.5" fill="#ffffff" opacity="0.8" />
                    <circle cx="85" cy="115" r="3" fill="#ffffff" opacity="0.8" />
                    <circle cx="74" cy="95" r="2" fill="#ffffff" opacity="0.8" />
                    <circle cx="82" cy="70" r="3.5" fill="#ffffff" opacity="0.8" />
                  </g>
                )}

                {/* Cork and Delivery Tube */}
                {corkFitted && (
                  <g>
                    <rect x="66" y="42" width="28" height="12" fill="#b45309" rx="2" />
                    {/* Glass Delivery Tube */}
                    <path
                      d="M 80 42 L 80 20 L 220 20 L 220 180"
                      fill="none"
                      stroke="#93c5fd"
                      strokeWidth="4"
                    />
                  </g>
                )}

                {/* Soap Trough */}
                <rect x="180" y="160" width="120" height="60" rx="6" fill="rgba(147, 197, 253, 0.25)" stroke="#60a5fa" strokeWidth="2" />
                <text x="240" y="210" fill="#93c5fd" fontSize="10" textAnchor="middle">Soap Solution</text>

                {/* Soap Bubbles */}
                {gasEvolving && (
                  <g>
                    <circle cx="215" cy="150" r="8" fill="rgba(255,255,255,0.4)" stroke="#60a5fa" />
                    <circle cx="230" cy="138" r="10" fill="rgba(255,255,255,0.4)" stroke="#60a5fa" />
                    <circle cx="245" cy="148" r="7" fill="rgba(255,255,255,0.4)" stroke="#60a5fa" />
                  </g>
                )}

                {/* Burning Splinter Pop Flash */}
                {popSoundTriggered && (
                  <g>
                    <polygon points="230,110 245,125 240,105 255,100 238,95 242,80 228,95" fill="#fbbf24" stroke="#f59e0b" />
                    <text x="240" y="75" fill="#fef08a" fontSize="14" fontWeight="bold" textAnchor="middle">💥 POP!!</text>
                  </g>
                )}
              </svg>
            </div>
          )}

          {/* Subtype 2: Mass Conservation */}
          {subType === 'mass-conservation' && (
            <div className="vlab-reaction-stage">
              <svg className="vlab-chem-svg" viewBox="0 0 340 260">
                {/* Digital Balance Platform */}
                <rect x="70" y="190" width="200" height="40" fill="#1e293b" rx="4" stroke="#475569" strokeWidth="2" />
                <rect x="120" y="200" width="100" height="22" fill="#020617" rx="3" />
                <text x="170" y="216" fill="#4ade80" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  {finalMass.toFixed(2)} g
                </text>

                {/* Conical Flask */}
                <polygon
                  points="130,70 210,70 240,185 100,185"
                  fill="rgba(255,255,255,0.06)"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />

                {/* Cork */}
                {corkSealed ? (
                  <rect x="135" y="60" width="70" height="14" fill="#b45309" rx="3" />
                ) : (
                  <text x="170" y="55" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">⚠️ Cork Unsealed</text>
                )}

                {/* Outer Solution: Sodium Sulfate Na2SO4 */}
                <polygon
                  points="110,185 230,185 220,150 120,150"
                  fill={tiltedMixed ? 'rgba(255,255,255,0.85)' : 'rgba(56, 189, 248, 0.25)'}
                />

                {/* Inner Ignition Tube with BaCl2 */}
                {!tiltedMixed && (
                  <g>
                    {/* Thread */}
                    <line x1="170" y1="70" x2="160" y2="105" stroke="#f8fafc" strokeWidth="1" />
                    {/* Tube */}
                    <rect x="155" y="105" width="16" height="45" rx="8" fill="rgba(255,255,255,0.2)" stroke="#e2e8f0" strokeWidth="1.5" />
                    <rect x="157" y="125" width="12" height="23" rx="5" fill="#38bdf8" />
                  </g>
                )}

                {/* Precipitate Text if Mixed */}
                {tiltedMixed && (
                  <text x="170" y="172" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">
                    White BaSO4 ↓ Precipitate
                  </text>
                )}
              </svg>
            </div>
          )}

          {/* Subtype 3: pH Testing */}
          {subType === 'ph-litmus' && (
            <div className="vlab-ph-testing-grid">
              <div className="vlab-ph-solutions-rack">
                <span className="rack-label">🧪 Click any chemical solution to test on pH paper:</span>
                <div className="solutions-buttons-grid">
                  {solutions.map((sol) => (
                    <button
                      key={sol.id}
                      className={`vlab-sol-btn ${testedStrips[sol.id] ? 'tested' : ''}`}
                      onClick={() => handleTestStrip(sol)}
                    >
                      <span className="sol-dot" style={{ backgroundColor: sol.color }}></span>
                      <span>{sol.name}</span>
                      {testedStrips[sol.id] && <span className="check-badge">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spotting Plate with Strips */}
              <div className="vlab-spotting-plate">
                <div className="plate-header">Spotting Tile pH Strips</div>
                <div className="strips-display-row">
                  {solutions.map((sol) => {
                    const test = testedStrips[sol.id];
                    return (
                      <div key={sol.id} className="ph-strip-card">
                        <div
                          className="ph-strip-paper"
                          style={{
                            backgroundColor: test ? test.color : '#fde047'
                          }}
                        >
                          <span className="strip-code">{sol.id.toUpperCase()}</span>
                        </div>
                        <span className="strip-label">{sol.name.split(' ')[0]}</span>
                        {test ? (
                          <span className="strip-ph">pH ~ {test.pH}</span>
                        ) : (
                          <span className="strip-untested">Untested</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Subtype 4: Displacement Iron in CuSO4 */}
          {subType === 'displacement-iron-copper' && (
            <div className="vlab-reaction-stage">
              <svg className="vlab-chem-svg" viewBox="0 0 340 260">
                {/* Test Tube A (Control) */}
                <g>
                  <rect x="70" y="40" width="35" height="160" rx="17" fill="none" stroke="#94a3b8" strokeWidth="2" />
                  <path d="M 71 110 L 104 110 L 104 185 A 16 16 0 0 1 71 185 Z" fill="rgba(37, 99, 235, 0.6)" />
                  <text x="87" y="225" fill="#93c5fd" fontSize="11" fontWeight="bold" textAnchor="middle">Tube A (Control)</text>
                  <text x="87" y="240" fill="#cbd5e1" fontSize="9" textAnchor="middle">Blue CuSO4</text>
                </g>

                {/* Test Tube B (Reaction with Iron Nails) */}
                <g>
                  <rect x="190" y="40" width="35" height="160" rx="17" fill="none" stroke="#94a3b8" strokeWidth="2" />
                  <path
                    d="M 191 110 L 224 110 L 224 185 A 16 16 0 0 1 191 185 Z"
                    fill={nailsImmersed ? 'rgba(34, 197, 94, 0.45)' : 'rgba(37, 99, 235, 0.6)'}
                  />

                  {/* Suspended Iron Nails */}
                  {nailsImmersed && (
                    <g>
                      <line x1="207" y1="40" x2="207" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      {/* Iron nail with reddish brown copper coating */}
                      <rect
                        x="203"
                        y="120"
                        width="8"
                        height="55"
                        fill={nailsCleaned ? '#b45309' : '#475569'}
                        rx="2"
                        stroke="#78350f"
                        strokeWidth="1"
                      />
                    </g>
                  )}

                  <text x="207" y="225" fill="#86efac" fontSize="11" fontWeight="bold" textAnchor="middle">Tube B (Reaction)</text>
                  <text x="207" y="240" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                    {nailsImmersed ? 'Pale Green FeSO4 + Cu' : 'Blue CuSO4'}
                  </text>
                </g>
              </svg>
            </div>
          )}

        </div>

        {/* Right Graph Sheet: Reaction Theory & Data Card */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY RECORD SHEET</span>
              <h3>Chemical Equations &amp; Observations</h3>
            </div>
          </div>

          <div className="vlab-chem-notes-card">
            <div className="chem-equation-box">
              <span className="eq-label">Balanced Chemical Equation:</span>
              <pre className="chem-formula-display">{experiment.formula}</pre>
            </div>

            <div className="chem-theory-box">
              <h4>🎯 Scientific Principle:</h4>
              <p>{experiment.theory}</p>
            </div>

            <div className="chem-steps-box">
              <h4>📋 Standard CBSE Practical Procedure:</h4>
              <ol className="vlab-steps-list">
                {experiment.procedureSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
