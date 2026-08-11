import { useState } from 'react'
import { PLAN_SEARCH_COST } from '../lib/tokens'

export default function PreferencesForm({ onSubmit, loading, canAfford }) {
  const [text, setText] = useState(
    'I have about 5 hours, a mid-range budget, and I want a relaxing trip with some good food along the way.'
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim() && !loading && canAfford) onSubmit(text.trim())
  }

  return (
    <form className="preferences-form" onSubmit={handleSubmit}>
      <label htmlFor="prefs">What are you interested in for this trip?</label>
      <textarea
        id="prefs"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="e.g. Cheap, adventurous, I have 3 hours and love hiking with a view"
      />
      <button type="submit" disabled={loading || !canAfford}>
        {loading ? 'Thinking...' : `Generate my plan - ${PLAN_SEARCH_COST} tokens`}
      </button>
      {!canAfford && <p className="error-text">Not enough tokens - buy more above.</p>}
    </form>
  )
}
