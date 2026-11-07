import { motion } from 'framer-motion'
import { usePower } from '../../store/power'
import { useCart } from '../../store/cart'
import { usePath } from '../../lib/router'
import { sound } from '../../lib/sound'
import RouteLink from './RouteLink'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
]

export default function Header() {
  const path = usePath()
  const bulbOn = usePower((s) => s.bulbOn)
  const soundOn = usePower((s) => s.soundOn)
  const toggleSound = usePower((s) => s.toggleSound)
  const cutPower = usePower((s) => s.cutPower)
  const count = useCart((s) => Object.values(s.items).reduce((a, b) => a + b, 0))
  const setOpen = useCart((s) => s.setOpen)

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/45 px-4 py-2.5 backdrop-blur-xl sm:mx-6 sm:px-6 lg:mx-auto">
        <RouteLink to="/" className="flex items-center gap-2 font-display text-sm font-semibold tracking-[0.35em]">
          <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden>
            <path d="M18 3 7 18h8l-1 11 11-15h-8z" fill="var(--accent)" />
          </svg>
          VOLTRA
        </RouteLink>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {LINKS.map((l) => {
            const active = l.to === '/' ? path === '/' : path.startsWith(l.to)
            return (
              <RouteLink
                key={l.to}
                to={l.to}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors sm:px-4 ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/10"
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                  />
                )}
                {l.label}
              </RouteLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              sound.hum(false)
              cutPower()
            }}
            data-cursor="link"
            title="Cut power — return to the switch"
            className="group flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-red-400/60 hover:text-red-300"
          >
            <i
              className="h-1.5 w-1.5 rounded-full transition-colors"
              style={{ background: bulbOn ? '#ffb44d' : '#3de2ff', boxShadow: `0 0 8px ${bulbOn ? '#ffb44d' : '#3de2ff'}` }}
            />
            <span className="max-sm:hidden">Live</span>
            <span className="hidden group-hover:inline max-sm:hidden">· cut</span>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            data-cursor="link"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H2v6h4l5 4z" />
              {soundOn ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m22 9-6 6m0-6 6 6" />}
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-cursor="link"
            aria-label={`Open cart, ${count} items`}
            className="relative grid h-9 w-9 place-items-center rounded-full bg-accent text-black transition-transform hover:scale-105"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 7h12l-1 12H7zM9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 1.8 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 font-mono text-[9px] font-medium text-black"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
