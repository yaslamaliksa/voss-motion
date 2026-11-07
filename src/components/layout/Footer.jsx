import RouteLink from './RouteLink'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/[0.07] px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row">
        <div className="max-w-sm">
          <p className="font-display text-sm font-semibold tracking-[0.4em]">VOLTRA</p>
          <p className="mt-4 text-sm leading-relaxed text-white/45">
            Premium electrical supplies and precision tools. Certified to IEC, UL and CE. Built to be trusted behind the wall.
          </p>
        </div>
        <div className="flex gap-16 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
          <ul className="space-y-3">
            <li><RouteLink to="/shop" className="hover:text-white">Catalogue</RouteLink></li>
            <li><RouteLink to="/" className="hover:text-white">Home</RouteLink></li>
          </ul>
          <ul className="space-y-3">
            <li>Trade accounts</li>
            <li>Certifications</li>
            <li>Support</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl font-mono text-[10px] tracking-[0.25em] text-white/25">
        © {new Date().getFullYear()} VOLTRA ELECTRIC · ALWAYS ISOLATE BEFORE WORKING
      </p>
    </footer>
  )
}
