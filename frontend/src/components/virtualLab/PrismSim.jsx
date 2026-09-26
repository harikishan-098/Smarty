import React, { useState } from 'react';

export default function PrismSim({ onAnalyzeMistakes, isAnalyzing }) {
  const [incidentAngle, setIncidentAngle] = useState(48); // 30 to 65 deg
  const [pinDistanceCm, setPinDistanceCm] = useState(7); // 3 to 10 cm
  const [showProtractor, setShowProtractor] = useState(false);
  const [readings, setReadings] = useState([]);

  // Glass prism parameters
  const prismAngleA = 60; // Equilateral prism (degrees)
  const trueMu = 1.52; // Crown glass

  // Ray tracing calculations
  // Snell's Law: sin(i) = mu * sin(r1)
  const iRad = (incidentAngle * Math.PI) / 180;
  const sinR1 = Math.sin(iRad) / trueMu;
  const r1Rad = Math.asin(sinR1);
  const r1Deg = (r1Rad * 180) / Math.PI;

  // At second surface: r1 + r2 = A => r2 = A - r1
  const r2Deg = prismAngleA - r1Deg;
  const r2Rad = (r2Deg * Math.PI) / 180;

  // Snell's Law at exit: mu * sin(r2) = sin(e)
  const sinE = trueMu * Math.sin(r2Rad);
  const totalInternalReflection = sinE > 1.0;

  let eDeg = 0;
  let deviationDelta = 0;

  if (!totalInternalReflection) {
    const eRad = Math.asin(sinE);
    eDeg = Number(((eRad * 180) / Math.PI).toFixed(1));
    // Deviation delta = i + e - A
    deviationDelta = Number((incidentAngle + eDeg - prismAngleA).toFixed(1));
  }

  // Mistakes log
  const [mistakesLog, setMistakesLog] = useState({
    closePins: false,
    tirEncountered: false
  });

  const handleRecordReading = () => {
    if (totalInternalReflection) {
      alert("⚠️ Total Internal Reflection! At this steep angle, the light ray cannot emerge from face AC. Choose an incident angle >= 32°.");
      setMistakesLog((m) => ({ ...m, tirEncountered: true }));
      return;
    }

    if (pinDistanceCm < 5) {
      setMistakesLog((m) => ({ ...m, closePins: true }));
    }

    const alreadyExists = readings.some((r) => r.angleI === incidentAngle);
    if (alreadyExists) {
      alert(`You already recorded an observation for angle of incidence i = ${incidentAngle}°. Try a different angle!`);
      return;
    }

    // Calculated mu using formula mu = sin((A + delta)/2) / sin(A/2)
    const radNumerator = (((prismAngleA + deviationDelta) / 2) * Math.PI) / 180;
    const radDenominator = ((prismAngleA / 2) * Math.PI) / 180;
    const calcMu = Number((Math.sin(radNumerator) / Math.sin(radDenominator)).toFixed(2));

    const newReading = {
      trial: readings.length + 1,
      angleI: incidentAngle,
      angleE: eDeg,
      deviation: deviationDelta,
      calculatedMu: calcMu
    };

    setReadings([...readings, newReading].sort((a, b) => a.angleI - b.angleI));
  };

  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];

    // Check 1: Pin separation
    if (mistakesLog.closePins || pinDistanceCm < 5) {
      detectedMistakes.push({
        title: "Optical Pins Fixed Too Close (< 5 cm apart)",
        category: "Parallax & Alignment Error",
        description: `Pins P1 and P2 were placed only ${pinDistanceCm} cm apart. When pins are too close, small angular alignment shifts cause large errors in projected rays.`,
        howToFix: "CBSE Rule: Keep the distance between optical pins P1 and P2 (and P3 and P4) at least 6 to 8 cm apart."
      });
    } else {
      goodPractices.push("Adequate optical pin separation maintained (≥ 6 cm) to minimize collinear parallax.");
    }

    // Check 2: Total internal reflection
    if (mistakesLog.tirEncountered) {
      detectedMistakes.push({
        title: "Selected Incident Angle Below Critical Limit (TIR)",
        category: "Theoretical Protocol Error",
        description: "Attempted observations at angles where light suffers total internal reflection at the second face.",
        howToFix: "Always operate within the prescribed CBSE range of 35° to 60° for an equilateral crown glass prism."
      });
    }

    // Check 3: Insufficient readings
    if (readings.length < 5) {
      detectedMistakes.push({
        title: "Fewer than 5 Observations to Form the U-Curve",
        category: "Data Inadequacy",
        description: `You plotted only ${readings.length} reading(s). To clearly identify the vertex representing the Angle of Minimum Deviation (Dm), at least 5 to 6 points are essential.`,
        howToFix: "Take observations for i = 35°, 40°, 45°, 50°, 55°, and 60°."
      });
    } else {
      goodPractices.push(`Plotted ${readings.length} points across both branches of the i - δ U-curve.`);
    }

    // Find minimum deviation among recorded readings
    let minDeviationObs = deviationDelta;
    let computedMu = trueMu;
    if (readings.length > 0) {
      const minObs = readings.reduce((prev, curr) => (curr.deviation < prev.deviation ? curr : prev));
      minDeviationObs = minObs.deviation;
      computedMu = minObs.calculatedMu;
    }

    let score = 95;
    score -= detectedMistakes.length * 18;
    if (readings.length < 4) score -= 15;
    score = Math.max(30, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: readings,
      calculatedValue: computedMu,
      theoreticalValue: trueMu,
      unit: 'μ',
      accuracyScore: score
    });
  };

  return (
    <div className="vlab-sim-container">
      {/* Top Toolbar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          {/* Angle Slider */}
          <label className="vlab-control-item">
            <span className="control-label">Angle of Incidence (i): <strong>{incidentAngle}°</strong></span>
            <input
              type="range"
              min="30"
              max="65"
              step="1"
              value={incidentAngle}
              onChange={(e) => setIncidentAngle(Number(e.target.value))}
              className="vlab-slider-mini"
            />
          </label>

          {/* Pin Distance Slider */}
          <label className="vlab-control-item">
            <span className="control-label">
              Pin Distance: <strong className={pinDistanceCm < 5 ? 'text-danger' : ''}>{pinDistanceCm} cm</strong>
            </span>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={pinDistanceCm}
              onChange={(e) => setPinDistanceCm(Number(e.target.value))}
              className="vlab-slider-mini"
            />
          </label>

          <button
            className={`vlab-btn ${showProtractor ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
            onClick={() => setShowProtractor(!showProtractor)}
          >
            {showProtractor ? '📐 Hide Protractor' : '📐 Show Protractor'}
          </button>
        </div>

        <div className="vlab-sim-actions-group">
          <button className="vlab-btn vlab-btn-action" onClick={handleRecordReading}>
            📍 Record Point ({readings.length})
          </button>
          <button className="vlab-btn vlab-btn-clear" onClick={() => setReadings([])}>
            🗑️ Clear Graph
          </button>
          <button className="vlab-btn vlab-btn-analyze" onClick={handlePerformAnalysis}>
            ✨ Analyze Experiment &amp; Check Mistakes
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="vlab-workspace-grid">
        
        {/* Left Bench: Optical Ray Tracing on Prism */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>🔺 Optical Ray Tracing Bench</h4>
            <span className="vlab-circuit-status status-live">
              {totalInternalReflection ? '⚠️ Total Internal Reflection' : `Deviation δ = ${deviationDelta}°`}
            </span>
          </div>

          {pinDistanceCm < 5 && (
            <div className="vlab-alert-banner">
              ⚠️ <strong>Warning: Pins {pinDistanceCm} cm apart!</strong> Pins should be at least 6 cm apart to prevent parallax error.
            </div>
          )}

          {/* Ray Tracing SVG Stage */}
          <div className="vlab-prism-stage">
            <svg className="vlab-prism-svg" viewBox="0 0 360 280">
              {/* Drawing Board Base */}
              <rect x="10" y="10" width="340" height="260" fill="#1e293b" rx="6" />

              {/* Equilateral Prism Boundary ABC */}
              {/* Vertex A at top (180, 50), B at (80, 220), C at (280, 220) */}
              <polygon
                points="180,50 80,220 280,220"
                fill="rgba(56, 189, 248, 0.15)"
                stroke="#38bdf8"
                strokeWidth="2"
              />

              {/* Vertices Labels */}
              <text x="180" y="42" fill="#bae6fd" fontSize="12" fontWeight="bold" textAnchor="middle">A (60°)</text>
              <text x="70" y="235" fill="#bae6fd" fontSize="12" fontWeight="bold">B</text>
              <text x="285" y="235" fill="#bae6fd" fontSize="12" fontWeight="bold">C</text>

              {/* Point of Incidence on face AB: mid point roughly (130, 135) */}
              {/* Normal at AB: Face AB has slope = (220-50)/(80-180) = 170/-100 = -1.7 (angle approx 120°). Normal angle approx 30° */}
              <line x1="90" y1="112" x2="170" y2="158" stroke="rgba(255,255,255,0.4)" strokeDasharray="3 3" strokeWidth="1" />

              {/* Incident Ray */}
              {(() => {
                const incX = 130;
                const incY = 135;
                const rayLen = 90;
                // Incident ray angle relative to normal
                const rayAngleRad = ((150 - incidentAngle) * Math.PI) / 180;
                const startX = incX - rayLen * Math.cos(rayAngleRad);
                const startY = incY + rayLen * Math.sin(rayAngleRad);

                // Pin 1 and Pin 2 positions
                const pin1Dist = 30;
                const pin2Dist = 30 + pinDistanceCm * 6;
                const p1X = incX - pin1Dist * Math.cos(rayAngleRad);
                const p1Y = incY + pin1Dist * Math.sin(rayAngleRad);
                const p2X = incX - pin2Dist * Math.cos(rayAngleRad);
                const p2Y = incY + pin2Dist * Math.sin(rayAngleRad);

                // Emergent exit point on face AC roughly (230, 135)
                const exitX = 230;
                const exitY = 135;

                return (
                  <g>
                    {/* Incident Ray Line */}
                    <line x1={startX} y1={startY} x2={incX} y2={incY} stroke="#f59e0b" strokeWidth="2.5" />
                    {/* Incident Ray Extension (dotted) */}
                    <line x1={incX} y1={incY} x2={incX + 110 * Math.cos(rayAngleRad)} y2={incY - 110 * Math.sin(rayAngleRad)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Optical Pins P1 and P2 */}
                    <circle cx={p1X} cy={p1Y} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={p1X - 10} y={p1Y - 6} fill="#fca5a5" fontSize="9" fontWeight="bold">P1</text>

                    <circle cx={p2X} cy={p2Y} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={p2X - 10} y={p2Y - 6} fill="#fca5a5" fontSize="9" fontWeight="bold">P2</text>

                    {/* Refracted Ray inside prism */}
                    <line x1={incX} y1={incY} x2={exitX} y2={exitY} stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Emergent Ray */}
                    {!totalInternalReflection && (
                      <g>
                        <line x1={exitX} y1={exitY} x2={exitX + 80} y2={exitY + 60} stroke="#10b981" strokeWidth="2.5" />
                        {/* Emergent Ray Backward Extension (dotted) */}
                        <line x1={exitX} y1={exitY} x2={exitX - 60} y2={exitY - 45} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />

                        {/* Pins P3 and P4 */}
                        <circle cx={exitX + 30} cy={exitY + 22} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={exitX + 35} y={exitY + 22} fill="#a7f3d0" fontSize="9" fontWeight="bold">P3</text>

                        <circle cx={exitX + 65} cy={exitY + 48} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={exitX + 70} y={exitY + 48} fill="#a7f3d0" fontSize="9" fontWeight="bold">P4</text>
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* Optional Protractor Overlay */}
              {showProtractor && (
                <g opacity="0.65">
                  <circle cx="130" cy="135" r="55" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="130" y="85" fill="#fde047" fontSize="10" textAnchor="middle">Protractor 0°-180°</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Graph Sheet: i vs δ U-Curve */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY GRAPH SHEET</span>
              <h3>Angle of Incidence (i) vs Deviation (δ) Curve</h3>
            </div>
            <div className="graph-legend">
              <span className="legend-dot plotted"></span> Plotted Observations
              <span className="legend-line fit"></span> Parabolic U-Curve
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="vlab-graph-canvas-container">
            <svg className="vlab-graph-svg" viewBox="0 0 460 260">
              <rect x="0" y="0" width="460" height="260" fill="#0d1b16" />
              <rect x="0" y="0" width="460" height="260" fill="url(#majorGrid)" />

              {/* Axes */}
              <line x1="45" y1="20" x2="45" y2="225" stroke="#4ade80" strokeWidth="2" />
              <line x1="45" y1="225" x2="440" y2="225" stroke="#4ade80" strokeWidth="2" />

              {/* Y Axis (Deviation δ from 30° to 60°) */}
              {[30, 35, 40, 45, 50, 55, 60].map((d) => {
                const y = 225 - ((d - 30) / 30) * (225 - 20);
                return (
                  <g key={d}>
                    <line x1="40" y1={y} x2="45" y2={y} stroke="#4ade80" strokeWidth="1.5" />
                    <text x="38" y={y + 3} fill="#86efac" fontSize="9" textAnchor="end">{d}°</text>
                  </g>
                );
              })}
              <text x="-120" y="14" transform="rotate(-90)" fill="#4ade80" fontSize="10" textAnchor="middle">
                Angle of Deviation δ (degrees) →
              </text>

              {/* X Axis (Incidence i from 30° to 65°) */}
              {[30, 35, 40, 45, 50, 55, 60, 65].map((i) => {
                const x = 45 + ((i - 30) / 35) * (440 - 45);
                return (
                  <g key={i}>
                    <line x1={x} y1="225" x2={x} y2="230" stroke="#4ade80" strokeWidth="1.5" />
                    <text x={x} y="242" fill="#86efac" fontSize="10" textAnchor="middle">{i}°</text>
                  </g>
                );
              })}
              <text x="240" y="255" fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">
                Angle of Incidence i (degrees) →
              </text>

              {/* Characteristic U-curve for equilateral crown glass prism */}
              {/* Minimum deviation near i = 48°, delta = 38° */}
              <path
                d="M 45 60 C 130 180, 220 170, 248 170 C 310 170, 380 140, 440 95"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Minimum Deviation Marker */}
              <line
                x1={45 + ((48 - 30) / 35) * (440 - 45)}
                y1="25"
                x2={45 + ((48 - 30) / 35) * (440 - 45)}
                y2="225"
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={45 + ((48 - 30) / 35) * (440 - 45) + 5}
                y="35"
                fill="#f472b6"
                fontSize="9"
                fontWeight="bold"
              >
                Dm ≈ 38.0° (Minimum Deviation)
              </text>

              {/* Plotted Points */}
              {readings.map((r, idx) => {
                const cx = 45 + ((r.angleI - 30) / 35) * (440 - 45);
                const cy = 225 - ((r.deviation - 30) / 30) * (225 - 20);
                return (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r="6" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r="2.5" fill="#f87171" />
                    <text x={cx + 6} y={cy - 4} fill="#fca5a5" fontSize="9" fontWeight="bold">
                      #{r.trial} ({r.angleI}°, {r.deviation}°)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Table */}
          <div className="vlab-obs-mini-table">
            <div className="table-caption">
              <span>📋 Angle of Deviation Observations</span>
              <span>{readings.length} Recorded</span>
            </div>
            {readings.length === 0 ? (
              <div className="vlab-empty-obs">
                Adjust angle slider and click <strong>"Record Point"</strong> to trace the U-curve.
              </div>
            ) : (
              <table className="vlab-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Incidence i (°)</th>
                    <th>Emergence e (°)</th>
                    <th>Deviation δ (°)</th>
                    <th>Refractive Index (μ)</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r) => (
                    <tr key={r.trial}>
                      <td>#{r.trial}</td>
                      <td>{r.angleI}°</td>
                      <td>{r.angleE}°</td>
                      <td><strong>{r.deviation}°</strong></td>
                      <td>{r.calculatedMu}</td>
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
