import React, { useState } from 'react';

export default function ArchimedesSim({ onAnalyzeMistakes, isAnalyzing }) {
  const [immersionPercent, setImmersionPercent] = useState(0); // 0 to 100%
  const [waterPrimed, setWaterPrimed] = useState(true);
  const [touchingBottom, setTouchingBottom] = useState(false);
  const [readings, setReadings] = useState([]);

  // Solid cylinder parameters
  const weightInAir = 150.0; // g-wt
  const totalVolume = 40.0; // cm^3 (mL)
  const waterDensity = 1.0; // g/cm^3

  // Calculated values
  const currentDisplacedVol = Number(((immersionPercent / 100) * totalVolume).toFixed(1));
  const upthrust = currentDisplacedVol * waterDensity;
  // If touching bottom, balance reading artificially drops to near zero (normal reaction from bottom!)
  const apparentWeight = touchingBottom
    ? 15.0
    : Number((weightInAir - upthrust).toFixed(1));
  const weightLoss = Number((weightInAir - apparentWeight).toFixed(1));

  const [mistakesLog, setMistakesLog] = useState({
    touchedBottom: false,
    unprimedCan: false
  });

  const handleRecordReading = () => {
    if (touchingBottom) {
      setMistakesLog((m) => ({ ...m, touchedBottom: true }));
    }

    const newReading = {
      trial: readings.length + 1,
      immersion: `${immersionPercent}%`,
      apparentWeight: apparentWeight,
      weightLoss: weightLoss,
      displacedVolume: currentDisplacedVol,
      displacedWeight: currentDisplacedVol * waterDensity
    };

    setReadings([...readings, newReading]);
  };

  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];

    if (mistakesLog.touchedBottom || touchingBottom) {
      detectedMistakes.push({
        title: "Solid Cylinder Touching the Bottom of the Vessel",
        category: "Apparatus Handling Error",
        description: "The solid body was lowered so far that it rested on the bottom of the can. The normal reaction force from the base artificially reduced the spring balance reading, rendering buoyant calculations invalid.",
        howToFix: "CBSE Rule: The solid must be freely suspended in water, completely immersed without touching the sides or base of the container."
      });
    } else {
      goodPractices.push("Freely suspended solid without any contact with the bottom or side walls.");
    }

    if (readings.length < 3) {
      detectedMistakes.push({
        title: "Insufficient Immersion Readings",
        category: "Data Inadequacy",
        description: `You recorded only ${readings.length} reading(s). Record at least 3 to 4 stages of immersion (e.g. 25%, 50%, 75%, 100%) to prove upthrust is directly proportional to displaced volume.`,
        howToFix: "Vary the immersion depth slider gradually and record observations at multiple immersion fractions."
      });
    } else {
      goodPractices.push(`Sampled ${readings.length} immersion levels verifying Archimedes' principle proportionality.`);
    }

    let avgLoss = weightLoss;
    let score = 95;
    score -= detectedMistakes.length * 20;
    if (readings.length < 3) score -= 15;
    score = Math.max(30, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: readings,
      calculatedValue: avgLoss,
      theoreticalValue: 40.0,
      unit: 'g-wt',
      accuracyScore: score
    });
  };

  return (
    <div className="vlab-sim-container">
      {/* Top Toolbar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          <label className="vlab-control-item">
            <span className="control-label">Immersion Depth: <strong>{immersionPercent}%</strong></span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={immersionPercent}
              onChange={(e) => {
                setImmersionPercent(Number(e.target.value));
                setTouchingBottom(Number(e.target.value) === 100);
              }}
              className="vlab-slider-mini"
            />
          </label>

          <button
            className={`vlab-btn ${touchingBottom ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
            onClick={() => setTouchingBottom(!touchingBottom)}
          >
            {touchingBottom ? '⚠️ Cylinder Resting on Bottom' : '✅ Cylinder Freely Suspended'}
          </button>
        </div>

        <div className="vlab-sim-actions-group">
          <button className="vlab-btn vlab-btn-action" onClick={handleRecordReading}>
            📍 Record Immersion ({readings.length})
          </button>
          <button className="vlab-btn vlab-btn-clear" onClick={() => setReadings([])}>
            🗑️ Clear Readings
          </button>
          <button className="vlab-btn vlab-btn-analyze" onClick={handlePerformAnalysis}>
            ✨ Analyze Experiment &amp; Check Mistakes
          </button>
        </div>
      </div>

      {/* Dual Workspace */}
      <div className="vlab-workspace-grid">
        {/* Left Bench: Eureka Can & Spring Balance */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>🌊 Fluid Mechanics Stage</h4>
            <span className="vlab-circuit-status status-live">
              Apparent Weight = {apparentWeight} g-wt
            </span>
          </div>

          <div className="vlab-archimedes-stage">
            <svg className="vlab-chem-svg" viewBox="0 0 340 280">
              {/* Stand */}
              <rect x="30" y="20" width="10" height="240" fill="#334155" />
              <rect x="15" y="250" width="80" height="12" fill="#1e293b" rx="2" />
              <rect x="30" y="30" width="120" height="8" fill="#475569" />

              {/* Spring Balance Housing */}
              <rect x="135" y="38" width="26" height="70" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="148" y="55" fill="#f8fafc" fontSize="8" textAnchor="middle">0-250g</text>
              <line x1="148" y1="60" x2="148" y2="95" stroke="#f43f5e" strokeWidth="2" />
              <text x="148" y="102" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                {apparentWeight}g
              </text>

              {/* Suspension Wire */}
              <line x1="148" y1="108" x2="148" y2={130 + (immersionPercent / 100) * 45} stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Overflow Can */}
              <g>
                <rect x="110" y="140" width="75" height="100" rx="4" fill="none" stroke="#94a3b8" strokeWidth="2" />
                {/* Spout */}
                <path d="M 185 155 L 225 180" stroke="#94a3b8" strokeWidth="3" fill="none" />
                {/* Water in Can */}
                <rect x="111" y="155" width="73" height="84" fill="rgba(56, 189, 248, 0.35)" />
              </g>

              {/* Solid Brass Cylinder */}
              {(() => {
                const cylY = 130 + (immersionPercent / 100) * 45;
                return (
                  <rect
                    x="136"
                    y={cylY}
                    width="24"
                    height="45"
                    rx="3"
                    fill="#eab308"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                  />
                );
              })()}

              {/* Collecting Measuring Cylinder */}
              <g>
                <rect x="220" y="180" width="35" height="75" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                {/* Displaced Water in Cylinder */}
                <rect
                  x="221"
                  y={254 - (currentDisplacedVol / 40) * 55}
                  width="33"
                  height={(currentDisplacedVol / 40) * 55}
                  fill="rgba(56, 189, 248, 0.55)"
                />
                <text x="238" y="270" fill="#93c5fd" fontSize="9" textAnchor="middle">
                  {currentDisplacedVol} mL
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Graph Sheet: Apparent Loss vs Displaced Water */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY GRAPH SHEET</span>
              <h3>Verification: Loss of Weight = Displaced Water</h3>
            </div>
            <div className="graph-legend">
              <span className="legend-dot plotted"></span> Recorded Observations
              <span className="legend-line fit"></span> Ideal 1:1 Line
            </div>
          </div>

          <div className="vlab-graph-canvas-container">
            <svg className="vlab-graph-svg" viewBox="0 0 460 260">
              <rect x="0" y="0" width="460" height="260" fill="#0d1b16" />
              <rect x="0" y="0" width="460" height="260" fill="url(#majorGrid)" />

              {/* Axes */}
              <line x1="45" y1="20" x2="45" y2="225" stroke="#4ade80" strokeWidth="2" />
              <line x1="45" y1="225" x2="440" y2="225" stroke="#4ade80" strokeWidth="2" />

              {/* Y Axis: Loss of Weight in Water (g-wt) */}
              {[0, 10, 20, 30, 40, 50].map((w) => {
                const y = 225 - (w / 50) * (225 - 20);
                return (
                  <g key={w}>
                    <line x1="40" y1={y} x2="45" y2={y} stroke="#4ade80" strokeWidth="1.5" />
                    <text x="38" y={y + 3} fill="#86efac" fontSize="9" textAnchor="end">{w}</text>
                  </g>
                );
              })}
              <text x="-120" y="14" transform="rotate(-90)" fill="#4ade80" fontSize="10" textAnchor="middle">
                Loss of Weight in Water (g-wt) →
              </text>

              {/* X Axis: Weight of Displaced Water (g-wt) */}
              {[0, 10, 20, 30, 40, 50].map((w) => {
                const x = 45 + (w / 50) * (440 - 45);
                return (
                  <g key={w}>
                    <line x1={x} y1="225" x2={x} y2="230" stroke="#4ade80" strokeWidth="1.5" />
                    <text x={x} y="242" fill="#86efac" fontSize="10" textAnchor="middle">{w}</text>
                  </g>
                );
              })}
              <text x="240" y="255" fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">
                Weight of Displaced Water (g-wt) →
              </text>

              {/* Ideal 1:1 Identity Line */}
              <line x1="45" y1="225" x2="440" y2="20" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />

              {/* Plotted Points */}
              {readings.map((r, idx) => {
                const cx = 45 + (r.displacedWeight / 50) * (440 - 45);
                const cy = 225 - (r.weightLoss / 50) * (225 - 20);
                return (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r="6" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r="2.5" fill="#f87171" />
                    <text x={cx + 6} y={cy - 4} fill="#fca5a5" fontSize="9" fontWeight="bold">
                      #{r.trial} ({r.weightLoss}g, {r.displacedWeight}g)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Table */}
          <div className="vlab-obs-mini-table">
            <div className="table-caption">
              <span>📋 Archimedes Principle Observation Table</span>
              <span>{readings.length} Recorded</span>
            </div>
            {readings.length === 0 ? (
              <div className="vlab-empty-obs">
                Adjust immersion slider and click <strong>"Record Immersion"</strong>.
              </div>
            ) : (
              <table className="vlab-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Immersion</th>
                    <th>Apparent Wt (g)</th>
                    <th>Wt Loss (g)</th>
                    <th>Displaced Vol (mL)</th>
                    <th>Displaced Wt (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r) => (
                    <tr key={r.trial}>
                      <td>#{r.trial}</td>
                      <td>{r.immersion}</td>
                      <td>{r.apparentWeight}</td>
                      <td><strong>{r.weightLoss}</strong></td>
                      <td>{r.displacedVolume}</td>
                      <td><strong>{r.displacedWeight}</strong></td>
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
