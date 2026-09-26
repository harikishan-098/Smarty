import React, { useState, useEffect, useRef } from 'react';

export default function OhmsLawSim({ onAnalyzeMistakes, isAnalyzing }) {
  // Circuit states
  const [keyInserted, setKeyInserted] = useState(false);
  const [rheostatVal, setRheostatVal] = useState(25); // 0 to 100 ohms
  const [batteryVoltage, setBatteryVoltage] = useState(6); // 2V, 4V, 6V, 8V
  const [overheated, setOverheated] = useState(false);
  const [heatingTime, setHeatingTime] = useState(0);

  // Wire base resistance is 5.0 ohms
  // If overheated, resistance increases due to temperature coefficient: R_t = R_0 (1 + alpha * DeltaT)
  const baseResistance = 5.0;
  const effectiveResistance = overheated ? baseResistance * (1 + 0.008 * heatingTime) : baseResistance;

  // Circuit calculation: Total R = Wire R + Rheostat R + ammeter internal resistance (~0.2 ohm)
  const internalResistance = 0.3;
  const totalResistance = effectiveResistance + rheostatVal + internalResistance;

  // Real-time values
  const current = keyInserted ? Number((batteryVoltage / totalResistance).toFixed(3)) : 0;
  const potentialDiff = keyInserted ? Number((current * effectiveResistance).toFixed(3)) : 0;

  // Observations recorded on graph sheet
  const [readings, setReadings] = useState([]);
  const [showBestFit, setShowBestFit] = useState(true);

  // Mistakes tracking log
  const [mistakeEvents, setMistakeEvents] = useState({
    triedReadingWithOpenKey: false,
    overheatedWire: false,
    clusteredReadings: false,
    insufficientReadings: false,
    shortCircuitAttempts: 0
  });

  const timerRef = useRef(null);

  // Monitor heating effect when key is inserted with high current
  useEffect(() => {
    if (keyInserted && current > 0.4) {
      timerRef.current = setInterval(() => {
        setHeatingTime((prev) => {
          const next = prev + 1;
          if (next >= 15) {
            setOverheated(true);
            setMistakeEvents((m) => ({ ...m, overheatedWire: true }));
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setHeatingTime(0);
      setOverheated(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [keyInserted, current]);

  // Handle Recording a reading
  const handleRecordReading = () => {
    if (!keyInserted) {
      setMistakeEvents((prev) => ({ ...prev, triedReadingWithOpenKey: true }));
      alert("⚠️ Mistake Detected: The Plug Key is OPEN! No current is flowing through the circuit. Insert the plug key to complete the circuit.");
      return;
    }

    // Check duplicate or too close
    const alreadyExists = readings.some((r) => Math.abs(r.current - current) < 0.02);
    if (alreadyExists) {
      alert("Notice: You already recorded a reading very close to this current value. Adjust the Rheostat slider to take readings at different current points.");
      return;
    }

    const calculatedR = current > 0 ? Number((potentialDiff / current).toFixed(2)) : 0;

    const newReading = {
      trial: readings.length + 1,
      voltage: potentialDiff,
      current: current,
      resistance: calculatedR
    };

    setReadings([...readings, newReading]);
  };

  const handleClearReadings = () => {
    setReadings([]);
  };

  // Compile mistakes for submission to Report Card
  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];

    // Check 1: Plug Key Open reading
    if (mistakeEvents.triedReadingWithOpenKey) {
      detectedMistakes.push({
        title: "Attempted Reading with Open Circuit (Plug Key Removed)",
        category: "Procedural Error",
        description: "You tried taking voltmeter/ammeter readings without inserting the plug key into the circuit.",
        howToFix: "Always ensure the plug key is firmly inserted into the plug socket before observing meter deflections. Remove it immediately after noting readings."
      });
    }

    // Check 2: Overheating error
    if (mistakeEvents.overheatedWire) {
      detectedMistakes.push({
        title: "Joule Heating Error (Key Left Inserted Too Long)",
        category: "Systematic Inaccuracy",
        description: "The plug key was kept inserted continuously under high current (>0.4A). The wire heated up, increasing its resistance from 5.0Ω to over " + effectiveResistance.toFixed(2) + "Ω, causing non-linear V-I points.",
        howToFix: "CBSE Rule: Always remove the plug key between two successive observations to allow the resistance wire to cool down to room temperature."
      });
    } else if (readings.length >= 4) {
      goodPractices.push("Avoided overheating: Key was managed properly without excessive thermal drift.");
    }

    // Check 3: Insufficient readings
    if (readings.length < 4) {
      detectedMistakes.push({
        title: "Insufficient Observations (Fewer than 4 readings)",
        category: "Data Collection Error",
        description: `You recorded only ${readings.length} reading(s). CBSE practical evaluation requires a minimum of 4 to 6 observations across different current values to compute an accurate slope.`,
        howToFix: "Record at least 5 sets of V and I readings covering a wide range (e.g. 0.1A to 0.8A) using the rheostat slider."
      });
    } else {
      goodPractices.push(`Recorded an adequate dataset of ${readings.length} readings across different rheostat settings.`);
    }

    // Check 4: Clustered readings (range check)
    if (readings.length >= 3) {
      const currents = readings.map((r) => r.current);
      const minI = Math.min(...currents);
      const maxI = Math.max(...currents);
      if (maxI - minI < 0.2) {
        detectedMistakes.push({
          title: "Readings Clustered in a Narrow Range",
          category: "Measurement Span Error",
          description: "All your observations were clustered within a very narrow current band (span < 0.2A). This makes the slope line unreliable.",
          howToFix: "Vary the rheostat across its full slider span to sample low, medium, and high current regimes evenly."
        });
      } else {
        goodPractices.push("Uniform observation span: Readings were nicely distributed across low and high current values.");
      }
    }

    // Calculate observed average resistance
    let avgObservedR = baseResistance;
    if (readings.length > 0) {
      const sumR = readings.reduce((acc, r) => acc + r.resistance, 0);
      avgObservedR = Number((sumR / readings.length).toFixed(2));
    }

    // Calculate accuracy score (100 - penalties)
    let score = 95;
    if (detectedMistakes.length === 0 && readings.length >= 5) score = 100;
    else {
      score -= detectedMistakes.length * 18;
      if (readings.length < 3) score -= 15;
    }
    score = Math.max(25, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: readings,
      calculatedValue: avgObservedR,
      theoreticalValue: baseResistance,
      unit: 'Ω',
      accuracyScore: score
    });
  };

  // Graph plotting coordinates calculation (Canvas dimensions: 460 x 300)
  const graphWidth = 460;
  const graphHeight = 300;
  const padLeft = 45;
  const padBottom = 35;
  const padTop = 20;
  const padRight = 20;

  const maxPlotV = 5.0; // Volts max
  const maxPlotI = 1.0; // Amperes max

  const scaleX = (valI) => padLeft + (valI / maxPlotI) * (graphWidth - padLeft - padRight);
  const scaleY = (valV) => graphHeight - padBottom - (valV / maxPlotV) * (graphHeight - padTop - padBottom);

  return (
    <div className="vlab-sim-container">
      {/* Top Controls Bar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          <label className="vlab-control-item">
            <span className="control-label">DC Voltage Supply:</span>
            <select
              className="vlab-select"
              value={batteryVoltage}
              onChange={(e) => setBatteryVoltage(Number(e.target.value))}
            >
              <option value={2}>2 Volts (Low)</option>
              <option value={4}>4 Volts (Standard)</option>
              <option value={6}>6 Volts (Recommended)</option>
              <option value={8}>8 Volts (High)</option>
            </select>
          </label>

          <button
            className={`vlab-btn ${keyInserted ? 'vlab-btn-active' : 'vlab-btn-secondary'}`}
            onClick={() => setKeyInserted(!keyInserted)}
            title="Click to insert or remove the brass plug key"
          >
            {keyInserted ? '🔴 Remove Plug Key (Circuit OPEN)' : '🟢 Insert Plug Key (Circuit CLOSED)'}
          </button>
        </div>

        <div className="vlab-sim-actions-group">
          <button
            className="vlab-btn vlab-btn-action"
            onClick={handleRecordReading}
            title="Plot current readings onto the graph page"
          >
            📍 Record Reading ({readings.length})
          </button>

          <button
            className="vlab-btn vlab-btn-clear"
            onClick={handleClearReadings}
            disabled={readings.length === 0}
            title="Clear all recorded graph points"
          >
            🗑️ Clear Readings
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

      {/* Main Dual Workspace: Left Apparatus Bench + Right Graph Sheet */}
      <div className="vlab-workspace-grid">
        
        {/* Left Bench: Apparatus Setup */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>🔬 Apparatus Circuit Setup</h4>
            <span className={`vlab-circuit-status ${keyInserted ? 'status-live' : 'status-idle'}`}>
              {keyInserted ? '⚡ Circuit Active' : '⚪ Circuit Inactive'}
            </span>
          </div>

          {/* Overheating Alert */}
          {overheated && (
            <div className="vlab-alert-banner">
              ⚠️ <strong>Warning: Joule Heating Detected!</strong> The wire temperature is rising. Resistance is increasing beyond 5.0Ω. Remove the plug key to cool down!
            </div>
          )}

          {/* Circuit Visual Layout */}
          <div className="vlab-circuit-diagram">
            {/* Meters Row */}
            <div className="vlab-meters-row">
              {/* Voltmeter */}
              <div className="vlab-meter-box voltmeter">
                <div className="meter-label">VOLTMETER (V)</div>
                <div className="meter-dial">
                  <div className="meter-scale-marks">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5V</span>
                  </div>
                  <div
                    className="meter-needle"
                    style={{
                      transform: `rotate(${-45 + (potentialDiff / 5) * 90}deg)`
                    }}
                  />
                  <div className="meter-pivot" />
                </div>
                <div className="meter-digital-readout">
                  {potentialDiff.toFixed(2)} V
                </div>
                <span className="meter-lc">LC: 0.1 V | In Parallel</span>
              </div>

              {/* Ammeter */}
              <div className="vlab-meter-box ammeter">
                <div className="meter-label">AMMETER (A)</div>
                <div className="meter-dial">
                  <div className="meter-scale-marks">
                    <span>0</span>
                    <span>0.2</span>
                    <span>0.4</span>
                    <span>0.6</span>
                    <span>0.8</span>
                    <span>1.0A</span>
                  </div>
                  <div
                    className="meter-needle"
                    style={{
                      transform: `rotate(${-45 + Math.min(1, current / 1.0) * 90}deg)`
                    }}
                  />
                  <div className="meter-pivot" />
                </div>
                <div className="meter-digital-readout">
                  {current.toFixed(2)} A
                </div>
                <span className="meter-lc">LC: 0.05 A | In Series</span>
              </div>
            </div>

            {/* Rheostat Slider Control */}
            <div className="vlab-component-card rheostat-card">
              <div className="rheostat-header">
                <span>🎛️ Variable Rheostat (Slider Control)</span>
                <strong>{rheostatVal} Ω</strong>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="1"
                value={rheostatVal}
                onChange={(e) => setRheostatVal(Number(e.target.value))}
                className="vlab-slider"
              />
              <div className="slider-labels">
                <span>Max Current (Low R: 2Ω)</span>
                <span>Min Current (High R: 80Ω)</span>
              </div>
            </div>

            {/* Test Wire & Plug Key Row */}
            <div className="vlab-components-row">
              {/* Test Wire */}
              <div className={`vlab-wire-card ${overheated ? 'wire-overheated' : ''}`}>
                <div className="wire-icon">〰️</div>
                <div className="wire-info">
                  <strong>Nichrome Resistor Wire (50 cm)</strong>
                  <span>Nominal R: 5.00 Ω</span>
                  {overheated && <span className="text-danger">Current R: {effectiveResistance.toFixed(2)} Ω (Thermal Drift)</span>}
                </div>
              </div>

              {/* Plug Key Visual */}
              <div
                className={`vlab-plug-key-visual ${keyInserted ? 'plug-in' : 'plug-out'}`}
                onClick={() => setKeyInserted(!keyInserted)}
                title="Click to toggle key"
              >
                <div className="plug-brass-body">
                  <div className="plug-pin">{keyInserted ? 'INSERTED' : 'OPEN'}</div>
                </div>
                <span className="key-subtext">{keyInserted ? 'Key Inserted' : 'Key Removed'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Graph Page: Authentic Laboratory Graph Sheet */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY GRAPH SHEET</span>
              <h3>V vs I Characteristic Curve</h3>
            </div>
            <div className="graph-legend">
              <span className="legend-dot plotted"></span> Plotted Observations
              {showBestFit && <span className="legend-line fit"></span>} Best-Fit Line (Slope = R)
            </div>
          </div>

          {/* SVG Laboratory Millimetre Graph Sheet */}
          <div className="vlab-graph-canvas-container">
            <svg
              className="vlab-graph-svg"
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Graph Grid Pattern */}
              <defs>
                {/* 10mm Minor Grid */}
                <pattern id="minorGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(34, 197, 94, 0.12)" strokeWidth="0.5" />
                </pattern>
                {/* 50mm Major Grid */}
                <pattern id="majorGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <rect width="50" height="50" fill="url(#minorGrid)" />
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(34, 197, 94, 0.32)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Background Grid Canvas */}
              <rect x="0" y="0" width={graphWidth} height={graphHeight} fill="#0d1b16" />
              <rect x="0" y="0" width={graphWidth} height={graphHeight} fill="url(#majorGrid)" />

              {/* Axes */}
              {/* Y Axis (Voltage V) */}
              <line
                x1={padLeft}
                y1={padTop}
                x2={padLeft}
                y2={graphHeight - padBottom}
                stroke="#4ade80"
                strokeWidth="2"
              />
              {/* X Axis (Current I) */}
              <line
                x1={padLeft}
                y1={graphHeight - padBottom}
                x2={graphWidth - padRight}
                y2={graphHeight - padBottom}
                stroke="#4ade80"
                strokeWidth="2"
              />

              {/* Y Axis Tick Marks & Labels (0 to 5V) */}
              {[0, 1, 2, 3, 4, 5].map((v) => {
                const y = scaleY(v);
                return (
                  <g key={`y-tick-${v}`}>
                    <line x1={padLeft - 5} y1={y} x2={padLeft} y2={y} stroke="#4ade80" strokeWidth="1.5" />
                    <text x={padLeft - 8} y={y + 4} fill="#86efac" fontSize="10" textAnchor="end">
                      {v}.0
                    </text>
                  </g>
                );
              })}

              {/* X Axis Tick Marks & Labels (0 to 1.0A) */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((i) => {
                const x = scaleX(i);
                return (
                  <g key={`x-tick-${i}`}>
                    <line x1={x} y1={graphHeight - padBottom} x2={x} y2={graphHeight - padBottom + 5} stroke="#4ade80" strokeWidth="1.5" />
                    <text x={x} y={graphHeight - padBottom + 16} fill="#86efac" fontSize="10" textAnchor="middle">
                      {i.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axis Titles */}
              <text
                x={graphWidth / 2}
                y={graphHeight - 6}
                fill="#4ade80"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Current I (Amperes) →
              </text>

              <text
                x={-(graphHeight / 2)}
                y={15}
                transform="rotate(-90)"
                fill="#4ade80"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Potential Difference V (Volts) →
              </text>

              {/* Theoretical / Best Fit Straight Line */}
              {showBestFit && readings.length >= 2 && (
                <line
                  x1={scaleX(0)}
                  y1={scaleY(0)}
                  x2={scaleX(1.0)}
                  y2={scaleY(1.0 * baseResistance)}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}

              {/* Plotted Points */}
              {readings.map((r, idx) => {
                const cx = scaleX(r.current);
                const cy = scaleY(r.voltage);
                return (
                  <g key={`pt-${idx}`}>
                    {/* Crosshair ring */}
                    <circle cx={cx} cy={cy} r="6" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r="2.5" fill="#f87171" />
                    <text x={cx + 7} y={cy - 4} fill="#fca5a5" fontSize="9" fontWeight="bold">
                      #{r.trial} ({r.current}A, {r.voltage}V)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Observation Table on Graph Page */}
          <div className="vlab-obs-mini-table">
            <div className="table-caption">
              <span>📋 Live Observation Table</span>
              <span>{readings.length} Trials Recorded</span>
            </div>
            {readings.length === 0 ? (
              <div className="vlab-empty-obs">
                Click <strong>"Record Reading"</strong> to plot your first observation on the graph paper.
              </div>
            ) : (
              <table className="vlab-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Voltmeter V (V)</th>
                    <th>Ammeter I (A)</th>
                    <th>R = V / I (Ω)</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((row) => (
                    <tr key={row.trial}>
                      <td>{row.trial}</td>
                      <td>{row.voltage.toFixed(2)}</td>
                      <td>{row.current.toFixed(2)}</td>
                      <td><strong>{row.resistance.toFixed(2)}</strong></td>
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
