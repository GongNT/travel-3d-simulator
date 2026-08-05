import { useState } from 'react'
import PreferencesForm from './components/PreferencesForm'
import ResultsList from './components/ResultsList'
import WalkScene from './three/WalkScene'
import { parsePreferences } from './lib/preferences'
import { scoreSpots, explainRanking } from './lib/scoring'
import { SPOTS } from './data/spots'
import './App.css'

// Simple screen state machine: 'form' -> 'results' -> 'walk'
export default function App() {
  const [screen, setScreen] = useState('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scored, setScored] = useState([])
  const [prefsSummary, setPrefsSummary] = useState('')
  const [activeSpot, setActiveSpot] = useState(null)

  async function handlePreferences(freeText) {
    setLoading(true)
    setError(null)
    try {
      const prefs = await parsePreferences(freeText)
      const ranked = scoreSpots(prefs, SPOTS)
      setScored(ranked)
      setPrefsSummary(prefs.summary)
      setScreen('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleRestart() {
    setScreen('form')
    setScored([])
    setError(null)
  }

  function handleEnter(spot) {
    setActiveSpot(spot)
    setScreen('walk')
  }

  function handleBackFromWalk() {
    setActiveSpot(null)
    setScreen('results')
  }

  return (
    <div className="app">
      {screen !== 'walk' && (
        <header className="app-header">
          <h1>Nice, France - AI Travel & Walk Simulator</h1>
          <p className="subtitle">
            Describe your trip, get a ranked recommendation, then walk the top spot in 3D.
          </p>
        </header>
      )}

      {screen === 'form' && (
        <>
          <PreferencesForm onSubmit={handlePreferences} loading={loading} />
          {error && <p className="error-text">{error}</p>}
        </>
      )}

      {screen === 'results' && (
        <ResultsList
          scored={scored}
          explanation={explainRanking(scored)}
          prefsSummary={prefsSummary}
          onEnter={handleEnter}
          onRestart={handleRestart}
        />
      )}

      {screen === 'walk' && activeSpot && (
        <WalkScene spot={activeSpot} onBack={handleBackFromWalk} />
      )}
    </div>
  )
}
