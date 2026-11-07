import { motion } from 'framer-motion'
import { productImage } from '../../lib/productArt'
import LitSurface from '../shared/LitSurface'
import RouteLink from '../layout/RouteLink'

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
})

const tile = 'border border-white/[0.07] bg-panel'

function Waveform() {
  // one period tiled; the track translates by exactly one period -> seamless, GPU only
  const d = 'M0 40 Q 30 0 60 40 T 120 40 T 180 40 T 240 40 T 300 40 T 360 40 T 420 40 T 480 40'
  return (
    <svg viewBox="0 0 240 80" className="h-20 w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
      <g style={{ animation: 'scan 1.6s linear infinite' }}>
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.2" style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />
      </g>
    </svg>
  )
}

export default function BentoDashboard() {
  return (
    <section id="grid" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-6 pt-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">The grid</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Engineered like infrastructure.</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-white/45">
          Every module on this board is tested to the standard it was built for — then tested again at twice the load.
        </p>
      </div>

      <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
        {/* hero tile */}
        <motion.div {...reveal(0)} className="md:col-span-2 md:row-span-2">
          <LitSurface className="h-full min-h-[420px]" innerClassName={`${tile} grain`}>
            <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(61,226,255,.10),transparent)]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-7">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Studio series</p>
                <h3 className="mt-3 max-w-[14ch] text-3xl font-semibold leading-tight">Touch-glass control, behind the wall.</h3>
              </div>
              <RouteLink to="/product/volt-panel-s1" cursor="view" className="w-fit rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 transition-colors hover:border-accent hover:text-accent">
                Discover Volt Panel →
              </RouteLink>
            </div>
            <div className="float absolute -right-6 bottom-2 w-[68%]" style={{ '--r': '-4deg', '--dur': '9s' }}>
              <img src={productImage('volt-panel-s1', 'photo', { bg: false })} alt="" draggable={false} style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))' }} />
            </div>
          </LitSurface>
        </motion.div>

        {/* stat */}
        <motion.div {...reveal(1)}>
          <LitSurface className="h-full" innerClassName={`${tile} p-6`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Breaking capacity</p>
            <p className="mt-5 text-6xl font-semibold tracking-tight">
              10<span className="text-accent">kA</span>
            </p>
            <p className="mt-3 text-sm text-white/45">Ten-plate arc chute in every Arc-Guard breaker.</p>
          </LitSurface>
        </motion.div>

        {/* live meter */}
        <motion.div {...reveal(2)}>
          <LitSurface className="h-full" innerClassName={`${tile} flex flex-col justify-between p-6`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              <span>Live line</span>
              <span className="flex items-center gap-1.5 text-accent">
                <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> 50 Hz
              </span>
            </div>
            <div className="overflow-hidden">
              <Waveform />
            </div>
            <p className="font-mono text-2xl">230.4 <span className="text-white/40">V~</span></p>
          </LitSurface>
        </motion.div>

        {/* protection */}
        <motion.div {...reveal(3)}>
          <LitSurface className="h-full" innerClassName={`${tile} relative min-h-[190px]`}>
            <div className="relative z-10 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Protection</p>
              <p className="mt-2 text-xl font-semibold">Breakers</p>
            </div>
            <img src={productImage('arc-guard-32', 'photo', { bg: false })} alt="" draggable={false} className="float absolute -bottom-10 right-0 w-[55%]" style={{ '--r': '6deg', '--dur': '8s' }} />
          </LitSurface>
        </motion.div>

        {/* lighting wide */}
        <motion.div {...reveal(4)} className="md:col-span-2">
          <LitSurface className="h-full" innerClassName={`${tile} relative min-h-[200px]`}>
            <div className="relative z-10 max-w-[16rem] p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Lighting</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">Hand-spun brass, dim-to-warm.</h3>
              <RouteLink to="/product/aurelle-pendant" cursor="view" className="mt-4 inline-block text-sm text-white/70 underline-offset-4 hover:underline">
                See the Aurelle →
              </RouteLink>
            </div>
            <img src={productImage('aurelle-pendant', 'photo', { bg: false })} alt="" draggable={false} className="float absolute -top-10 right-6 w-[42%] max-w-[260px]" style={{ '--r': '0deg', '--dur': '10s', '--amp': '8px' }} />
          </LitSurface>
        </motion.div>

        {/* tools */}
        <motion.div {...reveal(5)}>
          <LitSurface className="h-full" innerClassName={`${tile} relative min-h-[190px]`}>
            <div className="relative z-10 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Tools</p>
              <p className="mt-2 text-xl font-semibold">Diagnostics</p>
            </div>
            <img src={productImage('quantum-dmm', 'photo', { bg: false })} alt="" draggable={false} className="float absolute -bottom-12 right-2 w-[48%]" style={{ '--r': '-6deg', '--dur': '7s' }} />
          </LitSurface>
        </motion.div>

        {/* cta */}
        <motion.div {...reveal(6)}>
          <LitSurface className="h-full" innerClassName="relative flex min-h-[190px] flex-col justify-between bg-accent p-6 text-black">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">Trade</p>
            <div>
              <p className="text-2xl font-semibold leading-tight">Contractor pricing, same-day dispatch.</p>
              <RouteLink to="/shop" className="mt-4 inline-block rounded-full bg-black px-5 py-2.5 text-sm text-white">
                Browse catalogue
              </RouteLink>
            </div>
          </LitSurface>
        </motion.div>
      </div>
    </section>
  )
}
