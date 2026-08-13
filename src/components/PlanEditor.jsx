const CATEGORY_LABELS = {
  relax: 'Relax',
  adventure: 'Adventure',
  culture: 'Culture',
  food: 'Food',
}

// Drives the slider's filled-track color via the --fill custom property
// (see App.css) - accent-color alone doesn't render a fill in Safari.
function fillStyle(value, min, max) {
  const pct = ((value - min) / (max - min)) * 100
  return { '--fill': `${pct}%` }
}

// Adjusts the same structured weights the LLM originally produced, then
// re-scores locally (deterministic, no API call) on every change.
export default function PlanEditor({ prefs, onChange }) {
  function update(patch) {
    onChange({ ...prefs, ...patch })
  }
  function updateCategory(key, value) {
    onChange({ ...prefs, categoryWeights: { ...prefs.categoryWeights, [key]: value } })
  }

  return (
    <div className="plan-editor">
      <p className="plan-editor-title">Fine-tune your plan</p>
      <p className="plan-editor-hint">Adjusting these re-ranks instantly - no extra tokens.</p>

      <div className="plan-editor-row">
        <label>Budget level: {prefs.budgetLevel} / 5</label>
        <input
          type="range" min="1" max="5" step="1"
          value={prefs.budgetLevel}
          style={fillStyle(prefs.budgetLevel, 1, 5)}
          onChange={(e) => update({ budgetLevel: Number(e.target.value) })}
        />
      </div>

      <div className="plan-editor-row">
        <label>Time available: {prefs.timeBudgetHours} hrs</label>
        <input
          type="range" min="1" max="12" step="1"
          value={prefs.timeBudgetHours}
          style={fillStyle(prefs.timeBudgetHours, 1, 12)}
          onChange={(e) => update({ timeBudgetHours: Number(e.target.value) })}
        />
      </div>

      <div className="plan-editor-categories">
        {Object.keys(CATEGORY_LABELS).map((key) => (
          <div className="plan-editor-row" key={key}>
            <label>{CATEGORY_LABELS[key]}: {prefs.categoryWeights[key].toFixed(2)}</label>
            <input
              type="range" min="0" max="1" step="0.05"
              value={prefs.categoryWeights[key]}
              style={fillStyle(prefs.categoryWeights[key], 0, 1)}
              onChange={(e) => updateCategory(key, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
