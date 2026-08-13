// Deterministic seeded PRNG + layout algorithms. The LLM only picks
// counts/types/enums (see ambiance.js); actual 3D placement is computed here
// so it's stable and collision-free-ish, not hallucinated coordinates.

export function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

const BOUNDS = 18 // walkable area is roughly [-BOUNDS, BOUNDS] on x/z

export function layoutPositions(layout, count, rng) {
  switch (layout) {
    case 'linedPath':
      return linedPath(count, rng)
    case 'radialCluster':
      return radialCluster(count, rng)
    case 'perimeter':
      return perimeter(count, rng)
    case 'narrowAlley':
      return narrowAlley(count, rng)
    case 'scatter':
    default:
      return scatter(count, rng)
  }
}

function scatter(count, rng) {
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({
      x: (rng() * 2 - 1) * BOUNDS,
      z: (rng() * 2 - 1) * BOUNDS,
      rotationY: rng() * Math.PI * 2,
    })
  }
  return out
}

function linedPath(count, rng) {
  // Two lines flanking a central walkway along the z axis.
  const out = []
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const t = Math.floor(i / 2) / Math.max(1, Math.ceil(count / 2) - 1)
    out.push({
      x: side * (5 + rng() * 2),
      z: (t * 2 - 1) * BOUNDS,
      rotationY: rng() * Math.PI * 2,
    })
  }
  return out
}

function radialCluster(count, rng) {
  const out = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rng() * 0.3
    const radius = 4 + rng() * 8
    out.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      rotationY: rng() * Math.PI * 2,
    })
  }
  return out
}

function narrowAlley(count, rng) {
  // A tight two-sided street canyon (buildings almost facing each other),
  // for dense old-town alleys - much closer than linedPath's open street.
  const out = []
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const t = Math.floor(i / 2) / Math.max(1, Math.ceil(count / 2) - 1)
    out.push({
      x: side * (2.4 + rng() * 0.8),
      z: (t * 2 - 1) * BOUNDS,
      rotationY: side === -1 ? Math.PI / 2 : -Math.PI / 2,
    })
  }
  return out
}

function perimeter(count, rng) {
  const out = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const radius = BOUNDS - 1 + rng() * 1.5
    out.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      rotationY: -angle + Math.PI / 2,
    })
  }
  return out
}

export { BOUNDS }
