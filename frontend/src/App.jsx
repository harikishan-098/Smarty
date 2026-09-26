import React, { useState } from 'react'
import Header from './components/Header'
import About from './components/About'
import PromptInput from './components/PromptInput'
import LoadingState from './components/LoadingState'
import ResultSection from './components/ResultSection'
import { generateContent } from './services/api'
import Chatbot from './components/Chatbot'
import VirtualLab from './components/virtualLab/VirtualLab'

function App() {
  const [currentView, setCurrentView] = useState('learn') // 'learn' | 'virtual-lab'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [showAbout, setShowAbout] = useState(false)

  const handleSubmit = async (prompt) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setUserPrompt(prompt)

    try {
      const data = await generateContent(prompt)
      setResult(data)
    } catch (err) {
      setError(
        err.message ||
        'Something went wrong while generating your lesson. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setUserPrompt('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={`app ${currentView === 'virtual-lab' ? 'app-virtual-lab-mode' : ''}`}>

      <Header
        onHome={() => {
          setCurrentView('learn')
          handleReset()
        }}
        onAbout={() => setShowAbout(true)}
        onVirtualLab={() => setCurrentView('virtual-lab')}
        currentView={currentView}
      />

      {/* Dedicated Left Navigation Bar / Dock for Quick Access */}
      <aside className="app-left-nav-dock" aria-label="Left Quick Navigation">
        <button
          className={`left-dock-btn ${currentView === 'learn' ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('learn')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          title="AI Learning Studio (Lessons & Diagrams)"
        >
          <span className="dock-icon">🧠</span>
          <span className="dock-label">AI Studio</span>
        </button>

        <button
          className={`left-dock-btn dock-vlab ${currentView === 'virtual-lab' ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('virtual-lab')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          title="CBSE Physics & Chemistry Virtual Lab (Class 6 - 12)"
        >
          <span className="dock-icon">🔬</span>
          <span className="dock-label">Virtual Lab</span>
          <span className="dock-pulse-tag">CBSE</span>
        </button>
      </aside>

      {/* Main Content Area */}
      {currentView === 'virtual-lab' ? (
        <main className="vlab-outer-main">
          <VirtualLab onBackToHome={() => setCurrentView('learn')} />
        </main>
      ) : (
        <main className="main-content">

          {!result && !loading && (
            <div id="home">
              <PromptInput onSubmit={handleSubmit} />
            </div>
          )}

          {loading && <LoadingState />}

          {error && (
            <div className="error-message">
              <h3>⚠️ Error</h3>
              <p>{error}</p>

              <button
                onClick={handleReset}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {result && (
            <ResultSection
              result={result}
              userPrompt={userPrompt}
              onReset={handleReset}
            />
          )}

        </main>
      )}

      {showAbout && (
        <About onClose={() => setShowAbout(false)} />
      )}

      <Chatbot />

      <footer className="footer">
        <p>© 2024 AI Learn &amp; Visualize • CBSE Practical Virtual Lab • Powered by AI</p>
      </footer>

    </div>
  )
}

export default App