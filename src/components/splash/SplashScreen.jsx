import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { usePower } from '../../store/power'
import { sound } from '../../lib/sound'
import PowerSwitch from './PowerSwitch'
import ArcCanvas from './ArcCanvas'

/**
 * Phase 1: pitch-black splash. Pressing the switch drives the store through
 * idle -> arming -> flash. The arc, the snap and the sound are all timed off `phase`.
 */
export default function SplashScreen() {
  const phase = usePower((s) => s.phase)
  const engage = usePower((s) => s.engage)
  const setPhase = usePower((s) => s.setPhase)
  const switchRef = useRef(null)
  const armed = phase !== 'idle'

  const onPress = useCallback(() => {
    if (phase !== 'idle') return
    sound.unlock()
    sound.clunk()
    engage()
  }, [phase, engage])

  // arming choreography
  useEffect(() => {
    if (phase !== 'arming') return
    const t1 = setTimeout(() => {
      sound.zap(1.0)
      sound.hum(true)
    }, 140)
    const t2 = setTimeout(() => setPhase('flash'), 1250)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [phase, setPhase])

  return (
    <motion.main
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1 }}
      aria-label="Power on"
    >
      {/* floor reflection / vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 55%, rgba(30,40,55,.28), transparent 70%)' }}
      />

      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-6 font-mono text-[10px] tracking-[0.35em] text-white/40 sm:px-10">
        <span className="font-display text-sm font-semibold tracking-[0.5em] text-white/80">VOLTRA</span>
        <span className="flex items-center gap-2">
          <i className={`h-1.5 w-1.5 rounded-full ${armed ? 'bg-cyan-300 shadow-[0_0_10px_#4de6ff]' : 'bg-red-500/80'}`} />
          {armed ? 'SUPPLY LIVE' : 'SUPPLY OFFLINE'}
        </span>
      </header>

      <PowerSwitch ref={switchRef} on={armed} onPress={onPress} />

      <motion.p
        className="mt-14 text-center font-mono text-[11px] tracking-[0.4em] text-white/50"
        animate={{ opacity: armed ? 0 : [0.35, 0.9, 0.35] }}
        transition={armed ? { duration: 0.2 } : { duration: 2.6, repeat: Infinity }}
      >
        PRESS TO ENERGIZE
      </motion.p>
      <p className="absolute bottom-6 font-mono text-[10px] tracking-[0.3em] text-white/25">
        PREMIUM ELECTRICAL SUPPLIES · EST. 1987
      </p>

      <ArcCanvas active={phase === 'arming' || phase === 'flash'} originRef={switchRef} />
    </motion.main>
  )
}
