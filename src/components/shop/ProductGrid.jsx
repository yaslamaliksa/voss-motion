import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  )
}
