import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../../store/cart'
import { byId, money } from '../../lib/products'
import { productImage } from '../../lib/productArt'

export default function CartDrawer() {
  const open = useCart((s) => s.open)
  const items = useCart((s) => s.items)
  const setOpen = useCart((s) => s.setOpen)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)

  const lines = Object.entries(items)
    .map(([id, qty]) => ({ product: byId(id), qty }))
    .filter((l) => l.product)
  const total = lines.reduce((a, l) => a + l.product.price * l.qty, 0)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-50 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0b0c0f]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">Your cart</h2>
              <button onClick={() => setOpen(false)} data-cursor="link" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white">
                Close
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {lines.length === 0 && <p className="pt-10 text-center text-sm text-white/40">Nothing wired up yet.</p>}
              {lines.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <img src={productImage(product.id, 'photo')} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="font-mono text-sm">{money(product.price * qty)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 font-mono text-sm">
                        <button aria-label="Decrease" className="h-6 w-6 rounded-full border border-white/15" onClick={() => setQty(product.id, qty - 1)}>
                          −
                        </button>
                        {qty}
                        <button aria-label="Increase" className="h-6 w-6 rounded-full border border-white/15" onClick={() => setQty(product.id, qty + 1)}>
                          +
                        </button>
                      </div>
                      <button className="text-xs text-white/40 hover:text-white" onClick={() => remove(product.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-6">
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="font-mono">{money(total)}</span>
              </div>
              <button
                disabled={!lines.length}
                className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-black transition-opacity disabled:opacity-30"
                data-cursor="link"
              >
                Checkout (demo)
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
