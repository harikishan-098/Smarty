function ScoreCard({ score, total }) {
  return (
    <div className="score-card">
      <h2>Practice Complete 🎉</h2>
      <p>
        Score: <strong>{score}</strong> / {total}
      </p>
    </div>
  );
}

export default ScoreCard;