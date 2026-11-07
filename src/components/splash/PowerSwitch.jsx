import { forwardRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { sound } from '../../lib/sound'

/**
 * Skeuomorphic industrial rocker switch.
 *  - housing: machined bezel (conic gradient) + hazard plate
 *  - well: recessed cavity with deep inner shadows
 *  - rocker: 3D-rotated face that snaps OFF -> ON on a stiff spring
 * Only transform/opacity are animated.
 */
const PowerSwitch = forwardRef(function PowerSwitch({ on, onPress }, ref) {
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const reduce = useReducedMotion()

  const tilt = on ? -17 : down ? 22 : hover ? 11 : 17 // deg; positive = top away (OFF)

  return (
    <div className="relative select-none" style={{ perspective: 900 }}>
      {/* tactile glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-16 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(77,230,255,.55), rgba(40,120,255,.18) 55%, transparent 75%)',
        }}
        animate={{ opacity: on ? 1 : hover ? 0.38 : 0.1, scale: on ? 1.25 : hover ? 1.05 : 0.95 }}
        transition={{ duration: on ? 0.18 : 0.5, ease: 'easeOut' }}
      />

      {/* housing */}
      <div
        className="relative aspect-square w-[min(74vw,340px)] rounded-[2.6rem] p-[7%]"
        style={{
          background:
            'conic-gradient(from 210deg at 50% 50%, #2a2d33, #6a707b 12%, #1b1d22 28%, #3b3f47 45%, #121317 62%, #5a606b 80%, #2a2d33)',
          boxShadow:
            '0 40px 80px -10px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.07), inset 0 2px 1px rgba(255,255,255,.28), inset 0 -3px 6px rgba(0,0,0,.8)',
        }}
      >
        {/* screws */}
        {[
          'left-[5%] top-[5%]',
          'right-[5%] top-[5%]',
          'left-[5%] bottom-[5%]',
          'right-[5%] bottom-[5%]',
        ].map((pos, i) => (
          <span
            key={pos}
            className={`absolute ${pos} h-[5%] w-[5%] rounded-full`}
            style={{
              background: 'radial-gradient(circle at 35% 30%, #cfd4db, #5b616b 60%, #23262b)',
              boxShadow: 'inset 0 -1px 2px rgba(0,0,0,.6), 0 1px 1px rgba(255,255,255,.1)',
              transform: `rotate(${i * 37}deg)`,
            }}
          >
            <i className="absolute left-[15%] right-[15%] top-1/2 h-[2px] -translate-y-1/2 bg-black/70" />
          </span>
        ))}

        {/* hazard strip + legend */}
        <div className="absolute left-[16%] right-[16%] top-[7%] flex h-[6%] items-center overflow-hidden rounded-[4px] opacity-90">
          <div className="hazard h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-[6.5%] text-center font-mono text-[9px] tracking-[0.4em] text-white/35 sm:text-[10px]">
          MAIN SUPPLY · 400V
        </div>

        {/* recessed well */}
        <div
          className="relative h-full w-full rounded-[1.8rem]"
          style={{
            background: 'linear-gradient(160deg, #050506, #101216 60%, #050506)',
            boxShadow:
              'inset 0 14px 30px rgba(0,0,0,.95), inset 0 -2px 6px rgba(255,255,255,.07), 0 1px 0 rgba(255,255,255,.12)',
          }}
        >
          {/* ON indicator bar */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-[9%] h-[3%] w-[34%] -translate-x-1/2 rounded-full"
            style={{ background: '#6fe8ff', boxShadow: '0 0 18px 4px rgba(77,230,255,.9)' }}
            animate={{ opacity: on ? 1 : 0.0 }}
            transition={{ duration: 0.12 }}
          />

          {/* rocker button */}
          <button
            ref={ref}
            type="button"
            aria-label="Turn on the power"
            aria-pressed={on}
            onClick={onPress}
            onPointerEnter={() => {
              setHover(true)
              if (!on) sound.tick()
            }}
            onPointerLeave={() => {
              setHover(false)
              setDown(false)
            }}
            onPointerDown={() => setDown(true)}
            onPointerUp={() => setDown(false)}
            className="absolute inset-[14%] cursor-pointer rounded-[1.4rem] outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            style={{ transformStyle: 'preserve-3d', touchAction: 'manipulation' }}
          >
            <motion.div
              className="relative h-full w-full overflow-hidden rounded-[1.4rem]"
              style={{
                transformOrigin: '50% 50%',
                background: 'linear-gradient(180deg, #3a3e46 0%, #1b1d22 50%, #0d0e11 100%)',
                boxShadow:
                  '0 18px 28px rgba(0,0,0,.85), inset 0 1px 1px rgba(255,255,255,.35), inset 0 -10px 20px rgba(0,0,0,.65), inset 0 0 0 1px rgba(255,255,255,.04)',
              }}
              animate={{ rotateX: tilt, scale: down && !on ? 0.97 : 1 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : on
                    ? { type: 'spring', stiffness: 900, damping: 16, mass: 0.6 }
                    : { type: 'spring', stiffness: 420, damping: 24 }
              }
            >
              {/* directional lighting flips with the tilt */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0) 45%, rgba(0,0,0,.35))',
                }}
                animate={{ opacity: on ? 1 : 0.35 }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(70% 50% at 50% 100%, rgba(77,230,255,.6), transparent 70%)',
                }}
                animate={{ opacity: on ? 0.0 : hover ? 0.4 : 0 }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(70% 50% at 50% 0%, rgba(111,232,255,.8), transparent 70%)',
                }}
                animate={{ opacity: on ? 0.9 : 0 }}
                transition={{ duration: 0.15 }}
              />
              {/* grip ridges */}
              <div className="absolute inset-x-[14%] top-[44%] flex flex-col gap-[3px] opacity-60">
                {[0, 1, 2, 3].map((i) => (
                  <i key={i} className="h-[2px] rounded bg-black/80 shadow-[0_1px_0_rgba(255,255,255,.12)]" />
                ))}
              </div>
              {/* glyphs */}
              <motion.span
                className="absolute left-1/2 top-[14%] -translate-x-1/2 font-mono text-2xl font-medium"
                animate={{ color: on ? '#e9fdff' : '#566069', textShadow: on ? '0 0 14px #4de6ff' : '0 0 0 transparent' }}
              >
                I
              </motion.span>
              <span className="absolute bottom-[12%] left-1/2 h-[1.5rem] w-[1.5rem] -translate-x-1/2 rounded-full border-2 border-[#3a4048]" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* idle breathing ring (hidden once pressed) */}
      {!on && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2.6rem] border border-cyan-300/30"
          style={{ animation: 'pulse-ring 2.6s ease-out infinite' }}
        />
      )}
    </div>
  )
})

export default PowerSwitch
