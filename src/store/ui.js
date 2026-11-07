import { create } from 'zustand'

/** Cursor mode is driven by DOM delegation (data-cursor) and by the 3D bulb hit-area. */
export const useUI = create((set) => ({
  cursor: 'default', // default | link | view | bulb
  setCursor: (cursor) => set({ cursor }),
}))
