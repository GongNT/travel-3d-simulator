export default function ResultsList({ scored, explanation, prefsSummary, onEnter, onRestart }) {
  return (
    <div className="results-list">
      <button className="back-button" onClick={onRestart}>
        &larr; Start over
      </button>

      {prefsSummary && <p className="prefs-summary">"{prefsSummary}"</p>}
      {explanation && <p className="explanation">{explanation}</p>}

      <div className="cards">
        {scored.map(({ spot, score, breakdown }, i) => (
          <div key={spot.id} className={`spot-card ${i === 0 ? 'spot-card--top' : ''}`}>
            <div className="spot-card-header">
              <h3>{spot.name}</h3>
              <span className="score-badge">{(score * 100).toFixed(0)}</span>
            </div>
            <p className="tagline">{spot.tagline}</p>
            <div className="breakdown">
              <span>match {breakdown.categoryScore.toFixed(2)}</span>
              <span>cost fit {breakdown.costScore.toFixed(2)}</span>
              <span>time fit {breakdown.timeScore.toFixed(2)}</span>
            </div>
            <button onClick={() => onEnter(spot)}>Walk around {spot.name}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
