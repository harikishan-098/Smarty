import React, { useState } from 'react'
import QuestionCard from './QuestionCard'
import ScoreCard from './ScoreCard'

function PracticeQuestions({ questions, topicTitle }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showScore, setShowScore] = useState(false)

  const handleAnswer = (questionIndex, selectedOption, isCorrect) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { selectedOption, isCorrect }
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowScore(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowScore(false)
  }

  const calculateScore = () => {
    return Object.values(answers).filter(a => a.isCorrect).length
  }

  if (showScore) {
    return (
      <ScoreCard
        score={calculateScore()}
        total={questions.length}
        onReset={handleReset}
        topicTitle={topicTitle}
      />
    )
  }

  return (
    <div id="practice-section"
    className="practice-section">
      <div className="practice-header">
        <h3>✍️ Practice Questions</h3>
        <p>Test your understanding with {questions.length} questions</p>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <QuestionCard
  question={questions[currentQuestionIndex]}
  questionNumber={currentQuestionIndex + 1}
  totalQuestions={questions.length}
  selectedAnswer={answers[currentQuestionIndex]?.selectedOption}
  onAnswer={(selectedOption) => {
    const correctAnswer =
      questions[currentQuestionIndex].answer;

    const isCorrect =
      selectedOption === correctAnswer;

    handleAnswer(
      currentQuestionIndex,
      selectedOption,
      isCorrect
    );
  }}
/>

      <div className="question-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary"
        >
          ← Previous
        </button>
        
        <span className="question-counter">
          {currentQuestionIndex + 1} / {questions.length}
        </span>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestionIndex]}
          className="btn-primary"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

export default PracticeQuestions