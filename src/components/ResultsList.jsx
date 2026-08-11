import PlanEditor from './PlanEditor'
import { WALK_3D_COST } from '../lib/tokens'
import { generatePlanReport, downloadPlanReport } from '../lib/planReport'

export default function ResultsList({
  scored, explanation, prefsSummary, prefs, onPrefsChange, onEnter, onRestart, canAffordWalk,
}) {
  function handleDownloadReport() {
    const report = generatePlanReport({ prefsSummary, explanation, scored })
    downloadPlanReport(report)
  }

  return (
    <div className="results-list">
      <div className="results-list-top">
        <button className="back-button" onClick={onRestart}>
          &larr; Start over
        </button>
        <button className="report-button" onClick={handleDownloadReport}>
          Download plan report
        </button>
      </div>

      {prefsSummary && <p className="prefs-summary">"{prefsSummary}"</p>}
      {explanation && <p className="explanation">{explanation}</p>}

      {prefs && onPrefsChange && <PlanEditor prefs={prefs} onChange={onPrefsChange} />}

      <div className="cards">
        {scored.map(({ spot, score, breakdown }, i) => (
          <div key={spot.id} className={`spot-card ${i === 0 ? 'spot-card--top' : ''}`}>
            <div className="spot-card-header">
              <h3>{spot.name}</h3>
              <span className="score-badge">{(score * 100).toFixed(0)}</span>
            </div>
            <p className="tagline">{spot.tagline}</p>
            <p className="travel-time">
              ~{spot.travelTimeMinutes} min walk from city center &middot; {spot.durationHours} hr visit
            </p>
            <div className="breakdown">
              <span>match {breakdown.categoryScore.toFixed(2)}</span>
              <span>cost fit {breakdown.costScore.toFixed(2)}</span>
              <span>time fit {breakdown.timeScore.toFixed(2)}</span>
            </div>
            <button onClick={() => onEnter(spot)} disabled={!canAffordWalk}>
              Walk around {spot.name} - {WALK_3D_COST} tokens
            </button>
          </div>
        ))}
      </div>
      {!canAffordWalk && (
        <p className="error-text">Not enough tokens for a 3D walk - buy more above.</p>
      )}
    </div>
  )
}
