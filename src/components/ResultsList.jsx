import PlanEditor from './PlanEditor'
import ConciergeChat from './ConciergeChat'
import { WALK_3D_COST } from '../lib/tokens'
import { generatePlanReportPDF, downloadPlanReportPDF } from '../lib/planReport'

export default function ResultsList({
  scored, explanation, prefsSummary, prefs, onPrefsChange, onEnter, onRestart, canAffordWalk, has3DAccess, balance,
}) {
  function handleDownloadReport() {
    const doc = generatePlanReportPDF({ prefsSummary, explanation, scored, prefs })
    downloadPlanReportPDF(doc)
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

      <ConciergeChat
        prefs={prefs}
        onPrefsChange={onPrefsChange}
        scored={scored}
        onEnter={onEnter}
        balance={balance}
        has3DAccess={has3DAccess}
        onDownloadReport={handleDownloadReport}
      />

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
              {has3DAccess
                ? `Walk around ${spot.name}`
                : `Walk around ${spot.name} - ${WALK_3D_COST} tokens (unlocks all spots)`}
            </button>
          </div>
        ))}
      </div>
      {!has3DAccess && !canAffordWalk && (
        <p className="error-text">Not enough tokens for 3D access - buy more above.</p>
      )}
      {has3DAccess && (
        <p className="unlock-note">3D walk unlocked for every spot this session.</p>
      )}
    </div>
  )
}
