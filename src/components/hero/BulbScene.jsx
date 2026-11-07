import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { usePower } from '../../store/power'
import { useUI } from '../../store/ui'
import { bus } from '../../lib/lightBus'
import { sound } from '../../lib/sound'

const MAX_INTENSITY = 46
const OFF_FILAMENT = new THREE.Color('#2b170a')
const ON_FILAMENT = new THREE.Color('#ffe3b0')

/* ---------- geometry helpers ---------- */

function bulbProfile() {
  const pts = []
  for (let a = -90; a <= 38; a += 3) {
    const r = (a * Math.PI) / 180
    pts.push(new THREE.Vector2(Math.max(0.0001, 0.95 * Math.cos(r)), -0.2 + 0.95 * Math.sin(r)))
  }
  ;[[0.62, 0.56], [0.47, 0.76], [0.38, 0.92], [0.34, 1.05], [0.34, 1.12]].forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)))
  return pts
}

function socketProfile() {
  const pts = [new THREE.Vector2(0.0001, 1.1)]
  for (let y = 1.1; y <= 1.55; y += 0.012) pts.push(new THREE.Vector2(0.355 + 0.02 * Math.sin(y * 70), y))
  pts.push(new THREE.Vector2(0.4, 1.56), new THREE.Vector2(0.0001, 1.56))
  return pts
}

function filamentCurve() {
  const pts = []
  const turns = 22
  for (let i = 0; i <= 260; i++) {
    const t = i / 260
    const x = THREE.MathUtils.lerp(-0.26, 0.26, t)
    const y = 0.18 - Math.pow(2 * t - 1, 2) * 0.0 - Math.sin(t * Math.PI) * 0.1
    const w = t * turns * Math.PI * 2
    pts.push(new THREE.Vector3(x, y + Math.sin(w) * 0.026, Math.cos(w) * 0.026))
  }
  return new THREE.CatmullRomCurve3(pts)
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,.55)')
  grd.addColorStop(0.6, 'rgba(255,255,255,.12)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Wire({ from, to, radius = 0.008, color = '#8b6a3e' }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    return {
      pos: a.clone().add(b).multiplyScalar(0.5),
      len: dir.length(),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
    }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <cylinderGeometry args={[radius, radius, len, 8]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.4} />
    </mesh>
  )
}

/* ---------- the pendant bulb ---------- */

function PendantBulb({ compact }) {
  const bulbOn = usePower((s) => s.bulbOn)
  const setCursor = useUI((s) => s.setCursor)
  const { camera, gl, pointer } = useThree()

  const swing = useRef({ a: 0, w: 0 })
  const k = useRef(0) // eased 0..1 light level
  const flick = useRef(0)
  const pivot = useRef()
  const anchor = useRef()
  const light = useRef()
  const filMat = useRef()
  const glassMat = useRef()
  const sprite1 = useRef()
  const sprite2 = useRef()
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const bulbPts = useMemo(bulbProfile, [])
  const socketPts = useMemo(socketProfile, [])
  const filament = useMemo(() => new THREE.TubeGeometry(filamentCurve(), 320, 0.0055, 6, false), [])
  const glow = useMemo(glowTexture, [])

  useEffect(() => {
    bus.canvas = gl.domElement
    return () => {
      bus.canvas = null
      bus.intensity = 0
      document.body.style.cursor = ''
    }
  }, [gl])

  // restart the ignition flicker whenever the state flips on
  useEffect(() => {
    flick.current = 0
  }, [bulbOn])

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const t = state.clock.elapsedTime

    // --- pendulum (damped spring) with a faint breeze
    const s = swing.current
    s.w += (-16 * s.a - 1.0 * s.w + Math.sin(t * 0.7) * 0.05) * dt
    s.a += s.w * dt
    pivot.current.rotation.z = s.a

    // --- light level: eased toward target, with an ignition flicker
    flick.current += dt
    let target = bulbOn ? 1 : 0
    if (bulbOn) {
      const f = flick.current
      if (f < 0.55) target = f < 0.08 ? 0.9 : f < 0.16 ? 0.05 : f < 0.26 ? 1 : f < 0.34 ? 0.25 : f < 0.42 ? 1 : 0.7
    }
    k.current += (target - k.current) * (1 - Math.exp(-(target > k.current ? 26 : 9) * dt))
    const v = k.current
    bus.intensity = v

    light.current.intensity = v * MAX_INTENSITY
    filMat.current.color.copy(OFF_FILAMENT).lerp(ON_FILAMENT, v).multiplyScalar(1 + v * 1.6)
    glassMat.current.emissiveIntensity = v * 0.28
    sprite1.current.material.opacity = v * 0.95
    sprite1.current.scale.setScalar(3.2 + v * 2.8)
    sprite2.current.material.opacity = v * 0.22
    sprite2.current.scale.setScalar(9 + v * 3)

    // --- camera parallax (subtle depth)
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.2 - camera.position.y) * 0.04
    camera.lookAt(0, compact ? -0.9 : 0, 0)

    // --- publish bulb screen position for DOM lighting
    anchor.current.getWorldPosition(tmp)
    tmp.project(camera)
    bus.nx = tmp.x
    bus.ny = tmp.y
  })

  const press = (e) => {
    e.stopPropagation()
    sound.unlock()
    const next = !usePower.getState().bulbOn
    usePower.getState().toggleBulb()
    sound.bulb(next)
    swing.current.w += (e.point.x >= 0 ? -1 : 1) * 1.15
  }

  const over = (e) => {
    e.stopPropagation()
    setCursor('bulb')
    if (window.matchMedia('(pointer: fine)').matches) document.body.style.cursor = 'none'
    swing.current.w += 0.25
    sound.tick()
  }
  const out = () => {
    setCursor('default')
    document.body.style.cursor = ''
  }

  return (
    <group position={[0, compact ? -0.9 : 0, 0]} scale={compact ? 0.82 : 1}>
      {/* pivot is high above frame so the swing is a long, natural arc */}
      <group ref={pivot} position={[0, 6, 0]}>
        <group position={[0, -6, 0]}>
          {/* cord */}
          <mesh position={[0, 3.6, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 4.2, 12]} />
            <meshStandardMaterial color="#0d0d0f" roughness={0.6} />
          </mesh>
          {/* socket cap */}
          <mesh position={[0, 1.78, 0]} castShadow>
            <cylinderGeometry args={[0.43, 0.43, 0.46, 40]} />
            <meshStandardMaterial color="#0c0c0e" roughness={0.45} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.58, 0]} castShadow>
            <cylinderGeometry args={[0.46, 0.4, 0.06, 40]} />
            <meshStandardMaterial color="#c9a45c" metalness={1} roughness={0.28} />
          </mesh>
          {/* threaded metal base */}
          <mesh castShadow>
            <latheGeometry args={[socketPts, 64]} />
            <meshStandardMaterial color="#b9bec7" metalness={1} roughness={0.32} />
          </mesh>

          {/* glass */}
          <mesh>
            <latheGeometry args={[bulbPts, 96]} />
            <meshPhysicalMaterial
              ref={glassMat}
              color="#ffffff"
              transmission={1}
              thickness={0.55}
              roughness={0.035}
              ior={1.5}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={1.4}
              emissive="#ffb45c"
              emissiveIntensity={0}
              transparent
            />
          </mesh>

          {/* internals */}
          <group>
            <mesh position={[0, 0.78, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.62, 12]} />
              <meshStandardMaterial color="#d9e4ec" roughness={0.2} transparent opacity={0.6} />
            </mesh>
            <Wire from={[-0.06, 1.1, 0]} to={[-0.26, 0.17, 0]} />
            <Wire from={[0.06, 1.1, 0]} to={[0.26, 0.17, 0]} />
            <mesh geometry={filament}>
              <meshBasicMaterial ref={filMat} color="#2b170a" toneMapped={false} />
            </mesh>
            <pointLight
              ref={light}
              position={[0, 0.12, 0]}
              color="#ffb36b"
              intensity={0}
              decay={2}
              castShadow
              shadow-mapSize={[512, 512]}
              shadow-bias={-0.0008}
              shadow-radius={8}
            />
          </group>

          {/* glow halos */}
          <sprite ref={sprite1} position={[0, 0.1, -0.25]}>
            <spriteMaterial map={glow} color="#ffb45c" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
          <sprite ref={sprite2} position={[0, 0.1, -0.6]}>
            <spriteMaterial map={glow} color="#ff9a3c" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>

          <object3D ref={anchor} position={[0, 0.05, 0]} />

          {/* generous invisible hit area (3D "button") */}
          <mesh position={[0, 0.35, 0]} onPointerOver={over} onPointerOut={out} onClick={press}>
            <sphereGeometry args={[1.25, 24, 24]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Wall() {
  return (
    <mesh position={[0, 0, -2.6]} receiveShadow>
      <planeGeometry args={[26, 16]} />
      <meshStandardMaterial color="#8e929c" roughness={1} metalness={0} />
    </mesh>
  )
}

function Atmosphere() {
  const on = usePower((s) => s.bulbOn)
  return (
    <Sparkles
      count={46}
      scale={[8, 5, 3]}
      size={2.4}
      speed={0.22}
      opacity={on ? 0.55 : 0.25}
      color={on ? '#ffc680' : '#7fb2ff'}
      position={[0, 0, -0.6]}
    />
  )
}

export default function BulbScene({ active = true }) {
  const [dpr, setDpr] = useState(1.75)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 719px)')
    const f = () => setCompact(mq.matches)
    f()
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  return (
    <Canvas
      shadows="soft"
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 7.6], fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      style={{ touchAction: 'pan-y' }}
      aria-label="Interactive 3D light bulb"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[-5, 3, 4]} intensity={0.55} color="#9db8ff" />
      <directionalLight position={[5, -2, 3]} intensity={0.25} color="#ffd9a8" />
      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={2.2} position={[-4, 2, 3]} scale={[4, 6, 1]} color="#bcd6ff" />
        <Lightformer form="rect" intensity={1.2} position={[4, -1, 3]} scale={[3, 5, 1]} color="#ffd9a8" />
        <Lightformer form="ring" intensity={1.6} position={[0, 4, -2]} scale={3} />
      </Environment>
      <Wall />
      <PendantBulb compact={compact} />
      <Atmosphere />
    </Canvas>
  )
}
