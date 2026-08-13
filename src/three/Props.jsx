// Stylized low-poly prop components built from primitive Three.js geometry.
// Each takes { position, rotationY, palette } and is purely presentational -
// placement/counts are decided by SceneGenerator using layout + ambiance data.

function PalmTree() {
  // Tall, thin trunk with a slight lean and a compact frond burst at the top -
  // closer to the Washingtonia palms lining the real Promenade des Anglais
  // than a short bushy cartoon palm.
  return (
    <group rotation={[0, 0, 0.05]}>
      <mesh position={[0, 2.75, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.13, 5.5, 6]} />
        <meshStandardMaterial color="#8a7455" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[0, 5.5, 0]}
          rotation={[1.1, (i / 6) * Math.PI * 2, 0]}
          castShadow
        >
          <coneGeometry args={[0.18, 1.9, 4]} />
          <meshStandardMaterial color="#3f8a4f" />
        </mesh>
      ))}
    </group>
  )
}

function PineTree() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
        <meshStandardMaterial color="#6b4a30" />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.9, 2.2, 7]} />
        <meshStandardMaterial color="#245c3a" />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <coneGeometry args={[0.6, 1.4, 7]} />
        <meshStandardMaterial color="#2e6f45" />
      </mesh>
    </group>
  )
}

function BeachChair({ palette }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.05, 1.4]} />
        <meshStandardMaterial color={palette.accent} />
      </mesh>
      <mesh position={[0, 0.05, 0.65]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.3]} />
        <meshStandardMaterial color={palette.accent} />
      </mesh>
    </group>
  )
}

function StoneBuilding({ palette }) {
  const height = 3 + ((Math.random() * 10) % 3)
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, height, 3]} />
        <meshStandardMaterial color={palette.primary} />
      </mesh>
      <mesh position={[0, height + 0.2, 0]} castShadow>
        <boxGeometry args={[3.3, 0.4, 3.3]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      {[[-0.8, 0.4], [0.8, 0.4], [-0.8, -0.4], [0.8, -0.4]].map(([dx, dy], i) => (
        <mesh key={i} position={[dx, height * 0.5 + dy, 1.51]}>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial color={palette.accent} />
        </mesh>
      ))}
    </group>
  )
}

function FacadeBuilding({ palette }) {
  // A tall, narrow old-town facade with rows of shuttered windows and a
  // small wrought-iron-style balcony ledge - denser and more detailed than
  // the plain StoneBuilding, for tight historic streets.
  const height = 5.5 + ((Math.random() * 10) % 2.5)
  const floors = 3
  const shutterColor = palette.secondary
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, height, 2.6]} />
        <meshStandardMaterial color={palette.primary} />
      </mesh>
      {/* flat roof cap */}
      <mesh position={[0, height + 0.15, 0]} castShadow>
        <boxGeometry args={[2.85, 0.3, 2.85]} />
        <meshStandardMaterial color="#3a3630" />
      </mesh>
      {/* rows of shuttered windows on the front face */}
      {Array.from({ length: floors }).map((_, floor) =>
        [-0.7, 0.7].map((dx, i) => (
          <group key={`${floor}-${i}`}>
            <mesh
              position={[dx, 1.1 + floor * 1.5, 1.31]}
            >
              <boxGeometry args={[0.55, 0.85, 0.06]} />
              <meshStandardMaterial color={shutterColor} />
            </mesh>
            {/* balcony ledge under ground-floor-and-up windows */}
            {floor > 0 && (
              <mesh position={[dx, 0.68 + floor * 1.5, 1.42]}>
                <boxGeometry args={[0.7, 0.06, 0.22]} />
                <meshStandardMaterial color="#2b2b2b" />
              </mesh>
            )}
          </group>
        )),
      )}
    </group>
  )
}

function StripedAwning({ palette }) {
  // A cafe/market-front awning: angled canopy in alternating accent/white
  // stripes over a small storefront box, like the terraces lining Vieux Nice.
  const stripeCount = 5
  return (
    <group>
      <mesh position={[0, 0.6, -0.3]}>
        <boxGeometry args={[1.6, 1.2, 0.6]} />
        <meshStandardMaterial color={palette.primary} />
      </mesh>
      <group position={[0, 1.35, 0.35]} rotation={[0.35, 0, 0]}>
        {Array.from({ length: stripeCount }).map((_, i) => (
          <mesh key={i} position={[-0.8 + (i + 0.5) * (1.6 / stripeCount), 0, 0]} castShadow>
            <boxGeometry args={[1.6 / stripeCount, 0.05, 0.9]} />
            <meshStandardMaterial color={i % 2 === 0 ? palette.accent : '#f4ede0'} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function BellTower({ palette }) {
  // A slim Provencal-style clock/bell tower - generic silhouette (square
  // shaft, round clock face, peaked cap), not a reconstruction of any one
  // real building.
  return (
    <group>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[1.4, 6, 1.4]} />
        <meshStandardMaterial color={palette.primary} />
      </mesh>
      <mesh position={[0, 6.2, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 1.6]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      {/* clock face */}
      <mesh position={[0, 5.2, 0.71]}>
        <circleGeometry args={[0.4, 16]} />
        <meshStandardMaterial color="#f4ede0" />
      </mesh>
      <mesh position={[0, 7.1, 0]} castShadow>
        <coneGeometry args={[1.1, 1.3, 4]} />
        <meshStandardMaterial color={palette.accent} />
      </mesh>
      <mesh position={[0, 7.9, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function StringLights({ palette }) {
  // A simple sagging line of warm bulbs strung between two poles, echoing
  // the string lights common over Vieux Nice's evening alleys.
  const bulbCount = 7
  return (
    <group>
      {[-1.6, 1.6].map((dx, i) => (
        <mesh key={i} position={[dx, 1.75, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3.5, 6]} />
          <meshStandardMaterial color="#3a3630" />
        </mesh>
      ))}
      {Array.from({ length: bulbCount }).map((_, i) => {
        const t = i / (bulbCount - 1)
        const x = -1.6 + t * 3.2
        const sag = Math.sin(t * Math.PI) * 0.35
        return (
          <mesh key={i} position={[x, 3.4 - sag, 0]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial
              color={palette.accent}
              emissive={palette.accent}
              emissiveIntensity={0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function MarketStall({ palette }) {
  return (
    <group>
      {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.75, dz]}>
          <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
          <meshStandardMaterial color="#5c4326" />
        </mesh>
      ))}
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
        <meshStandardMaterial color={palette.accent} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.6, 1.5]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
    </group>
  )
}

function FlowerStall({ palette }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 0.6, 0.8]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 1.2,
            0.85 + Math.random() * 0.2,
            (Math.random() - 0.5) * 0.6,
          ]}
        >
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? palette.accent : palette.primary} />
        </mesh>
      ))}
    </group>
  )
}

function Lantern() {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffb84d" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function Bench({ palette }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.1, 0.5]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      <mesh position={[0.6, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.6, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function Fountain({ palette }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 16]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.1, 16]} />
        <meshStandardMaterial color="#4a90c4" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.2, 1, 8]} />
        <meshStandardMaterial color={palette.accent} />
      </mesh>
    </group>
  )
}

function CastleRuinWall({ palette }) {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 1.1 - 1.1, 0.7 + (i % 2) * 0.3, 0]} castShadow>
          <boxGeometry args={[1, 1.4 + (i % 2) * 0.6, 0.8]} />
          <meshStandardMaterial color={palette.secondary} />
        </mesh>
      ))}
    </group>
  )
}

function Sailboat({ palette }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.6, 0.4, 1.8]} />
        <meshStandardMaterial color="#f2f2ec" />
      </mesh>
      <mesh position={[0, 1.2, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 6]} />
        <meshStandardMaterial color="#8a6640" />
      </mesh>
      <mesh position={[0.35, 1.1, 0.2]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.5, 1.5, 3]} />
        <meshStandardMaterial color={palette.accent} side={2} />
      </mesh>
    </group>
  )
}

function CafeTable({ palette }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 12]} />
        <meshStandardMaterial color={palette.primary} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {[0.5, -0.5].map((dx, i) => (
        <mesh key={i} position={[dx, 0.25, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.3]} />
          <meshStandardMaterial color={palette.accent} />
        </mesh>
      ))}
    </group>
  )
}

function Archway({ palette }) {
  return (
    <group>
      <mesh position={[-0.9, 1.2, 0]}>
        <boxGeometry args={[0.4, 2.4, 0.6]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      <mesh position={[0.9, 1.2, 0]}>
        <boxGeometry args={[0.4, 2.4, 0.6]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[2.2, 0.4, 0.6]} />
        <meshStandardMaterial color={palette.secondary} />
      </mesh>
    </group>
  )
}

export const PROP_COMPONENTS = {
  palmTree: PalmTree,
  pineTree: PineTree,
  beachChair: BeachChair,
  stoneBuilding: StoneBuilding,
  facadeBuilding: FacadeBuilding,
  marketStall: MarketStall,
  flowerStall: FlowerStall,
  lantern: Lantern,
  bench: Bench,
  fountain: Fountain,
  castleRuinWall: CastleRuinWall,
  sailboat: Sailboat,
  cafeTable: CafeTable,
  archway: Archway,
  stripedAwning: StripedAwning,
  bellTower: BellTower,
  stringLights: StringLights,
}

export function PropInstance({ type, position, rotationY, palette }) {
  const Component = PROP_COMPONENTS[type]
  if (!Component) return null
  return (
    <group position={[position.x, 0, position.z]} rotation={[0, rotationY, 0]}>
      <Component palette={palette} />
    </group>
  )
}
