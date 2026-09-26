import React, { useState } from 'react'
import Explanation from './Explanation'
import DiagramRenderer from './DiagramRenderer'
import PracticeQuestions from './PracticeQuestions'

function ResultSection({ result, userPrompt, onReset }) {
  return (
    <div className="result-section">
      <div className="result-header">
        <button onClick={onReset} className="btn-secondary">
          ← New Topic
        </button>
      </div>

      <div className="user-prompt-display">
        <h4>Your Prompt</h4>
        <p>{userPrompt}</p>
      </div>

      <div className="content-card">
        <h1 className="result-title">{result.title}</h1>
        
        {result.summary && (
          <div className="summary-section">
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </div>
        )}

        {result.diagram_type !== 'none' && result.diagram && (
          <DiagramRenderer 
            diagram={result.diagram}
            diagramType={result.diagram_type}
          />
        )}

        <Explanation explanation={result.explanation} />
      </div>

      {result.practice_questions && result.practice_questions.length > 0 && (
        <PracticeQuestions 
          questions={result.practice_questions}
          topicTitle={result.title}
        />
      )}
    </div>
  )
}

export default ResultSection