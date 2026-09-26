import React, { useState } from 'react'

const examplePrompts = [
  'Create a flowchart explaining photosynthesis',
  'Explain the water cycle',
  'Create a diagram of the human digestive system',
  'Explain how an HTTP request works',
  'Teach me the basics of machine learning'
]

function PromptInput({ onSubmit }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (prompt.trim()) {
      onSubmit(prompt.trim())
    }
  }

  const handleExampleClick = (example) => {
    setPrompt(example)
  }

  return (
    <div
      className="prompt-section"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      {/* Futuristic background glow */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(90, 70, 255, 0.18)',
          filter: 'blur(80px)',
          top: '-100px',
          left: '-100px',
          pointerEvents: 'none'
        }}
      />

      <div className="prompt-header">

        <div
          style={{
            fontSize: '42px',
            marginBottom: '10px'
          }}
        >
          🧠
        </div>

        <h2>
          What would you like to learn today?
        </h2>

        <p>
          Ask AI to explain, visualize and test your knowledge.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="prompt-form"
      >

        <textarea
          className="prompt-textarea"
          placeholder="Enter a topic or ask me to create something amazing..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <button
          type="submit"
          className="btn-primary btn-large"
          disabled={!prompt.trim()}
        >
          ✨ Generate Learning Experience
        </button>

      </form>

      <div className="example-prompts">

        <p className="example-label">
          ⚡ Try an example
        </p>

        <div className="example-grid">

          {examplePrompts.map((example, index) => (

            <button
              key={index}
              type="button"
              className="example-chip"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </button>

          ))}

        </div>

      </div>

    </div>
  )
}

export default PromptInput 