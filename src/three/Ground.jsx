import { useMemo } from 'react'
import * as THREE from 'three'
import { BOUNDS } from './rng'

const GROUND_COLORS = {
  sand: { base: '#e3cd9a', speckle: '#d1b573' },
  cobblestone: { base: '#9a9488', speckle: '#7c766c' },
  grass: { base: '#5e8f4f', speckle: '#4a7440' },
  stonePlaza: { base: '#c7bfae', speckle: '#a89f8c' },
  harborDeck: { base: '#8a6640', speckle: '#6e5030' },
}

function makeGroundTexture(groundType) {
  const { base, speckle } = GROUND_COLORS[groundType] ?? GROUND_COLORS.stonePlaza
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = speckle
  if (groundType === 'harborDeck') {
    for (let y = 0; y < size; y += 16) {
      ctx.fillRect(0, y, size, 2)
    }
  } else if (groundType === 'cobblestone' || groundType === 'stonePlaza') {
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.beginPath()
      ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.fillRect(x, y, 2, 2)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(BOUNDS, BOUNDS)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function Ground({ groundType }) {
  const texture = useMemo(() => makeGroundTexture(groundType), [groundType])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[BOUNDS * 2 + 4, BOUNDS * 2 + 4]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
