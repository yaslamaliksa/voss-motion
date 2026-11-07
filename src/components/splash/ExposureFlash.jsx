import { useEffect } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { usePower } from '../../store/power'
import { sound } from '../../lib/sound'

/**
 * Cinematic exposure wipe. Lives above both phases so it can bridge them:
 *   flash  : radial white blows out the splash (state flips to `reveal` at full white)
 *   reveal : main page is already mounted underneath; the exposure bleeds off
 */
export default function ExposureFlash() {
  const phase = usePower((s) => s.phase)
  const setPhase = usePower((s) => s.setPhase)
  const controls = useAnimationControls()
  const reduce = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    if (phase === 'flash') {
      sound.surge()
      controls
        .start({
          opacity: [0, 0.55, 1],
          scale: reduce ? 1 : [0.35, 1, 1.8],
          transition: { duration: reduce ? 0.2 : 0.6, times: [0, 0.55, 1], ease: 'easeIn' },
        })
        .then(() => !cancelled && setPhase('reveal'))
    } else if (phase === 'reveal') {
      controls
        .start({
          opacity: 0,
          scale: reduce ? 1 : 2.4,
          transition: { duration: reduce ? 0.3 : 1.5, ease: [0.16, 1, 0.3, 1] },
        })
        .then(() => !cancelled && setPhase('live'))
    } else {
      controls.set({ opacity: 0, scale: 0.35 })
    }
    return () => {
      cancelled = true
    }
  }, [phase, controls, setPhase, reduce])

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.35 }}
      animate={controls}
      className="pointer-events-none fixed left-1/2 top-1/2 z-[100] aspect-square w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
      style={{
        background:
          'radial-gradient(closest-side, #ffffff 0%, #f3fdff 38%, rgba(190,240,255,.9) 62%, rgba(120,200,255,0) 100%)',
      }}
    />
  )
}
