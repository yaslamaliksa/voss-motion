import { useMemo, useState } from 'react'
import ProductGrid from '../components/shop/ProductGrid'
import { CATEGORIES, PRODUCTS } from '../lib/products'

export default function ShopPage() {
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    const l = PRODUCTS.filter((p) => cat === 'All' || p.category === cat)
    if (sort === 'low') return [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...l].sort((a, b) => b.price - a.price)
    return l
  }, [cat, sort])

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-36">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">Catalogue</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Everything behind the wall.</h1>

      <div className="mb-10 mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              data-cursor="link"
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                cat === c ? 'border-accent bg-accent text-black' : 'border-white/10 text-white/55 hover:border-white/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-white/10 bg-panel px-4 py-2 text-white/80 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="low">Price ↑</option>
            <option value="high">Price ↓</option>
          </select>
        </label>
      </div>

      <ProductGrid key={cat + sort} products={list} />
      {list.length === 0 && <p className="py-20 text-center text-white/40">No products in this category yet.</p>}
    </section>
  )
}
