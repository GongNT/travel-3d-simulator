import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { BOUNDS } from './rng'

const SPEED = 6
const EYE_HEIGHT = 1.7

const KEY_MAP = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

export default function WalkController({ onLockChange }) {
  const { camera } = useThree()
  const move = useRef({ forward: false, backward: false, left: false, right: false })
  const controlsRef = useRef(null)

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, BOUNDS - 3)
  }, [camera])

  useEffect(() => {
    function onKeyDown(e) {
      const action = KEY_MAP[e.code]
      if (action) move.current[action] = true
    }
    function onKeyUp(e) {
      const action = KEY_MAP[e.code]
      if (action) move.current[action] = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    dir.y = 0
    dir.normalize()
    const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize()

    const step = new THREE.Vector3()
    if (move.current.forward) step.add(dir)
    if (move.current.backward) step.sub(dir)
    if (move.current.right) step.add(right)
    if (move.current.left) step.sub(right)

    if (step.lengthSq() > 0) {
      step.normalize().multiplyScalar(SPEED * delta)
      camera.position.add(step)
    }

    const limit = BOUNDS - 0.5
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -limit, limit)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -limit, limit)
    camera.position.y = EYE_HEIGHT
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => onLockChange?.(true)}
      onUnlock={() => onLockChange?.(false)}
    />
  )
}
