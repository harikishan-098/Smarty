import React, { useState, useEffect, useRef } from 'react';

export default function TitrationSim({ onAnalyzeMistakes, isAnalyzing }) {
  // Apparatus states
  const [buretteVolume, setBuretteVolume] = useState(0.0); // 0 to 50 mL added
  const [flowMode, setFlowMode] = useState('off'); // 'off' | 'drop' | 'stream'
  const [acidAdded, setAcidAdded] = useState(false);
  const [swirling, setSwirling] = useState(false);
  const [meniscusChoice, setMeniscusChoice] = useState('upper'); // 'upper' | 'lower'
  const [brownPrecipitate, setBrownPrecipitate] = useState(false);

  // Endpoint is standard 10.0 mL
  const trueEndpoint = 10.0;

  // Observations recorded
  const [trials, setTrials] = useState([]);

  // Mistake tracker
  const [mistakesLog, setMistakesLog] = useState({
    overshot: false,
    omittedAcid: false,
    wrongMeniscus: false,
    neverSwirled: true,
    insufficientConcordance: false
  });

  const streamIntervalRef = useRef(null);

  // Titrant flow simulation
  useEffect(() => {
    if (flowMode === 'drop') {
      streamIntervalRef.current = setInterval(() => {
        setBuretteVolume((prev) => {
          const next = Number((prev + 0.05).toFixed(2));
          if (next >= 50.0) {
            setFlowMode('off');
            return 50.0;
          }
          return next;
        });
      }, 400);
    } else if (flowMode === 'stream') {
      streamIntervalRef.current = setInterval(() => {
        setBuretteVolume((prev) => {
          const next = Number((prev + 0.25).toFixed(2));
          if (next >= 50.0) {
            setFlowMode('off');
            return 50.0;
          }
          return next;
        });
      }, 200);
    } else {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    }
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [flowMode]);

  // Check brown precipitate if acid omitted
  useEffect(() => {
    if (!acidAdded && buretteVolume > 2.0) {
      setBrownPrecipitate(true);
      setMistakesLog((m) => ({ ...m, omittedAcid: true }));
    }
  }, [acidAdded, buretteVolume]);

  // Check overshooting
  useEffect(() => {
    if (buretteVolume > trueEndpoint + 0.4) {
      setMistakesLog((m) => ({ ...m, overshot: true }));
    }
  }, [buretteVolume]);

  const handleSwirl = () => {
    setSwirling(true);
    setMistakesLog((m) => ({ ...m, neverSwirled: false }));
    setTimeout(() => setSwirling(false), 900);
  };

  const handleAddAcid = () => {
    setAcidAdded(true);
  };

  const handleAddSingleDrop = () => {
    setBuretteVolume((prev) => Number((prev + 0.05).toFixed(2)));
  };

  const handleResetBurette = () => {
    setBuretteVolume(0.0);
    setFlowMode('off');
    setAcidAdded(false);
    setBrownPrecipitate(false);
  };

  const handleRecordTrial = () => {
    if (buretteVolume < 1.0) {
      alert("⚠️ You have barely added any titrant. Please titrate until you observe the color change endpoint!");
      return;
    }

    const recordedVol = meniscusChoice === 'lower' ? Number((buretteVolume - 0.2).toFixed(2)) : buretteVolume;

    const newTrial = {
      trial: trials.length + 1,
      volumeMohr: 10.0,
      initialReading: 0.0,
      finalReading: recordedVol,
      volumeKMnO4: recordedVol,
      endpointColor: getEndpointColorDescription(recordedVol)
    };

    setTrials([...trials, newTrial]);
  };

  function getEndpointColorDescription(vol) {
    if (brownPrecipitate) return 'Brown Turbid Precipitate (MnO2)';
    if (vol < 9.5) return 'Colorless (Incomplete)';
    if (vol >= 9.5 && vol <= 10.2) return 'Permanent Faint Pink (Perfect Endpoint)';
    return 'Dark Magenta / Over-titrated';
  }

  // Determine solution appearance in flask
  let flaskColor = 'rgba(230, 245, 255, 0.4)'; // colorless
  let flaskBorderColor = 'rgba(255, 255, 255, 0.2)';

  if (brownPrecipitate) {
    flaskColor = 'rgba(160, 82, 45, 0.85)'; // brown MnO2
  } else if (buretteVolume >= 9.8 && buretteVolume <= 10.3) {
    flaskColor = 'rgba(244, 114, 182, 0.55)'; // faint delicate pink
  } else if (buretteVolume > 10.3) {
    flaskColor = 'rgba(190, 24, 93, 0.85)'; // deep magenta / overtitrated
  } else if (buretteVolume > 8.0) {
    flaskColor = swirling ? 'rgba(240, 240, 255, 0.4)' : 'rgba(244, 114, 182, 0.25)'; // fleeting pink drops
  }

  // Mistakes analysis
  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];

    // Check 1: Acid omission
    if (!acidAdded || brownPrecipitate) {
      detectedMistakes.push({
        title: "Omission of Dilute Sulfuric Acid (H2SO4)",
        category: "Reagent Protocol Error",
        description: "You forgot to add one test tube of dilute H2SO4 to the conical flask before titrating. Without the acidic medium (H+), permanganate (MnO4-) reduces incompletely to brown hydrated manganese dioxide (MnO2) precipitate instead of colorless Mn2+.",
        howToFix: "Always add approximately 15-20 mL (one test tube full) of dilute H2SO4 to the Mohr’s salt solution before starting titration."
      });
    } else {
      goodPractices.push("Added dilute H2SO4 correctly to provide essential acidic medium.");
    }

    // Check 2: Meniscus choice
    if (meniscusChoice === 'lower') {
      detectedMistakes.push({
        title: "Incorrect Meniscus Reading for Dark Colored Titrant (Parallax Error)",
        category: "Observational Error",
        description: "You chose to read the LOWER meniscus for potassium permanganate (KMnO4). Because KMnO4 is an intensely colored and opaque purple liquid, its lower meniscus is obscure and impossible to view accurately without parallax.",
        howToFix: "CBSE Rule: Always read the UPPER meniscus for dark, colored solutions like KMnO4. Read lower meniscus only for clear, colorless liquids (like NaOH or oxalic acid)."
      });
    } else {
      goodPractices.push("Correctly read the UPPER meniscus for intensely colored KMnO4 solution.");
    }

    // Check 3: Over-titration
    const lastReading = trials.length > 0 ? trials[trials.length - 1].volumeKMnO4 : buretteVolume;
    if (lastReading > 10.4) {
      detectedMistakes.push({
        title: "Over-Titration (Endpoint Overshot)",
        category: "Precision Error",
        description: `You added ${lastReading.toFixed(2)} mL of KMnO4, which is beyond the stoichiometric equivalence point (10.0 mL). The solution turned deep magenta instead of permanent faint pink.`,
        howToFix: "As the expected volume approaches (~9.5 mL), slow down and add titrant DROP-BY-DROP while continuously swirling the conical flask until the faintest pink color persists for 30 seconds."
      });
    } else if (lastReading >= 9.8 && lastReading <= 10.2) {
      goodPractices.push(`Excellent endpoint precision! Obtained endpoint at ${lastReading.toFixed(2)} mL with permanent faint pink color.`);
    }

    // Check 4: Swirling
    if (mistakesLog.neverSwirled) {
      detectedMistakes.push({
        title: "Failure to Swirl the Reaction Mixture",
        category: "Technique Error",
        description: "The conical flask was not swirled during the addition of titrant, leading to localized concentration gradients and premature color misinterpretations.",
        howToFix: "Keep swirling the conical flask continuously with your right hand while operating the burette stopcock with your left hand."
      });
    } else {
      goodPractices.push("Swirled the reaction flask adequately for uniform reactant mixing.");
    }

    // Check 5: Concordant readings
    if (trials.length < 2) {
      detectedMistakes.push({
        title: "Single Trial Recorded (No Concordant Value)",
        category: "CBSE Reporting Error",
        description: `You recorded only ${trials.length} trial. CBSE practical evaluation requires at least 2 or 3 concordant readings (differing by no more than ± 0.1 mL) to establish the titre value.`,
        howToFix: "Perform at least two successive titrations and verify that your final burette readings agree within 0.1 mL."
      });
    } else {
      goodPractices.push(`Performed multiple trials (${trials.length}) to establish concordant volumetric readings.`);
    }

    let avgTitre = lastReading;
    if (trials.length > 0) {
      avgTitre = Number((trials.reduce((sum, t) => sum + t.volumeKMnO4, 0) / trials.length).toFixed(2));
    }

    let score = 95;
    score -= detectedMistakes.length * 16;
    if (trials.length < 2) score -= 10;
    score = Math.max(30, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: trials,
      calculatedValue: avgTitre,
      theoreticalValue: trueEndpoint,
      unit: 'mL',
      accuracyScore: score
    });
  };

  return (
    <div className="vlab-sim-container">
      {/* Top Toolbar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          <button
            className={`vlab-btn ${acidAdded ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
            onClick={handleAddAcid}
            disabled={acidAdded}
            title="Add dilute H2SO4 to conical flask"
          >
            {acidAdded ? '✅ Dil. H2SO4 Added' : '➕ Add 15 mL Dil. H2SO4 (Acid Medium)'}
          </button>

          <button
            className={`vlab-btn ${swirling ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
            onClick={handleSwirl}
            title="Swirl the conical flask to mix reagents"
          >
            🌪️ Swirl Conical Flask
          </button>

          {/* Meniscus Toggle */}
          <div className="vlab-meniscus-toggle">
            <span className="control-label">Burette Meniscus:</span>
            <button
              className={`vlab-chip-btn ${meniscusChoice === 'upper' ? 'active' : ''}`}
              onClick={() => setMeniscusChoice('upper')}
              title="CBSE standard for dark colored KMnO4 solution"
            >
              Upper Meniscus
            </button>
            <button
              className={`vlab-chip-btn ${meniscusChoice === 'lower' ? 'active' : ''}`}
              onClick={() => setMeniscusChoice('lower')}
              title="Standard for colorless liquids (incorrect for KMnO4)"
            >
              Lower Meniscus
            </button>
          </div>
        </div>

        <div className="vlab-sim-actions-group">
          <button
            className="vlab-btn vlab-btn-action"
            onClick={handleRecordTrial}
            title="Log this titration trial in observation table"
          >
            📍 Record Trial ({trials.length})
          </button>

          <button
            className="vlab-btn vlab-btn-clear"
            onClick={handleResetBurette}
            title="Reset burette and flask for a fresh trial"
          >
            🔄 Refill Burette (Reset)
          </button>

          <button
            className="vlab-btn vlab-btn-analyze"
            onClick={handlePerformAnalysis}
            title="Evaluate lab accuracy and detect mistakes"
          >
            ✨ Analyze Experiment &amp; Check Mistakes
          </button>
        </div>
      </div>

      {/* Main Dual Workspace: Titration Bench + Graph Sheet */}
      <div className="vlab-workspace-grid">
        
        {/* Left Bench: Interactive Titration Apparatus */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>🧪 Volumetric Titration Bench</h4>
            <span className="vlab-circuit-status status-live">
              Burette Volume: {buretteVolume.toFixed(2)} mL
            </span>
          </div>

          {/* Reagent Status Alert */}
          {brownPrecipitate && (
            <div className="vlab-alert-banner">
              ⚠️ <strong>Mistake: Brown MnO2 Precipitate Formed!</strong> You started titrating without adding dilute H2SO4. Permanganate reduced incompletely!
            </div>
          )}

          {/* Apparatus Centerpiece: Burette + Conical Flask */}
          <div className="vlab-titration-stage">
            
            {/* Burette Assembly */}
            <div className="vlab-burette-assembly">
              <div className="burette-top-cap">KMnO4 0.02M</div>
              
              {/* Burette Glass Column */}
              <div className="burette-glass">
                {/* Liquid Level Column */}
                <div
                  className="burette-liquid"
                  style={{
                    height: `${Math.max(0, 100 - (buretteVolume / 25) * 100)}%`
                  }}
                />

                {/* Graduations */}
                <div className="burette-markings">
                  {[0, 5, 10, 15, 20, 25].map((v) => (
                    <div key={v} className="burette-mark">
                      <span className="mark-line"></span>
                      <span className="mark-num">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stopcock Valve & Flow Controls */}
              <div className="burette-stopcock-unit">
                <div className="stopcock-visual">
                  <span className={`valve-handle ${flowMode !== 'off' ? 'valve-open' : ''}`}></span>
                </div>
                <div className="stopcock-buttons">
                  <button
                    className="vlab-btn-mini"
                    onClick={handleAddSingleDrop}
                    title="Dispense exactly 1 single drop (0.05 mL)"
                  >
                    💧 +1 Drop (0.05mL)
                  </button>
                  <button
                    className={`vlab-btn-mini ${flowMode === 'drop' ? 'active-flow' : ''}`}
                    onClick={() => setFlowMode(flowMode === 'drop' ? 'off' : 'drop')}
                  >
                    💧💧 Dropwise Flow
                  </button>
                  <button
                    className={`vlab-btn-mini ${flowMode === 'stream' ? 'active-flow' : ''}`}
                    onClick={() => setFlowMode(flowMode === 'stream' ? 'off' : 'stream')}
                  >
                    🌊 Stream Flow
                  </button>
                  <button
                    className="vlab-btn-mini stop-btn"
                    onClick={() => setFlowMode('off')}
                  >
                    🛑 Close Stopcock
                  </button>
                </div>
              </div>

              {/* Falling Drop Animation */}
              {flowMode !== 'off' && (
                <div className="burette-drip-container">
                  <div className="burette-droplet" />
                </div>
              )}
            </div>

            {/* Conical Flask on White Tile */}
            <div className="vlab-flask-tile-assembly">
              {/* Conical Flask Glass Body */}
              <div className={`vlab-conical-flask ${swirling ? 'flask-swirling' : ''}`}>
                <div className="flask-neck"></div>
                <div className="flask-body">
                  {/* Solution in Flask */}
                  <div
                    className="flask-liquid"
                    style={{
                      backgroundColor: flaskColor,
                      borderColor: flaskBorderColor,
                      height: `${Math.min(90, 45 + (buretteVolume / 20) * 45)}%`
                    }}
                  >
                    {/* Fleeting pink swirls */}
                    {buretteVolume > 7 && buretteVolume < 10.3 && (
                      <div className="liquid-swirl-eff"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* White Glazed Ceramic Tile */}
              <div className="vlab-white-tile">
                <span className="tile-label">White Ceramic Tile (Provides Contrast)</span>
              </div>
            </div>

          </div>

          {/* Meniscus Zoom In Window */}
          <div className="vlab-meniscus-zoom-box">
            <div className="zoom-header">
              <span>🔍 Meniscus Magnifier (Eye-Level View)</span>
              <span className="zoom-reading">
                Current Level: <strong>{buretteVolume.toFixed(2)} mL</strong>
              </span>
            </div>
            <div className="zoom-canvas">
              <div className="meniscus-curve-graphic">
                <div className={`meniscus-indicator ${meniscusChoice === 'upper' ? 'meniscus-upper-correct' : 'meniscus-lower-wrong'}`}>
                  <span className="meniscus-line"></span>
                  <span className="meniscus-tag">
                    {meniscusChoice === 'upper' ? '▲ Upper Meniscus (Correct for KMnO4)' : '▼ Lower Meniscus (Parallax Error!)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Graph Sheet: Titration Curve & Observation Record */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY GRAPH SHEET</span>
              <h3>Potentiometric / Volumetric Titration Curve</h3>
            </div>
            <div className="graph-legend">
              <span className="legend-dot plotted"></span> Equivalence Point (10.0 mL)
            </div>
          </div>

          {/* SVG Graph Sheet */}
          <div className="vlab-graph-canvas-container">
            <svg
              className="vlab-graph-svg"
              viewBox="0 0 460 260"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background Grid */}
              <rect x="0" y="0" width="460" height="260" fill="#0d1b16" />
              <rect x="0" y="0" width="460" height="260" fill="url(#majorGrid)" />

              {/* Axes */}
              <line x1="45" y1="20" x2="45" y2="225" stroke="#4ade80" strokeWidth="2" />
              <line x1="45" y1="225" x2="440" y2="225" stroke="#4ade80" strokeWidth="2" />

              {/* Y Axis (Absorbance / Fe2+ remaining) */}
              <text x="40" y="30" fill="#86efac" fontSize="9" textAnchor="end">1.0</text>
              <text x="40" y="125" fill="#86efac" fontSize="9" textAnchor="end">0.5</text>
              <text x="40" y="220" fill="#86efac" fontSize="9" textAnchor="end">0.0</text>
              <text x="-120" y="14" transform="rotate(-90)" fill="#4ade80" fontSize="10" textAnchor="middle">
                Fe²⁺ Fraction / EMF (V) →
              </text>

              {/* X Axis (Volume of KMnO4 in mL) */}
              {[0, 5, 10, 15, 20].map((v) => {
                const x = 45 + (v / 20) * (440 - 45);
                return (
                  <g key={v}>
                    <line x1={x} y1="225" x2={x} y2="230" stroke="#4ade80" strokeWidth="1.5" />
                    <text x={x} y="242" fill="#86efac" fontSize="10" textAnchor="middle">{v} mL</text>
                  </g>
                );
              })}
              <text x="240" y="255" fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">
                Volume of KMnO4 Added (mL) →
              </text>

              {/* Equivalence Vertical Guide Line at 10.0 mL */}
              <line
                x1={45 + (10 / 20) * (440 - 45)}
                y1="25"
                x2={45 + (10 / 20) * (440 - 45)}
                y2="225"
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={45 + (10 / 20) * (440 - 45) + 6}
                y="40"
                fill="#f472b6"
                fontSize="9"
                fontWeight="bold"
              >
                Equivalence Point (10.0 mL)
              </text>

              {/* Sigmoidal / Redox Titration Curve */}
              <path
                d={`M 45 200 
                    C 150 195, 200 185, 230 150 
                    C 242 125, 243 55, 260 45 
                    C 320 40, 390 38, 440 38`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Current Titrant Marker */}
              {buretteVolume > 0 && (
                <circle
                  cx={Math.min(440, 45 + (buretteVolume / 20) * (440 - 45))}
                  cy={buretteVolume < 9.5 ? 190 : buretteVolume <= 10.5 ? 120 : 42}
                  r="6"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* Observation Table */}
          <div className="vlab-obs-mini-table">
            <div className="table-caption">
              <span>📋 Volumetric Observation Table (CBSE Format)</span>
              <span>{trials.length} Trials Logged</span>
            </div>
            {trials.length === 0 ? (
              <div className="vlab-empty-obs">
                Titrate to endpoint and click <strong>"Record Trial"</strong> to log concordant values.
              </div>
            ) : (
              <table className="vlab-table">
                <thead>
                  <tr>
                    <th>Trial #</th>
                    <th>Mohr's Salt (mL)</th>
                    <th>Initial (mL)</th>
                    <th>Final (mL)</th>
                    <th>KMnO4 (mL)</th>
                    <th>Resulting Color</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map((t) => (
                    <tr key={t.trial}>
                      <td>#{t.trial}</td>
                      <td>{t.volumeMohr.toFixed(1)}</td>
                      <td>{t.initialReading.toFixed(1)}</td>
                      <td>{t.finalReading.toFixed(2)}</td>
                      <td><strong>{t.volumeKMnO4.toFixed(2)}</strong></td>
                      <td>
                        <span className={`status-pill ${t.volumeKMnO4 >= 9.8 && t.volumeKMnO4 <= 10.2 ? 'pill-good' : 'pill-bad'}`}>
                          {t.endpointColor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
