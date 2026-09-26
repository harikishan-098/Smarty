import React from 'react';

export default function MistakeReportModal({
  isOpen,
  onClose,
  onRetry,
  experiment,
  mistakes,
  goodPractices,
  observations,
  calculatedValue,
  theoreticalValue,
  unit,
  accuracyScore
}) {
  if (!isOpen) return null;

  // Compute percentage error if numerical
  let percentError = null;
  if (calculatedValue !== undefined && theoreticalValue && !isNaN(calculatedValue) && calculatedValue > 0) {
    percentError = Math.abs((calculatedValue - theoreticalValue) / theoreticalValue) * 100;
  }

  // Determine CBSE Grade
  let grade = 'A1';
  let gradeBadge = 'grade-a1';
  let gradeRemarks = 'Outstanding practical performance! Perfect execution according to CBSE board criteria.';

  if (accuracyScore >= 90) {
    grade = 'A1';
    gradeBadge = 'grade-a1';
    gradeRemarks = 'Exemplary work! Followed all standard practical protocols with minimal experimental error.';
  } else if (accuracyScore >= 75) {
    grade = 'A2';
    gradeBadge = 'grade-a2';
    gradeRemarks = 'Very good practical execution. Minor procedural oversights detected.';
  } else if (accuracyScore >= 60) {
    grade = 'B1';
    gradeBadge = 'grade-b1';
    gradeRemarks = 'Good attempt, but notable laboratory inaccuracies need correction before CBSE practical exams.';
  } else if (accuracyScore >= 45) {
    grade = 'B2';
    gradeBadge = 'grade-b2';
    gradeRemarks = 'Several experimental errors and procedural gaps detected. Review the CBSE guidelines below.';
  } else {
    grade = 'C';
    gradeBadge = 'grade-c';
    gradeRemarks = 'Significant mistakes detected. We strongly recommend repeating the experiment to build proper practical skills.';
  }

  return (
    <div className="vlab-modal-backdrop" onClick={onClose}>
      <div className="vlab-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="vlab-modal-header">
          <div className="vlab-modal-title-group">
            <span className="vlab-modal-badge">CBSE Board Practical Assessment</span>
            <h2>📊 Laboratory Error Analysis &amp; Report Card</h2>
            <p className="vlab-modal-subtitle">{experiment.title} ({experiment.syllabusCode})</p>
          </div>
          <button className="vlab-modal-close" onClick={onClose} title="Close report">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="vlab-modal-body">
          
          {/* Top Score Banner */}
          <div className="vlab-score-banner">
            <div className="vlab-score-dial">
              <div className="vlab-score-circle">
                <span className="vlab-score-num">{accuracyScore}%</span>
                <span className="vlab-score-label">Accuracy Score</span>
              </div>
            </div>

            <div className="vlab-score-details">
              <div className="vlab-grade-tag">
                <span className={`vlab-grade-badge ${gradeBadge}`}>Grade: {grade}</span>
                <span className="vlab-grade-text">{gradeRemarks}</span>
              </div>

              {theoreticalValue !== undefined && calculatedValue !== undefined && (
                <div className="vlab-values-comparison">
                  <div className="vlab-val-card">
                    <span className="vlab-val-label">Your Observed Result</span>
                    <span className="vlab-val-data">
                      {typeof calculatedValue === 'number' ? calculatedValue.toFixed(2) : calculatedValue} {unit}
                    </span>
                  </div>
                  <div className="vlab-val-divider">vs</div>
                  <div className="vlab-val-card standard">
                    <span className="vlab-val-label">CBSE Standard (True) Value</span>
                    <span className="vlab-val-data">{theoreticalValue} {unit}</span>
                  </div>
                  {percentError !== null && (
                    <div className="vlab-val-card error-card">
                      <span className="vlab-val-label">Experimental % Error</span>
                      <span className="vlab-val-data text-error">{percentError.toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mistakes & Inaccuracies Section */}
          <div className="vlab-section">
            <h3 className="vlab-section-title danger-title">
              <span>⚠️</span> Mistakes &amp; Systematic Inaccuracies Detected ({mistakes.length})
            </h3>
            
            {mistakes.length === 0 ? (
              <div className="vlab-no-mistakes">
                <span className="vlab-check-icon">🎉</span>
                <div>
                  <strong>Flawless Laboratory Procedure!</strong>
                  <p>Zero procedural or observational errors detected. You followed all CBSE laboratory safety and measurement norms.</p>
                </div>
              </div>
            ) : (
              <div className="vlab-mistakes-list">
                {mistakes.map((mistake, idx) => (
                  <div key={idx} className="vlab-mistake-card">
                    <div className="vlab-mistake-icon">❌</div>
                    <div className="vlab-mistake-content">
                      <div className="vlab-mistake-header">
                        <h4>{mistake.title}</h4>
                        <span className="vlab-mistake-category">{mistake.category || 'Procedural Error'}</span>
                      </div>
                      <p className="vlab-mistake-desc">{mistake.description}</p>
                      <div className="vlab-mistake-fix">
                        <span className="fix-icon">💡</span>
                        <strong>How to avoid in CBSE Exam:</strong> {mistake.howToFix}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Good Practices Observed */}
          {goodPractices && goodPractices.length > 0 && (
            <div className="vlab-section">
              <h3 className="vlab-section-title success-title">
                <span>✅</span> Proper Lab Protocols Followed ({goodPractices.length})
              </h3>
              <div className="vlab-good-practices-grid">
                {goodPractices.map((gp, idx) => (
                  <div key={idx} className="vlab-good-card">
                    <span className="good-check">✓</span>
                    <span>{gp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observations Summary */}
          {observations && observations.length > 0 && (
            <div className="vlab-section">
              <h3 className="vlab-section-title">
                <span>📝</span> Recorded Observations ({observations.length} Readings)
              </h3>
              <div className="vlab-obs-table-wrapper">
                <table className="vlab-obs-table">
                  <thead>
                    <tr>
                      <th>Trial #</th>
                      {Object.keys(observations[0]).map((key, i) => (
                        <th key={i}>{key.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {observations.map((row, idx) => (
                      <tr key={idx}>
                        <td>#{idx + 1}</td>
                        {Object.values(row).map((val, i) => (
                          <td key={i}>{typeof val === 'number' ? val.toFixed(2) : val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CBSE Examiner Viva Questions */}
          <div className="vlab-section">
            <h3 className="vlab-section-title">
              <span>🎓</span> CBSE Board Practical Viva-Voce Questions
            </h3>
            <div className="vlab-viva-list">
              {experiment.vivaQuestions.map((viva, idx) => (
                <div key={idx} className="vlab-viva-card">
                  <div className="vlab-viva-q">
                    <strong>Q{idx + 1}:</strong> {viva.q}
                  </div>
                  <div className="vlab-viva-a">
                    <strong>Model Answer:</strong> {viva.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="vlab-modal-footer">
          <button className="vlab-btn vlab-btn-secondary" onClick={onClose}>
            Review Graph Sheet
          </button>
          <button className="vlab-btn vlab-btn-primary" onClick={onRetry}>
            🔄 Retry Experiment
          </button>
        </div>

      </div>
    </div>
  );
}
