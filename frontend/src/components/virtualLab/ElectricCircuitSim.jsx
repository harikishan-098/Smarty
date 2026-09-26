import React, { useState } from 'react';

export default function ElectricCircuitSim({ onAnalyzeMistakes, isAnalyzing }) {
  const [switchClosed, setSwitchClosed] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [testedSamples, setTestedSamples] = useState({});

  const samples = [
    { id: 'copper', name: 'Copper Wire', isConductor: true, icon: '〰️', explanation: 'Metals possess sea of delocalized electrons that conduct electric charge.' },
    { id: 'iron', name: 'Iron Nail', isConductor: true, icon: '🔩', explanation: 'Metallic iron conducts electricity with low resistance.' },
    { id: 'graphite', name: 'Graphite Pencil Lead', isConductor: true, icon: '✏️', explanation: 'Carbon allotrope with free pi-electrons in layered hexagonal sheets.' },
    { id: 'plastic', name: 'Plastic Ruler', isConductor: false, icon: '📏', explanation: 'Polymer insulators hold electrons tightly in covalent bonds.' },
    { id: 'wood', name: 'Dry Wooden Stick', isConductor: false, icon: '🪵', explanation: 'Cellulose and lignin have high electrical resistivity.' },
    { id: 'rubber', name: 'Rubber Eraser', isConductor: false, icon: '🧼', explanation: 'Natural/synthetic elastomer blocks current flow.' },
    { id: 'glass', name: 'Glass Rod', isConductor: false, icon: '🧪', explanation: 'Silica glass has virtually no free charge carriers at room temperature.' }
  ];

  const currentSampleObj = samples.find((s) => s.id === selectedSample);
  const bulbLightsUp = switchClosed && currentSampleObj && currentSampleObj.isConductor;

  // Mistakes log
  const [mistakesLog, setMistakesLog] = useState({
    testedWithOpenSwitch: false,
    directShortCircuit: false
  });

  const handleSelectSample = (sampleId) => {
    setSelectedSample(sampleId);
    if (!switchClosed) {
      setMistakesLog((m) => ({ ...m, testedWithOpenSwitch: true }));
    }
  };

  const handleLogObservation = (userClassification) => {
    if (!selectedSample) {
      alert("Please select a material sample from the tray first!");
      return;
    }

    if (!switchClosed) {
      alert("⚠️ Note: The knife switch is currently OPEN. Close the switch to test current flow!");
      setMistakesLog((m) => ({ ...m, testedWithOpenSwitch: true }));
    }

    const actualIsConductor = currentSampleObj.isConductor;
    const isCorrect = userClassification === (actualIsConductor ? 'Conductor' : 'Insulator');

    setTestedSamples((prev) => ({
      ...prev,
      [selectedSample]: {
        name: currentSampleObj.name,
        userGuess: userClassification,
        actual: actualIsConductor ? 'Conductor' : 'Insulator',
        isCorrect: isCorrect,
        bulbGlow: actualIsConductor && switchClosed
      }
    }));
  };

  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];
    const testedCount = Object.keys(testedSamples).length;

    if (mistakesLog.testedWithOpenSwitch) {
      detectedMistakes.push({
        title: "Evaluated Conductivity While Knife Switch Was OPEN",
        category: "Circuit Protocol Error",
        description: "You attempted to test material conductivity while the knife switch was left open. An open switch creates a break in the circuit, preventing the bulb from lighting even for good conductors.",
        howToFix: "Always close the knife switch to establish a complete circuit path before observing bulb illumination."
      });
    }

    // Check classification correctness
    Object.values(testedSamples).forEach((item) => {
      if (!item.isCorrect) {
        detectedMistakes.push({
          title: `Incorrect Classification for ${item.name}`,
          category: "Scientific Classification Error",
          description: `You classified ${item.name} as ${item.userGuess}, whereas it is actually an electrical ${item.actual}.`,
          howToFix: `Review conductivity properties: ${item.actual === 'Conductor' ? 'Graphite and metals conduct' : 'Polymers and rubber insulate'}.`
        });
      }
    });

    if (testedCount < 4) {
      detectedMistakes.push({
        title: "Incomplete Material Sample Testing",
        category: "Data Inadequacy",
        description: `You tested only ${testedCount} out of 7 materials. Test both metallic and non-metallic conductors and insulators.`,
        howToFix: "Test all samples in the tray, especially unique non-metal conductors like graphite pencil lead."
      });
    } else {
      goodPractices.push(`Evaluated a rich set of ${testedCount} everyday materials for electrical conductivity.`);
    }

    let score = 100 - detectedMistakes.length * 18;
    score = Math.max(35, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: Object.values(testedSamples),
      calculatedValue: testedCount,
      theoreticalValue: 7,
      unit: 'samples classified',
      accuracyScore: score
    });
  };

  return (
    <div className="vlab-sim-container">
      {/* Top Toolbar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          <button
            className={`vlab-btn ${switchClosed ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
            onClick={() => setSwitchClosed(!switchClosed)}
          >
            {switchClosed ? '🟢 Knife Switch CLOSED (Circuit On)' : '🔴 Knife Switch OPEN (Circuit Off)'}
          </button>

          {selectedSample && (
            <div className="vlab-sample-classify-buttons">
              <span className="control-label">Classify {currentSampleObj.name}:</span>
              <button
                className="vlab-btn-mini vlab-btn-action"
                onClick={() => handleLogObservation('Conductor')}
              >
                ⚡ Conductor
              </button>
              <button
                className="vlab-btn-mini vlab-btn-secondary"
                onClick={() => handleLogObservation('Insulator')}
              >
                🚫 Insulator
              </button>
            </div>
          )}
        </div>

        <div className="vlab-sim-actions-group">
          <button className="vlab-btn vlab-btn-analyze" onClick={handlePerformAnalysis}>
            ✨ Analyze Experiment &amp; Check Mistakes
          </button>
        </div>
      </div>

      {/* Dual Workspace */}
      <div className="vlab-workspace-grid">
        {/* Left Bench: Circuit & Test Materials */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>💡 Electric Circuit Workbench</h4>
            <span className={`vlab-circuit-status ${bulbLightsUp ? 'status-live' : 'status-idle'}`}>
              {bulbLightsUp ? '💡 Torch Bulb Glowing!' : '⚪ Bulb Unlit'}
            </span>
          </div>

          {/* Circuit Canvas */}
          <div className="vlab-circuit-stage">
            <svg className="vlab-chem-svg" viewBox="0 0 340 240">
              {/* Wooden Board Base */}
              <rect x="15" y="15" width="310" height="210" fill="#1e293b" rx="8" stroke="#334155" strokeWidth="2" />

              {/* 1.5V Cell Battery */}
              <g>
                <rect x="40" y="80" width="70" height="35" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                <rect x="110" y="92" width="6" height="11" fill="#f59e0b" rx="1" />
                <text x="75" y="102" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">1.5V Cell</text>
                <text x="47" y="102" fill="#fca5a5" fontSize="12" fontWeight="bold">-</text>
                <text x="103" y="102" fill="#86efac" fontSize="12" fontWeight="bold">+</text>
              </g>

              {/* Knife Switch */}
              <g>
                <circle cx="200" cy="50" r="5" fill="#ca8a04" />
                <circle cx="260" cy="50" r="5" fill="#ca8a04" />
                <line
                  x1="200"
                  y1="50"
                  x2={switchClosed ? 260 : 250}
                  y2={switchClosed ? 50 : 25}
                  stroke="#eab308"
                  strokeWidth="3.5"
                />
                <text x="230" y="70" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                  {switchClosed ? 'Switch Closed' : 'Switch Open'}
                </text>
              </g>

              {/* Torch Bulb & Holder */}
              <g>
                {/* Glow aura */}
                {bulbLightsUp && (
                  <circle cx="240" cy="150" r="35" fill="rgba(250, 204, 21, 0.3)" filter="blur(4px)" />
                )}
                {/* Glass Bulb */}
                <circle
                  cx="240"
                  cy="150"
                  r="20"
                  fill={bulbLightsUp ? '#fef08a' : 'rgba(255,255,255,0.1)'}
                  stroke="#eab308"
                  strokeWidth="2"
                />
                {/* Filament */}
                <path d="M 235 155 L 240 142 L 245 155" fill="none" stroke={bulbLightsUp ? '#f97316' : '#94a3b8'} strokeWidth="1.5" />
                <rect x="232" y="170" width="16" height="12" fill="#64748b" rx="2" />
                <text x="240" y="196" fill="#cbd5e1" fontSize="9" textAnchor="middle">Mini Bulb</text>
              </g>

              {/* Tester Probes & Gap */}
              <g>
                {/* Crocodile Clip Left */}
                <rect x="70" y="160" width="25" height="12" fill="#ef4444" rx="2" />
                {/* Crocodile Clip Right */}
                <rect x="145" y="160" width="25" height="12" fill="#10b981" rx="2" />

                {/* Test Material Inserted in Gap */}
                {currentSampleObj ? (
                  <g>
                    <rect x="95" y="162" width="50" height="8" rx="2" fill="#f59e0b" stroke="#b45309" />
                    <text x="120" y="152" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {currentSampleObj.name}
                    </text>
                  </g>
                ) : (
                  <text x="120" y="152" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    [Empty Gap]
                  </text>
                )}
              </g>

              {/* Connecting Wires */}
              <path d="M 40 97 L 20 97 L 20 50 L 200 50" fill="none" stroke="#f87171" strokeWidth="2.5" />
              <path d="M 260 50 L 290 50 L 290 176 L 248 176" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              <path d="M 232 176 L 170 176 L 170 166" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              <path d="M 70 166 L 70 176 L 50 176 L 50 115" fill="none" stroke="#f87171" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Test Materials Tray */}
          <div className="vlab-materials-tray">
            <span className="tray-title">📦 Materials Tray (Click to place sample in circuit gap):</span>
            <div className="tray-buttons-grid">
              {samples.map((s) => (
                <button
                  key={s.id}
                  className={`tray-sample-btn ${selectedSample === s.id ? 'selected-sample' : ''}`}
                  onClick={() => handleSelectSample(s.id)}
                >
                  <span className="sample-icon">{s.icon}</span>
                  <span className="sample-name">{s.name}</span>
                  {testedSamples[s.id] && <span className="tested-tag">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Graph Sheet: Observation Log */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY RECORD SHEET</span>
              <h3>Conductors vs Insulators Classification</h3>
            </div>
          </div>

          <div className="vlab-obs-mini-table">
            <div className="table-caption">
              <span>📋 Electrical Conductivity Observation Log</span>
              <span>{Object.keys(testedSamples).length} / 7 Materials</span>
            </div>
            {Object.keys(testedSamples).length === 0 ? (
              <div className="vlab-empty-obs">
                Select a material from tray, close the knife switch, and click <strong>"Conductor"</strong> or <strong>"Insulator"</strong>.
              </div>
            ) : (
              <table className="vlab-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Bulb Glow</th>
                    <th>Your Inference</th>
                    <th>Actual Nature</th>
                    <th>Evaluation</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(testedSamples).map((t, idx) => (
                    <tr key={idx}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.bulbGlow ? '✨ Lit Bright' : '⚪ Unlit'}</td>
                      <td>{t.userGuess}</td>
                      <td>{t.actual}</td>
                      <td>
                        <span className={`status-pill ${t.isCorrect ? 'pill-good' : 'pill-bad'}`}>
                          {t.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
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
