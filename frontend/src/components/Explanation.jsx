import React from 'react'

function Explanation({ explanation }) {
  if (!explanation || explanation.length === 0) return null

  return (
    <div id="learn-section"
    className="explanation-section">
      <h3>📚 Detailed Explanation</h3>
      <div className="explanation-content">
        {explanation.map((paragraph, index) => (
          <div key={index} className="explanation-item">
            <span className="explanation-number">{index + 1}</span>
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explanation