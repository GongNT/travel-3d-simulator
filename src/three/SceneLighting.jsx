import { Sky } from '@react-three/drei'

const MOOD_CONFIG = {
  sunnyBlue: { sunPosition: [10, 12, 5], intensity: 1.4, ambient: 0.6, hemi: '#bcd9ff' },
  goldenHour: { sunPosition: [30, 3, 10], intensity: 1.1, ambient: 0.5, hemi: '#ffd9a0' },
  overcast: { sunPosition: [5, 20, -5], intensity: 0.6, ambient: 0.7, hemi: '#c9c9c9' },
  twilight: { sunPosition: [-20, 1.5, -10], intensity: 0.4, ambient: 0.35, hemi: '#6a6fa0' },
}

export default function SceneLighting({ skyMood }) {
  const cfg = MOOD_CONFIG[skyMood] ?? MOOD_CONFIG.sunnyBlue

  return (
    <>
      <Sky sunPosition={cfg.sunPosition} turbidity={6} rayleigh={1.5} />
      <hemisphereLight args={[cfg.hemi, '#3a3a3a', cfg.ambient]} />
      <directionalLight
        position={cfg.sunPosition}
        intensity={cfg.intensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </>
  )
}
