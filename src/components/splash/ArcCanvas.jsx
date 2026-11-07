import { useEffect, useRef } from 'react'

/** Midpoint-displacement lightning path. */
function bolt(x1, y1, x2, y2, disp, depth, out) {
  if (depth === 0) {
    out.push([x2, y2])
    return
  }
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp
  bolt(x1, y1, mx, my, disp / 2, depth - 1, out)
  bolt(mx, my, x2, y2, disp / 2, depth - 1, out)
}

function strokePath(ctx, pts, width, color, blur, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.shadowColor = '#4de6ff'
  ctx.shadowBlur = blur
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.stroke()
  ctx.restore()
}

/**
 * Full-screen high-voltage arc. Starts from `originRef` centre and whips out to the
 * screen edges while `active` is true. Canvas only mounted during the "arming" window.
 */
export default function ArcCanvas({ active, originRef }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    let raf
    let lastGen = 0
    let bolts = []
    let sparks = []

    const loop = (now) => {
      const t = (now - start) / 1000
      const w = window.innerWidth
      const h = window.innerHeight
      const r = originRef.current?.getBoundingClientRect()
      const ox = r ? r.left + r.width / 2 : w / 2
      const oy = r ? r.top + r.height / 2 : h / 2
      const ramp = Math.min(1, t / 0.15)

      ctx.clearRect(0, 0, w, h)

      // regenerate bolts at ~25 Hz for crackle
      if (now - lastGen > 40) {
        lastGen = now
        bolts = []
        const n = 3 + Math.floor(Math.random() * 4)
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2
          const len = (Math.max(w, h) * (0.25 + Math.random() * 0.55)) * (0.4 + t * 0.9)
          const ex = ox + Math.cos(a) * len
          const ey = oy + Math.sin(a) * len
          const pts = [[ox, oy]]
          bolt(ox, oy, ex, ey, len * 0.28, 6, pts)
          bolts.push(pts)
          // fork
          if (Math.random() > 0.4) {
            const k = pts[Math.floor(pts.length * (0.3 + Math.random() * 0.4))]
            const fa = a + (Math.random() - 0.5) * 1.4
            const fl = len * 0.4
            const fp = [k]
            bolt(k[0], k[1], k[0] + Math.cos(fa) * fl, k[1] + Math.sin(fa) * fl, fl * 0.3, 5, fp)
            bolts.push(fp)
          }
          if (Math.random() > 0.5)
            sparks.push({ x: ex, y: ey, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 1 })
        }
      }

      for (const pts of bolts) {
        strokePath(ctx, pts, 9, '#2a86ff', 30, 0.22 * ramp)
        strokePath(ctx, pts, 4, '#6fe8ff', 18, 0.75 * ramp)
        strokePath(ctx, pts, 1.6, '#ffffff', 6, 1 * ramp)
      }

      // sparks
      ctx.save()
      ctx.fillStyle = '#bff6ff'
      ctx.shadowColor = '#4de6ff'
      ctx.shadowBlur = 10
      sparks = sparks.filter((s) => s.life > 0)
      for (const s of sparks) {
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.15
        s.life -= 0.03
        ctx.globalAlpha = Math.max(0, s.life)
        ctx.fillRect(s.x, s.y, 2.2, 2.2)
      }
      ctx.restore()

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, originRef])

  if (!active) return null
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-20 h-full w-full" aria-hidden="true" />
}
