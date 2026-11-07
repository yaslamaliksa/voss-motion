import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useUI } from '../../store/ui'
import { usePower } from '../../store/power'

const RING = {
  default: { scale: 1, opacity: 0.9 },
  link: { scale: 1.7, opacity: 1 },
  view: { scale: 3.4, opacity: 1 },
  bulb: { scale: 4.2, opacity: 1 },
}

/**
 * Morphing cursor (fine pointers only). Delegates on [data-cursor]; the 3D bulb hit-area
 * sets mode "bulb" directly through the store.
 */
export default function CustomCursor() {
  const mode = useUI((s) => s.cursor)
  const setCursor = useUI((s) => s.setCursor)
  const bulbOn = usePower((s) => s.bulbOn)
  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches, [])

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 700, damping: 42, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 700, damping: 42, mass: 0.35 })

  useEffect(() => {
    if (!fine) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      setCursor(el ? el.dataset.cursor : 'default')
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
    }
  }, [fine, x, y, setCursor])

  if (!fine) return null
  const isBulb = mode === 'bulb'

  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ x: sx, y: sy }} aria-hidden>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative h-5 w-5 rounded-full border"
          animate={RING[mode] ?? RING.default}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          style={{
            borderColor: isBulb ? '#ffd28a' : 'var(--accent)',
            background: isBulb ? 'radial-gradient(circle, rgba(255,214,140,.55), rgba(255,170,70,.1) 70%)' : 'transparent',
            boxShadow: isBulb
              ? '0 0 26px 6px rgba(255,180,77,.75), inset 0 0 12px rgba(255,220,160,.7)'
              : '0 0 10px rgba(61,226,255,.0)',
          }}
        >
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </motion.div>

        <AnimatePresence>
          {isBulb && (
            <motion.span
              key="bulb-label"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/40 bg-black/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-100"
              style={{ boxShadow: '0 0 22px rgba(255,180,77,.45)' }}
            >
              {bulbOn ? 'Click to Turn Off' : 'Click to Light Up'}
            </motion.span>
          )}
          {mode === 'view' && (
            <motion.span
              key="view-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.2em] text-white"
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
