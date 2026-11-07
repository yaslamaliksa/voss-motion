/**
 * Light engine.
 *
 * The 3D bulb writes its screen position + intensity into `bus` every frame (no React
 * re-render). One rAF loop reads that and drives every registered DOM surface through
 * transform/opacity only -> compositor-friendly, no layout, no paint.
 *
 * A "lit surface" has three parts:
 *   root   - measured element
 *   shadow - blurred dark layer pushed AWAY from the bulb (cast shadow)
 *   sheen  - soft radial highlight that tracks the bulb position (key light)
 */
export const bus = {
  x: 0, // bulb centre in viewport px
  y: 0,
  intensity: 0, // 0..1 (eased in the 3D scene)
  ambient: null, // fixed full-screen glow element
  canvas: null, // hero canvas element (for projecting NDC -> px)
  nx: 0,
  ny: 0,
}

const surfaces = new Set()
let dirty = true
let running = false
let lastWasZero = false
const rects = new Map()

export function markDirty() {
  dirty = true
}

export function registerSurface(s) {
  surfaces.add(s)
  dirty = true
  start()
  return () => {
    surfaces.delete(s)
    rects.delete(s)
  }
}

function measure() {
  for (const s of surfaces) rects.set(s, s.root.getBoundingClientRect())
  dirty = false
}

const SHEEN = 460 // px, must match the .sheen size in <LitSurface/>

function frame() {
  const k = bus.intensity
  // project canvas NDC to viewport px (canvas rect is cheap: one read)
  if (bus.canvas) {
    const r = bus.canvas.getBoundingClientRect()
    bus.x = r.left + (bus.nx * 0.5 + 0.5) * r.width
    bus.y = r.top + (-bus.ny * 0.5 + 0.5) * r.height
  }

  if (k < 0.002) {
    if (!lastWasZero) {
      for (const s of surfaces) {
        s.shadow.style.opacity = '0'
        s.sheen.style.opacity = '0'
      }
      if (bus.ambient) bus.ambient.style.opacity = '0'
      lastWasZero = true
    }
    requestAnimationFrame(frame)
    return
  }
  lastWasZero = false
  if (dirty) measure()

  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxD = Math.hypot(vw, vh) * 0.9

  for (const s of surfaces) {
    const r = rects.get(s)
    if (!r) continue
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    // skip off-screen surfaces (but keep them zeroed cheaply)
    if (r.bottom < -200 || r.top > vh + 200) continue
    const dx = cx - bus.x
    const dy = cy - bus.y
    const dist = Math.hypot(dx, dy) || 1
    const fall = Math.max(0, 1 - dist / maxD)
    const nx = dx / dist
    const ny = dy / dist
    // shadow is pushed away from the bulb; farther = longer + softer
    const push = 10 + (dist / maxD) * 46
    s.shadow.style.transform = `translate3d(${(nx * push).toFixed(1)}px, ${(ny * push).toFixed(1)}px, 0) scale(${(0.96 + fall * 0.05).toFixed(3)})`
    s.shadow.style.opacity = (k * (0.35 + fall * 0.65)).toFixed(3)
    // sheen is a light pool centred on the bulb, projected into the card
    const sx = bus.x - r.left - SHEEN / 2
    const sy = bus.y - r.top - SHEEN / 2
    s.sheen.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`
    s.sheen.style.opacity = (k * Math.min(1, fall * 1.6)).toFixed(3)
  }

  if (bus.ambient) {
    const size = bus.ambient.offsetWidth
    bus.ambient.style.transform = `translate3d(${(bus.x - size / 2).toFixed(1)}px, ${(bus.y - size / 2).toFixed(1)}px, 0)`
    bus.ambient.style.opacity = k.toFixed(3)
  }
  requestAnimationFrame(frame)
}

function start() {
  if (running || typeof window === 'undefined') return
  running = true
  window.addEventListener('resize', markDirty, { passive: true })
  window.addEventListener('scroll', markDirty, { passive: true })
  requestAnimationFrame(frame)
}
