import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import SceneGenerator from './SceneGenerator'
import WalkController from './WalkController'
import { extractAmbiance } from '../lib/ambiance'
import { PHOTO_REVIEW_REWARD, PHOTO_REVIEW_MIN_PHOTOS } from '../lib/tokens'

export default function WalkScene({ spot, onBack, onClaimPhotoReward }) {
  const [ambiance, setAmbiance] = useState(null)
  const [error, setError] = useState(null)
  const [locked, setLocked] = useState(false)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setAmbiance(null)
    setError(null)
    extractAmbiance(spot)
      .then((result) => {
        if (!cancelled) setAmbiance(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [spot])

  return (
    <div className="walk-scene">
      <button className="back-button" onClick={onBack}>
        &larr; Back to results
      </button>

      {ambiance && !rewardClaimed && (
        <button
          className="photo-reward-button"
          onClick={() => {
            setRewardClaimed(true)
            onClaimPhotoReward?.()
          }}
        >
          Share {PHOTO_REVIEW_MIN_PHOTOS} photos + a review (+{PHOTO_REVIEW_REWARD} tokens)
        </button>
      )}
      {rewardClaimed && (
        <p className="photo-reward-thanks">Thanks! +{PHOTO_REVIEW_REWARD} tokens added (demo).</p>
      )}

      {error && (
        <div className="scene-overlay">
          <p className="error-text">Couldn't generate the scene: {error}</p>
        </div>
      )}

      {!error && !ambiance && (
        <div className="scene-overlay">
          <p>Reading reviews for {spot.name} and building the scene...</p>
        </div>
      )}

      {ambiance && (
        <>
          {!locked && (
            <div className="scene-overlay scene-overlay--hint">
              <p>{spot.name}</p>
              <p className="mood-text">{ambiance.moodSummary}</p>
              <p className="hint-text">Click to look around - WASD to walk, Esc to release</p>
            </div>
          )}
          <Canvas shadows camera={{ fov: 70 }}>
            <SceneGenerator spotId={spot.id} ambiance={ambiance} />
            <WalkController onLockChange={setLocked} />
          </Canvas>
        </>
      )}
    </div>
  )
}
