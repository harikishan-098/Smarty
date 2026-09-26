import React, { useState, useEffect, useRef } from 'react';

export default function PendulumSim({ onAnalyzeMistakes, isAnalyzing }) {
  // Apparatus settings
  const [stringLength, setStringLength] = useState(80); // cm (50 to 110)
  const bobRadius = 1.25; // cm (brass bob dia 2.5 cm)
  const hookLength = 1.0; // cm
  const effectiveLengthCm = stringLength + bobRadius + hookLength;
  const effectiveLengthM = effectiveLengthCm / 100;

  // Initial displacement angle (degrees)
  const [initialAngle, setInitialAngle] = useState(10); // 5 to 40 deg
  const [isOscillating, setIsOscillating] = useState(false);

  // Real acceleration due to gravity
  const trueG = 9.8; // m/s^2
  // Real theoretical period: T = 2 * pi * sqrt(L / g)
  // For larger angles, second-order correction: T_approx = T_0 * (1 + (1/16)*theta^2)
  const thetaRad = (initialAngle * Math.PI) / 180;
  const periodCorrection = initialAngle > 15 ? 1 + (thetaRad * thetaRad) / 16 : 1.0;
  const truePeriod = 2 * Math.PI * Math.sqrt(effectiveLengthM / trueG) * periodCorrection;

  // Live animation state
  const [currentAngleDeg, setCurrentAngleDeg] = useState(0);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);

  // Digital Stopwatch
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0); // seconds
  const [oscillationCount, setOscillationCount] = useState(0);
  const stopwatchIntervalRef = useRef(null);

  // Recorded observations
  const [observations, setObservations] = useState([]);

  // Mistakes tracker
  const [mistakesLog, setMistakesLog] = useState({
    largeAngleUsed: false,
    tooFewOscillations: false,
    insufficientDataPoints: false
  });

  // Oscillating motion animation loop
  useEffect(() => {
    if (isOscillating) {
      startTimeRef.current = performance.now();
      const omega = Math.sqrt(trueG / effectiveLengthM);

      const updateMotion = (now) => {
        const elapsedSec = (now - startTimeRef.current) / 1000;
        // Damping factor: e^(-0.015 * t)
        const damping = Math.exp(-0.015 * elapsedSec);
        const angle = initialAngle * damping * Math.cos(omega * elapsedSec);
        setCurrentAngleDeg(angle);

        // Approximate cycle counter
        const cycles = Math.floor(elapsedSec / truePeriod);
        setOscillationCount(cycles);

        animRef.current = requestAnimationFrame(updateMotion);
      };

      animRef.current = requestAnimationFrame(updateMotion);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setCurrentAngleDeg(0);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOscillating, effectiveLengthM, initialAngle, truePeriod]);

  // Stopwatch timer
  useEffect(() => {
    if (stopwatchRunning) {
      const start = Date.now() - stopwatchTime * 1000;
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(Number(((Date.now() - start) / 1000).toFixed(2)));
      }, 50);
    } else {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [stopwatchRunning]);

  const handleStartSwing = () => {
    if (initialAngle > 15) {
      setMistakesLog((m) => ({ ...m, largeAngleUsed: true }));
    }
    setIsOscillating(true);
    setOscillationCount(0);
  };

  const handleStopSwing = () => {
    setIsOscillating(false);
  };

  const handleResetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  const handleRecordObservation = () => {
    // Calculated period from stopwatch or physics simulation
    let observedPeriod = truePeriod;
    if (stopwatchTime > 2 && oscillationCount >= 5) {
      observedPeriod = stopwatchTime / oscillationCount;
    }

    if (oscillationCount < 10) {
      setMistakesLog((m) => ({ ...m, tooFewOscillations: true }));
    }

    const tSquared = Number((observedPeriod * observedPeriod).toFixed(3));
    // Calculate g = 4 * pi^2 * L / T^2
    const calculatedG = Number(((4 * Math.PI * Math.PI * effectiveLengthM) / tSquared).toFixed(2));

    const newObs = {
      trial: observations.length + 1,
      stringLength: stringLength,
      effectiveLength: Number(effectiveLengthCm.toFixed(2)),
      oscillations: oscillationCount >= 5 ? oscillationCount : 20,
      timeTaken: oscillationCount >= 5 ? stopwatchTime : Number((20 * observedPeriod).toFixed(2)),
      periodT: Number(observedPeriod.toFixed(2)),
      tSquared: tSquared,
      calculatedG: calculatedG
    };

    setObservations([...observations, newObs]);
  };

  // Analyze Mistakes
  const handlePerformAnalysis = () => {
    const detectedMistakes = [];
    const goodPractices = [];

    // Check 1: Large angular amplitude
    if (mistakesLog.largeAngleUsed || initialAngle > 15) {
      detectedMistakes.push({
        title: "Large Angular Amplitude (> 15°) Violating SHM",
        category: "Theoretical Approximation Error",
        description: `You set the swing angle to ${initialAngle}°. Simple harmonic motion requires the restoring force to be proportional to displacement, which holds ONLY when sin θ ≈ θ (in radians). For angles > 15°, the time period increases by (1 + θ²/16), making the pendulum non-isochronous.`,
        howToFix: "CBSE Rule: Always keep the angular displacement small, strictly below 10° to 15°, to guarantee true Simple Harmonic Motion."
      });
    } else {
      goodPractices.push(`Maintained small angular amplitude (${initialAngle}° ≤ 15°) satisfying the SHM small-angle approximation.`);
    }

    // Check 2: Too few oscillations timed
    if (mistakesLog.tooFewOscillations) {
      detectedMistakes.push({
        title: "Timed Fewer than 20 Oscillations (High Reaction Time Error)",
        category: "Statistical Error",
        description: "You recorded time for fewer than 10-20 oscillations. Human reaction time errors (~0.2s) cause substantial percentage inaccuracies when the total timing window is small.",
        howToFix: "Always count at least 20 complete oscillations to dilute start/stop reaction-time latency."
      });
    } else {
      goodPractices.push("Recorded sufficient number of oscillations to reduce personal reaction time error.");
    }

    // Check 3: Insufficient data points
    if (observations.length < 4) {
      detectedMistakes.push({
        title: "Insufficient Length Points on Graph (Fewer than 4)",
        category: "Graph Analysis Error",
        description: `You recorded only ${observations.length} observation(s). CBSE practical instructions require varying effective length (L) across at least 4 to 5 different settings (e.g. 60, 70, 80, 90, 100 cm) to plot a valid straight-line graph.`,
        howToFix: "Take observations for at least 5 different string lengths from 60 cm to 100 cm in steps of 10 cm."
      });
    } else {
      goodPractices.push(`Sampled ${observations.length} different pendulum lengths across the laboratory scale.`);
    }

    // Average g calculated
    let avgG = trueG;
    if (observations.length > 0) {
      const sumG = observations.reduce((acc, o) => acc + o.calculatedG, 0);
      avgG = Number((sumG / observations.length).toFixed(2));
    }

    let score = 95;
    score -= detectedMistakes.length * 18;
    if (observations.length < 3) score -= 15;
    score = Math.max(25, Math.min(100, score));

    onAnalyzeMistakes({
      mistakes: detectedMistakes,
      goodPractices: goodPractices,
      observations: observations,
      calculatedValue: avgG,
      theoreticalValue: trueG,
      unit: 'm/s²',
      accuracyScore: score
    });
  };

  return (
    <div className="vlab-sim-container">
      {/* Top Toolbar */}
      <div className="vlab-sim-toolbar">
        <div className="vlab-sim-controls-group">
          {/* Length Slider */}
          <label className="vlab-control-item">
            <span className="control-label">String Length (l): <strong>{stringLength} cm</strong></span>
            <input
              type="range"
              min="50"
              max="110"
              step="5"
              value={stringLength}
              onChange={(e) => setStringLength(Number(e.target.value))}
              disabled={isOscillating}
              className="vlab-slider-mini"
            />
          </label>

          {/* Angle Slider */}
          <label className="vlab-control-item">
            <span className="control-label">
              Displacement Angle (θ): <strong className={initialAngle > 15 ? 'text-danger' : ''}>{initialAngle}°</strong>
            </span>
            <input
              type="range"
              min="4"
              max="35"
              step="1"
              value={initialAngle}
              onChange={(e) => setInitialAngle(Number(e.target.value))}
              disabled={isOscillating}
              className="vlab-slider-mini"
            />
          </label>

          {/* Swing Controls */}
          {!isOscillating ? (
            <button className="vlab-btn vlab-btn-active" onClick={handleStartSwing}>
              ▶️ Release Bob (Oscillate)
            </button>
          ) : (
            <button className="vlab-btn vlab-btn-secondary" onClick={handleStopSwing}>
              ⏹️ Hold Bob (Stop)
            </button>
          )}
        </div>

        <div className="vlab-sim-actions-group">
          <button className="vlab-btn vlab-btn-action" onClick={handleRecordObservation}>
            📍 Record to Graph ({observations.length})
          </button>
          <button className="vlab-btn vlab-btn-clear" onClick={() => setObservations([])}>
            🗑️ Clear Observations
          </button>
          <button className="vlab-btn vlab-btn-analyze" onClick={handlePerformAnalysis}>
            ✨ Analyze Experiment &amp; Check Mistakes
          </button>
        </div>
      </div>

      {/* Dual Workspace: Left Pendulum Canvas + Right Graph Page */}
      <div className="vlab-workspace-grid">
        
        {/* Left Bench: Interactive Pendulum Stand & Digital Stopwatch */}
        <div className="vlab-bench-card">
          <div className="vlab-bench-header">
            <h4>⏳ Simple Pendulum Stand &amp; Rig</h4>
            <span className="vlab-circuit-status status-live">
              Effective L = {effectiveLengthCm.toFixed(1)} cm
            </span>
          </div>

          {initialAngle > 15 && (
            <div className="vlab-alert-banner">
              ⚠️ <strong>Warning: Angle {initialAngle}° &gt; 15°!</strong> This violates the small angle condition for SHM. Pendulum will lose isochronism!
            </div>
          )}

          {/* Visual Rig */}
          <div className="vlab-pendulum-stage">
            <svg className="vlab-pendulum-svg" viewBox="0 0 320 280">
              {/* Stand Support */}
              <rect x="20" y="20" width="280" height="12" fill="#475569" rx="3" />
              <rect x="40" y="20" width="12" height="250" fill="#334155" />
              <rect x="20" y="260" width="100" height="12" fill="#1e293b" rx="2" />

              {/* Point of Suspension (Split Cork) */}
              <circle cx="160" cy="26" r="6" fill="#f59e0b" />
              <text x="175" y="30" fill="#94a3b8" fontSize="10">Suspension (Split Cork)</text>

              {/* Equilibrium Line */}
              <line x1="160" y1="32" x2="160" y2="240" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />

              {/* Pendulum Thread & Bob */}
              {(() => {
                const suspensionX = 160;
                const suspensionY = 32;
                const visualLength = 70 + (stringLength / 110) * 120;
                const angleRad = (currentAngleDeg * Math.PI) / 180;
                const bobX = suspensionX + visualLength * Math.sin(angleRad);
                const bobY = suspensionY + visualLength * Math.cos(angleRad);

                return (
                  <g>
                    {/* Thread */}
                    <line
                      x1={suspensionX}
                      y1={suspensionY}
                      x2={bobX}
                      y2={bobY}
                      stroke="#e2e8f0"
                      strokeWidth="1.5"
                    />
                    {/* Hook */}
                    <circle cx={bobX} cy={bobY - 4} r="3" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                    {/* Brass Bob */}
                    <circle
                      cx={bobX}
                      cy={bobY}
                      r="12"
                      fill="url(#brassGradient)"
                      stroke="#b45309"
                      strokeWidth="1.5"
                    />
                    {/* Center of Gravity dot */}
                    <circle cx={bobX} cy={bobY} r="2" fill="#ffffff" />
                  </g>
                );
              })()}

              <defs>
                <radialGradient id="brassGradient" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Digital Stopwatch Unit */}
          <div className="vlab-stopwatch-unit">
            <div className="stopwatch-display">
              <span className="stopwatch-digits">{stopwatchTime.toFixed(2)} s</span>
              <span className="stopwatch-oscillations">
                Oscillations: <strong>{oscillationCount}</strong>
              </span>
            </div>
            <div className="stopwatch-controls">
              <button
                className={`vlab-btn-mini ${stopwatchRunning ? 'stop-btn' : 'vlab-btn-active'}`}
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
              >
                {stopwatchRunning ? '⏸️ Stop Timer' : '⏱️ Start Timer'}
              </button>
              <button className="vlab-btn-mini" onClick={handleResetStopwatch}>
                🔄 Reset Timer
              </button>
            </div>
          </div>
        </div>

        {/* Right Graph Page: L vs T² Graph Sheet */}
        <div className="vlab-graph-card">
          <div className="vlab-graph-header">
            <div className="graph-title-group">
              <span className="graph-sheet-tag">LABORATORY GRAPH SHEET</span>
              <h3>L vs T² Graph (Slope = g / 4π²)</h3>
            </div>
            <div className="graph-legend">
              <span className="legend-dot plotted"></span> Observations
              <span className="legend-line fit"></span> Ideal Straight Line (g = 9.8 m/s²)
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

              {/* Y Axis (T² in s²) */}
              {[0, 1, 2, 3, 4, 5].map((t2) => {
                const y = 225 - (t2 / 5) * (225 - 20);
                return (
                  <g key={t2}>
                    <line x1="40" y1={y} x2="45" y2={y} stroke="#4ade80" strokeWidth="1.5" />
                    <text x="38" y={y + 3} fill="#86efac" fontSize="9" textAnchor="end">{t2}.0</text>
                  </g>
                );
              })}
              <text x="-120" y="14" transform="rotate(-90)" fill="#4ade80" fontSize="10" textAnchor="middle">
                Time Period Squared T² (s²) →
              </text>

              {/* X Axis (Length L in cm) */}
              {[0, 20, 40, 60, 80, 100, 120].map((l) => {
                const x = 45 + (l / 120) * (440 - 45);
                return (
                  <g key={l}>
                    <line x1={x} y1="225" x2={x} y2="230" stroke="#4ade80" strokeWidth="1.5" />
                    <text x={x} y="242" fill="#86efac" fontSize="10" textAnchor="middle">{l}</text>
                  </g>
                );
              })}
              <text x="240" y="255" fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">
                Effective Length L (cm) →
              </text>

              {/* Theoretical line T² = (4pi² / g) * (L/100) */}
              {/* At L = 120 cm (1.2m), T² = (4 * 9.87 / 9.8) * 1.2 = 4.83 s² */}
              <line
                x1="45"
                y1="225"
                x2={45 + (120 / 120) * (440 - 45)}
                y2={225 - (4.83 / 5) * (225 - 20)}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Plotted Points */}
              {observations.map((obs, idx) => {
                const cx = 45 + (obs.effectiveLength / 120) * (440 - 45);
                const cy = 225 - (obs.tSquared / 5) * (225 - 20);
                return (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r="6" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r="2.5" fill="#f87171" />
                    <text x={cx + 6} y={cy - 4} fill="#fca5a5" fontSize="9" fontWeight="bold">
                      #{obs.trial} ({obs.effectiveLength}cm, {obs.tSquared}s²)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Table */}
          <div className="vlab-obs-mini-table">
            <div className="table-caption">
              <span>📋 Observation Table for Acceleration Due to Gravity (g)</span>
              <span>{observations.length} Recorded</span>
            </div>
            {observations.length === 0 ? (
              <div className="vlab-empty-obs">
                Oscillate pendulum, use stopwatch, and click <strong>"Record to Graph"</strong>.
              </div>
            ) : (
              <table className="vlab-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>String l (cm)</th>
                    <th>Eff. L (cm)</th>
                    <th>20 Osc. Time (s)</th>
                    <th>Period T (s)</th>
                    <th>T² (s²)</th>
                    <th>g (m/s²)</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((o) => (
                    <tr key={o.trial}>
                      <td>#{o.trial}</td>
                      <td>{o.stringLength}</td>
                      <td>{o.effectiveLength}</td>
                      <td>{o.timeTaken}</td>
                      <td>{o.periodT}</td>
                      <td>{o.tSquared}</td>
                      <td><strong>{o.calculatedG}</strong></td>
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
