const ITEMS = ['IEC 60898', 'UL LISTED', 'CE MARKED', 'RoHS', 'IP44 SEALED', 'CAT IV 600V', 'ISO 9001', 'MATTER READY', 'KEMA KEUR']

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/[0.07] py-5" aria-hidden>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-[0.35em] text-white/35">
        {row.concat(row).map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <i className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  )
}
