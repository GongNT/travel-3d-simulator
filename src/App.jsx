import { useState } from 'react'
import DestinationStep from './components/DestinationStep'
import PreferencesForm from './components/PreferencesForm'
import ResultsList from './components/ResultsList'
import TokenBalance from './components/TokenBalance'
import WalkScene from './three/WalkScene'
import { MountainSilhouette, PalmSilhouette } from './components/Decor'
import { parsePreferences } from './lib/preferences'
import { scoreSpots, explainRanking } from './lib/scoring'
import { SPOTS } from './data/spots'
import { PLAN_SEARCH_COST, WALK_3D_COST, STARTING_BALANCE, PHOTO_REVIEW_REWARD } from './lib/tokens'
import './App.css'

// Screen state machine: 'destination' -> 'form' -> 'results' -> 'walk'
export default function App() {
  const [screen, setScreen] = useState('destination')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [prefs, setPrefs] = useState(null)
  const [scored, setScored] = useState([])
  const [prefsSummary, setPrefsSummary] = useState('')
  const [activeSpot, setActiveSpot] = useState(null)
  const [balance, setBalance] = useState(STARTING_BALANCE)
  const [has3DAccess, setHas3DAccess] = useState(false)

  function handleBuyTokens(amount) {
    setBalance((b) => b + amount)
  }

  async function handlePreferences(freeText) {
    if (balance < PLAN_SEARCH_COST) return
    setLoading(true)
    setError(null)
    try {
      const parsed = await parsePreferences(freeText)
      setBalance((b) => b - PLAN_SEARCH_COST)
      const ranked = scoreSpots(parsed, SPOTS)
      setPrefs(parsed)
      setScored(ranked)
      setPrefsSummary(parsed.summary)
      setScreen('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handlePrefsChange(nextPrefs) {
    setPrefs(nextPrefs)
    setScored(scoreSpots(nextPrefs, SPOTS))
  }

  function handleRestart() {
    setScreen('destination')
    setScored([])
    setPrefs(null)
    setError(null)
  }

  function handleEnter(spot) {
    if (!has3DAccess) {
      if (balance < WALK_3D_COST) return
      setBalance((b) => b - WALK_3D_COST)
      setHas3DAccess(true)
    }
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
          <MountainSilhouette />
          <PalmSilhouette side="left" />
          <PalmSilhouette side="right" />
          <div className="app-header-top">
            <div>
              <h1>CNR - Craft N Roam</h1>
              <p className="subtitle">
                Craft your trip, get a transparent plan, then roam the top spot in 3D.
              </p>
            </div>
            <TokenBalance balance={balance} onBuy={handleBuyTokens} />
          </div>
        </header>
      )}

      {screen === 'destination' && <DestinationStep onContinue={() => setScreen('form')} />}

      {screen === 'form' && (
        <>
          <PreferencesForm onSubmit={handlePreferences} loading={loading} canAfford={balance >= PLAN_SEARCH_COST} />
          {error && <p className="error-text">{error}</p>}
        </>
      )}

      {screen === 'results' && (
        <ResultsList
          scored={scored}
          explanation={explainRanking(scored)}
          prefsSummary={prefsSummary}
          prefs={prefs}
          onPrefsChange={handlePrefsChange}
          onEnter={handleEnter}
          onRestart={handleRestart}
          canAffordWalk={has3DAccess || balance >= WALK_3D_COST}
          has3DAccess={has3DAccess}
        />
      )}

      {screen === 'walk' && activeSpot && (
        <WalkScene spot={activeSpot} onBack={handleBackFromWalk} onClaimPhotoReward={() => handleBuyTokens(PHOTO_REVIEW_REWARD)} />
      )}
    </div>
  )
}
