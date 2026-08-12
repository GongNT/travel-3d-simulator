import { useState } from 'react'
import { initialMessages, runConciergeTurn } from '../lib/conciergeAgent'

// Renders only user/assistant text turns - system and tool-call/tool-result
// messages stay in the underlying history for the model but aren't shown.
function displayMessages(history) {
  return history.filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content)
}

export default function ConciergeChat(context) {
  const [history, setHistory] = useState(initialMessages())
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSend(e) {
    e.preventDefault()
    const userText = text.trim()
    if (!userText || loading) return
    setText('')
    setLoading(true)
    setError(null)
    try {
      const { messages } = await runConciergeTurn(history, userText, context)
      setHistory(messages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const shown = displayMessages(history)

  return (
    <div className="concierge-chat">
      <p className="concierge-title">Ask the CNR concierge</p>
      <p className="concierge-hint">
        Try "make it cheaper", "tell me about Castle Hill", or "walk me around the market".
      </p>
      <div className="concierge-messages">
        {shown.map((m, i) => (
          <div key={i} className={`concierge-bubble concierge-bubble--${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="concierge-bubble concierge-bubble--assistant">Thinking...</div>}
      </div>
      {error && <p className="error-text">{error}</p>}
      <form className="concierge-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !text.trim()}>Send</button>
      </form>
    </div>
  )
}
