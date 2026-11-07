import Hero from '../components/hero/Hero'
import Marquee from '../components/home/Marquee'
import BentoDashboard from '../components/home/BentoDashboard'
import ProductGrid from '../components/shop/ProductGrid'
import RouteLink from '../components/layout/RouteLink'
import { PRODUCTS } from '../lib/products'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <BentoDashboard />
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">Featured</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Hover to look inside.</h2>
            <p className="mt-3 max-w-md text-sm text-white/45">
              Move across any product — the surface liquifies and an X-ray lens reveals the internals.
            </p>
          </div>
          <RouteLink to="/shop" className="hidden shrink-0 text-sm text-white/60 hover:text-white sm:block">
            View all →
          </RouteLink>
        </div>
        <ProductGrid products={PRODUCTS} />
      </section>
    </>
  )
}
