import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { byId, money, PRODUCTS } from '../lib/products'
import { productImage } from '../lib/productArt'
import { useCart } from '../store/cart'
import { sound } from '../lib/sound'
import LitSurface from '../components/shared/LitSurface'
import LiquidImage from '../components/shop/LiquidImage'
import ProductGrid from '../components/shop/ProductGrid'
import RouteLink from '../components/layout/RouteLink'

export default function ProductPage({ id }) {
  const product = byId(id)
  const add = useCart((s) => s.add)
  const [xray, setXray] = useState(false)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-48 text-center">
        <h1 className="text-3xl font-semibold">Product not found</h1>
        <RouteLink to="/shop" className="mt-6 inline-block text-accent">← Back to catalogue</RouteLink>
      </section>
    )
  }

  const related = PRODUCTS.filter((p) => p.id !== id).slice(0, 3)

  return (
    <>
      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pt-32 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <LitSurface innerClassName="border border-white/[0.07] bg-panel">
            <div className="relative">
              <LiquidImage id={product.id} alt={product.name} />
              <AnimatePresence>
                {xray && (
                  <motion.img
                    key="xray"
                    src={productImage(product.id, 'xray')}
                    alt={`${product.name} internal view`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
            </div>
          </LitSurface>
          <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            <span>{xray ? 'Internal view' : 'Hover to liquify · lens shows internals'}</span>
            <button
              onClick={() => setXray((v) => !v)}
              data-cursor="link"
              aria-pressed={xray}
              className={`rounded-full border px-4 py-2 transition-colors ${xray ? 'border-accent text-accent' : 'border-white/15 text-white/70'}`}
            >
              X-ray {xray ? 'on' : 'off'}
            </button>
          </div>
        </div>

        <div>
          <RouteLink to="/shop" className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45 hover:text-white">
            ← Catalogue
          </RouteLink>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.35em] text-accent">{product.category}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-white/50">{product.tagline}</p>
          <p className="mt-8 font-mono text-3xl">{money(product.price)}</p>
          <p className="mt-6 max-w-lg leading-relaxed text-white/60">{product.blurb}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-full border border-white/10 px-4 py-2.5 font-mono">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-white/60 hover:text-white">−</button>
              <span className="w-4 text-center">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="text-white/60 hover:text-white">+</button>
            </div>
            <button
              data-cursor="link"
              onClick={() => {
                sound.tick()
                add(product.id, qty)
              }}
              className="flex-1 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex-none"
            >
              Add to cart
            </button>
          </div>

          <dl className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {product.specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-4 text-sm">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{k}</dt>
                <dd className="text-right text-white/80">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-28">
        <h2 className="mb-8 text-2xl font-semibold">Pairs well with</h2>
        <ProductGrid products={related} />
      </section>
    </>
  )
}
