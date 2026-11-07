import { motion } from 'framer-motion'
import { money } from '../../lib/products'
import { useCart } from '../../store/cart'
import { sound } from '../../lib/sound'
import LitSurface from '../shared/LitSurface'
import RouteLink from '../layout/RouteLink'
import LiquidImage from './LiquidImage'

export default function ProductCard({ product, index = 0 }) {
  const add = useCart((s) => s.add)

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <LitSurface
        radius="rounded-3xl"
        innerClassName="border border-white/[0.07] bg-panel transition-colors duration-500 group-hover:border-accent/40"
      >
        <RouteLink to={`/product/${product.id}`} cursor="view" className="block">
          <LiquidImage id={product.id} alt={`${product.name} — ${product.tagline}`} />
          <div className="flex items-end justify-between gap-4 p-5 pr-[4.75rem]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{product.category}</p>
              <h3 className="mt-2 text-lg font-semibold leading-tight">{product.name}</h3>
              <p className="mt-1 text-sm text-white/45">{product.tagline}</p>
            </div>
          </div>
        </RouteLink>
      </LitSurface>

      <div className="pointer-events-none absolute bottom-5 right-5 z-10 flex items-center gap-3">
        <span className="font-mono text-sm text-white/80">{money(product.price)}</span>
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          data-cursor="link"
          onClick={() => {
            sound.tick()
            add(product.id)
          }}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-accent text-black transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.article>
  )
}
