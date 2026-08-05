import { useMemo } from 'react'
import Ground from './Ground'
import SceneLighting from './SceneLighting'
import { PropInstance } from './Props'
import { mulberry32, hashSeed, layoutPositions, BOUNDS } from './rng'

const DENSITY_MULTIPLIER = { sparse: 0.5, moderate: 1, dense: 1.7 }

export default function SceneGenerator({ spotId, ambiance }) {
  const instances = useMemo(() => {
    const rng = mulberry32(hashSeed(spotId))
    const mult = DENSITY_MULTIPLIER[ambiance.density] ?? 1
    const out = []
    ambiance.props.forEach((propSpec) => {
      const count = Math.max(1, Math.round(propSpec.count * mult))
      const positions = layoutPositions(ambiance.layout, count, rng)
      positions.forEach((pos) => {
        out.push({ type: propSpec.type, ...pos })
      })
    })
    return out
  }, [spotId, ambiance])

  return (
    <group>
      <SceneLighting skyMood={ambiance.skyMood} />
      <Ground groundType={ambiance.groundType} />
      {instances.map((inst, i) => (
        <PropInstance
          key={i}
          type={inst.type}
          position={{ x: inst.x, z: inst.z }}
          rotationY={inst.rotationY}
          palette={ambiance.palette}
        />
      ))}
      {/* boundary fence markers so the player has a visual edge cue */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        return (
          <mesh
            key={`edge-${i}`}
            position={[Math.cos(angle) * BOUNDS, 0.4, Math.sin(angle) * BOUNDS]}
          >
            <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        )
      })}
    </group>
  )
}
