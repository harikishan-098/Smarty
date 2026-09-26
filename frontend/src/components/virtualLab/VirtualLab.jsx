import React, { useState, useMemo } from 'react';
import { EXPERIMENTS, getFilteredExperiments } from './experimentsData';
import OhmsLawSim from './OhmsLawSim';
import TitrationSim from './TitrationSim';
import PendulumSim from './PendulumSim';
import PrismSim from './PrismSim';
import ReactionsSim from './ReactionsSim';
import ArchimedesSim from './ArchimedesSim';
import ElectricCircuitSim from './ElectricCircuitSim';
import MistakeReportModal from './MistakeReportModal';

export default function VirtualLab({ onBackToHome }) {
  // Filters state
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Active view tab inside experiment
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'theory' | 'viva'

  // Selected experiment (default to Ohm's Law or first)
  const [selectedExpId, setSelectedExpId] = useState(EXPERIMENTS[0].id);

  // Mistake Report Modal state
  const [reportData, setReportData] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Trigger search on click of Search Button or Enter
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setActiveSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearchQuery('');
  };

  // Filtered experiments list
  const filteredExperiments = useMemo(() => {
    return getFilteredExperiments({
      classNum: selectedClass,
      subject: selectedSubject,
      searchQuery: activeSearchQuery
    });
  }, [selectedClass, selectedSubject, activeSearchQuery]);

  // Find currently selected experiment
  const currentExperiment = useMemo(() => {
    return (
      EXPERIMENTS.find((e) => e.id === selectedExpId) ||
      filteredExperiments[0] ||
      EXPERIMENTS[0]
    );
  }, [selectedExpId, filteredExperiments]);

  // Handle analysis from simulator
  const handleAnalyzeMistakes = (data) => {
    setReportData(data);
    setIsReportOpen(true);
  };

  const handleRetryExperiment = () => {
    setIsReportOpen(false);
  };

  return (
    <div className="vlab-page-container">
      
      {/* Top Banner & Quick Controls */}
      <div className="vlab-header-banner">
        <div className="vlab-banner-info">
          <div className="vlab-title-row">
            <span className="vlab-logo-pill">🔬 CBSE VIRTUAL LAB</span>
            <h2>CBSE Interactive Laboratory Workbench</h2>
          </div>
          <p className="vlab-subtitle">
            Perform authentic Physics &amp; Chemistry practicals from Lower Classes up to Class 12th CBSE. Observe, record on graph sheets, and get automated error diagnostic reports!
          </p>
        </div>

        <button className="vlab-btn vlab-btn-back" onClick={onBackToHome} title="Return to AI Learning Studio">
          ← Back to AI Learn Studio
        </button>
      </div>

      {/* Main Grid: Left Filter / Search Sidebar + Right Graph Workbench */}
      <div className="vlab-layout-grid">
        
        {/* ================= LEFT SIDEBAR: FILTERS & EXPERIMENT SELECTOR ================= */}
        <aside className="vlab-sidebar">
          
          <div className="vlab-sidebar-title">
            <span>⚙️</span>
            <h3>Lab Navigator</h3>
          </div>

          {/* 1. Subject Selector */}
          <div className="vlab-filter-section">
            <label className="vlab-filter-label">Choose Subject:</label>
            <div className="vlab-subject-buttons">
              <button
                className={`vlab-subject-btn ${selectedSubject === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSubject('all')}
              >
                All Subjects
              </button>
              <button
                className={`vlab-subject-btn ${selectedSubject === 'Physics' ? 'active-physics' : ''}`}
                onClick={() => setSelectedSubject('Physics')}
              >
                ⚡ Physics
              </button>
              <button
                className={`vlab-subject-btn ${selectedSubject === 'Chemistry' ? 'active-chemistry' : ''}`}
                onClick={() => setSelectedSubject('Chemistry')}
              >
                🧪 Chemistry
              </button>
            </div>
          </div>

          {/* 2. Class Selector */}
          <div className="vlab-filter-section">
            <label className="vlab-filter-label">Select CBSE Class:</label>
            <select
              className="vlab-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes (6 to 12)</option>
              <option value="6">Class 6 (Foundations)</option>
              <option value="7">Class 7 (Middle Science)</option>
              <option value="8">Class 8 (Upper Middle)</option>
              <option value="9">Class 9 (Secondary - Core)</option>
              <option value="10">Class 10 (CBSE Board Practicals)</option>
              <option value="11">Class 11 (Senior Secondary)</option>
              <option value="12">Class 12 (CBSE Board Practicals)</option>
            </select>
          </div>

          {/* 3. Search Bar with Dedicated Search Button */}
          <div className="vlab-filter-section">
            <label className="vlab-filter-label">Search Experiment:</label>
            <form onSubmit={handleSearchSubmit} className="vlab-search-form">
              <input
                type="text"
                className="vlab-search-input"
                placeholder="E.g., Ohm's Law, Titration, Pendulum..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="vlab-search-btn" title="Search experiments">
                🔍 Search
              </button>
            </form>
            {activeSearchQuery && (
              <div className="vlab-active-filter-tag">
                <span>Searching: "{activeSearchQuery}"</span>
                <button onClick={handleClearSearch} className="clear-tag-btn">✕</button>
              </div>
            )}
          </div>

          {/* 4. Experiments List */}
          <div className="vlab-experiments-list-wrapper">
            <div className="experiments-count-bar">
              <span>CBSE Experiments ({filteredExperiments.length})</span>
            </div>

            {filteredExperiments.length === 0 ? (
              <div className="vlab-empty-search">
                <p>No experiments found matching your search.</p>
                <button className="vlab-btn-mini" onClick={handleClearSearch}>
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className="vlab-experiments-scroll">
                {filteredExperiments.map((exp) => {
                  const isSelected = exp.id === currentExperiment.id;
                  return (
                    <div
                      key={exp.id}
                      className={`vlab-exp-item-card ${isSelected ? 'active-exp' : ''}`}
                      onClick={() => {
                        setSelectedExpId(exp.id);
                        setActiveTab('simulation');
                      }}
                    >
                      <div className="exp-item-top">
                        <span className="exp-item-icon">{exp.icon}</span>
                        <div className="exp-item-meta">
                          <span className={`exp-class-badge class-${exp.classNum}`}>
                            {exp.classLabel}
                          </span>
                          <span className={`exp-subj-badge subj-${exp.subject.toLowerCase()}`}>
                            {exp.subject}
                          </span>
                        </div>
                      </div>
                      <h4 className="exp-item-title">{exp.title}</h4>
                      <p className="exp-item-aim">{exp.aim}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </aside>

        {/* ================= RIGHT WORKSPACE: GRAPH PAGE & SIMULATION ================= */}
        <main className="vlab-main-workspace">
          
          {/* Active Experiment Header */}
          <div className="vlab-exp-banner-card">
            <div className="exp-banner-top">
              <div className="exp-meta-badges">
                <span className="vlab-syllabus-badge">{currentExperiment.syllabusCode}</span>
                <span className={`exp-subj-badge subj-${currentExperiment.subject.toLowerCase()}`}>
                  {currentExperiment.subject}
                </span>
                <span className={`exp-class-badge class-${currentExperiment.classNum}`}>
                  {currentExperiment.classLabel}
                </span>
                <span className="exp-difficulty-badge">{currentExperiment.difficulty}</span>
              </div>

              {/* View Tabs */}
              <div className="vlab-view-tabs">
                <button
                  className={`vlab-tab-btn ${activeTab === 'simulation' ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab('simulation')}
                >
                  🔬 Interactive Graph Simulation
                </button>
                <button
                  className={`vlab-tab-btn ${activeTab === 'theory' ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab('theory')}
                >
                  📖 Theory &amp; Procedure
                </button>
                <button
                  className={`vlab-tab-btn ${activeTab === 'viva' ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab('viva')}
                >
                  🎓 CBSE Practical Viva-Voce
                </button>
              </div>
            </div>

            <h1 className="exp-banner-title">{currentExperiment.title}</h1>
            <p className="exp-banner-aim">
              <strong>Aim:</strong> {currentExperiment.aim}
            </p>
          </div>

          {/* Required Equipments Tray */}
          <div className="vlab-equipments-tray">
            <div className="equipments-tray-header">
              <span>🧰 Required Apparatus &amp; Chemicals ({currentExperiment.equipments.length})</span>
              <span className="tray-tip">Equipments automatically calibrated on graph sheet</span>
            </div>
            <div className="equipments-grid">
              {currentExperiment.equipments.map((eq, i) => (
                <div key={i} className="equipment-chip" title={eq.purpose}>
                  <span className="eq-icon">{eq.icon}</span>
                  <div className="eq-text">
                    <strong>{eq.name}</strong>
                    <span>{eq.spec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TAB 1: INTERACTIVE SIMULATION ON GRAPH PAGE */}
          {activeTab === 'simulation' && (
            <div className="vlab-sim-active-wrapper">
              {currentExperiment.simType === 'ohms-law' && (
                <OhmsLawSim onAnalyzeMistakes={handleAnalyzeMistakes} />
              )}
              {currentExperiment.simType === 'titration' && (
                <TitrationSim onAnalyzeMistakes={handleAnalyzeMistakes} />
              )}
              {currentExperiment.simType === 'pendulum' && (
                <PendulumSim onAnalyzeMistakes={handleAnalyzeMistakes} />
              )}
              {currentExperiment.simType === 'prism' && (
                <PrismSim onAnalyzeMistakes={handleAnalyzeMistakes} />
              )}
              {currentExperiment.simType === 'reactions' && (
                <ReactionsSim
                  experiment={currentExperiment}
                  onAnalyzeMistakes={handleAnalyzeMistakes}
                />
              )}
              {currentExperiment.simType === 'archimedes' && (
                <ArchimedesSim onAnalyzeMistakes={handleAnalyzeMistakes} />
              )}
              {currentExperiment.simType === 'electric-circuit' && (
                <ElectricCircuitSim onAnalyzeMistakes={handleAnalyzeMistakes} />
              )}
            </div>
          )}

          {/* TAB 2: THEORY & PROCEDURE */}
          {activeTab === 'theory' && (
            <div className="vlab-theory-card">
              <div className="theory-section">
                <h3>🧪 Scientific Theory &amp; Principle</h3>
                <p>{currentExperiment.theory}</p>
              </div>

              {currentExperiment.formula && (
                <div className="theory-section">
                  <h3>📐 Mathematical Formula &amp; Calculations</h3>
                  <pre className="formula-code-block">{currentExperiment.formula}</pre>
                </div>
              )}

              <div className="theory-section">
                <h3>📋 Step-by-Step Laboratory Procedure</h3>
                <ol className="procedure-ordered-list">
                  {currentExperiment.procedureSteps.map((step, idx) => (
                    <li key={idx}>
                      <span className="step-num">Step {idx + 1}:</span> {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: CBSE VIVA QUESTIONS */}
          {activeTab === 'viva' && (
            <div className="vlab-viva-panel">
              <div className="viva-panel-header">
                <h3>🎓 CBSE Board Practical Viva-Voce Questions &amp; Model Answers</h3>
                <p>Prepare for external examiner questions and oral evaluation for this practical.</p>
              </div>
              <div className="viva-questions-grid">
                {currentExperiment.vivaQuestions.map((v, i) => (
                  <div key={i} className="viva-qa-card">
                    <div className="viva-q-row">
                      <span className="viva-badge">Question {i + 1}</span>
                      <h4>{v.q}</h4>
                    </div>
                    <div className="viva-a-row">
                      <strong>Examiner Model Answer:</strong>
                      <p>{v.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Laboratory Mistake Analysis Report Modal */}
      {reportData && (
        <MistakeReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onRetry={handleRetryExperiment}
          experiment={currentExperiment}
          mistakes={reportData.mistakes}
          goodPractices={reportData.goodPractices}
          observations={reportData.observations}
          calculatedValue={reportData.calculatedValue}
          theoreticalValue={reportData.theoreticalValue}
          unit={reportData.unit}
          accuracyScore={reportData.accuracyScore}
        />
      )}

    </div>
  );
}
