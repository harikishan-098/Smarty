function QuestionCard({ question, selectedAnswer, onAnswer }) {
  if (!question) return null;

  const options = question.options || [];

  return (
    <div className="question-card">
      <h3>{question.question}</h3>

      <div className="question-options">
  {options.map((option, index) => (
    <button
      key={index}
      type="button"
      className={`option-button ${
        selectedAnswer === option ? "selected" : ""
      }`}
      onClick={() => onAnswer(option)}
    >
      <span className="option-letter">
        {String.fromCharCode(65 + index)}
      </span>

      <span className="option-text">
        {option}
      </span>
    </button>
  ))}
</div>
</div>
);
}
export default QuestionCard;