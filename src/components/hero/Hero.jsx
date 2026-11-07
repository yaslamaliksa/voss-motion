import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePower } from '../../store/power'
import { sound } from '../../lib/sound'
import RouteLink from '../layout/RouteLink'
import FloatingProducts from './FloatingProducts'

// three.js + R3F are split into their own chunk and only fetched when the hero mounts
const BulbScene = lazy(() => import('./BulbScene'))

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function FlatBulb() {
  const on = usePower((s) => s.bulbOn)
  const toggle = usePower((s) => s.toggleBulb)
  return (
    <button onClick={toggle} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl" aria-label="Toggle light">
      {on ? '💡' : '○'}
    </button>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const [inView, setInView] = useState(true)
  const bulbOn = usePower((s) => s.bulbOn)
  const toggleBulb = usePower((s) => s.toggleBulb)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // pause the render loop whenever the hero is off-screen (saves the GPU for the grid)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden" aria-label="Hero">
      {/* 3D canvas */}
      <div className="absolute inset-0 z-0">
        <SceneBoundary fallback={<FlatBulb />}>
          <Suspense fallback={null}>
            <BulbScene active={inView} />
          </Suspense>
        </SceneBoundary>
      </div>

      <FloatingProducts />

      {/* copy */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-6 pb-10 pt-28 sm:pt-32"
      >
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent"
          >
            Power, perfected
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-[clamp(2.4rem,6.4vw,5.2rem)] font-semibold leading-[0.98] tracking-tight"
          >
            Switch on <br />
            the standard.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-white/55"
          >
            Precision switches, protection gear and statement lighting for people who build things that outlast the wall they sit in.
          </motion.p>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
            <RouteLink to="/shop" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.04]">
              Shop the collection
            </RouteLink>
            <a href="#grid" data-cursor="link" className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 transition-colors hover:border-white/40">
              Explore the grid
            </a>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-3 self-center">
          <button
            type="button"
            onClick={() => {
              sound.unlock()
              sound.bulb(!bulbOn)
              toggleBulb()
            }}
            aria-pressed={bulbOn}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 backdrop-blur transition-colors hover:text-white"
          >
            <i
              className="h-2 w-2 rounded-full transition-all"
              style={{ background: bulbOn ? '#ffb44d' : '#3a3f47', boxShadow: bulbOn ? '0 0 12px 2px #ffb44d' : 'none' }}
            />
            <span>{bulbOn ? 'Light on · tap to switch off' : 'Light off · click the bulb to light up'}</span>
          </button>
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/25">SCROLL ↓</span>
        </div>
      </motion.div>
    </section>
  )
}
