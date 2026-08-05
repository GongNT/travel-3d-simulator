import { useState } from 'react'

export default function PreferencesForm({ onSubmit, loading }) {
  const [text, setText] = useState(
    'I have about 5 hours, a mid-range budget, and I want a relaxing trip with some good food along the way.'
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim() && !loading) onSubmit(text.trim())
  }

  return (
    <form className="preferences-form" onSubmit={handleSubmit}>
      <label htmlFor="prefs">Tell us what you want out of your trip to Nice</label>
      <textarea
        id="prefs"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="e.g. Cheap, adventurous, I have 3 hours and love hiking with a view"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Thinking...' : 'Find my spot'}
      </button>
    </form>
  )
}
