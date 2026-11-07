import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      items: {}, // { [productId]: qty }
      open: false,
      add: (id, qty = 1) =>
        set((s) => ({ items: { ...s.items, [id]: (s.items[id] || 0) + qty }, open: true })),
      setQty: (id, qty) =>
        set((s) => {
          const items = { ...s.items }
          if (qty <= 0) delete items[id]
          else items[id] = qty
          return { items }
        }),
      remove: (id) =>
        set((s) => {
          const items = { ...s.items }
          delete items[id]
          return { items }
        }),
      setOpen: (open) => set({ open }),
      count: () => Object.values(get().items).reduce((a, b) => a + b, 0),
    }),
    {
      name: 'voltra-cart',
      partialize: (s) => ({ items: s.items }),
    },
  ),
)
