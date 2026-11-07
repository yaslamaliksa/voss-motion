import { create } from 'zustand'

/**
 * Single source of truth for the whole experience.
 *
 * phase machine:
 *   idle  -> arming -> flash -> reveal -> live
 *   (idle: splash waiting, arming: switch snapping + arc, flash: exposure wipe to white,
 *    reveal: main mounted, flash fading out, live: steady state)
 *
 * `bulbOn` only has meaning once the site is powered.
 */
export const usePower = create((set, get) => ({
  phase: 'idle',
  bulbOn: false,
  soundOn: true,

  engage: () => {
    if (get().phase !== 'idle') return
    set({ phase: 'arming' })
  },
  setPhase: (phase) => set({ phase }),
  toggleBulb: () => set((s) => ({ bulbOn: !s.bulbOn })),
  setBulb: (bulbOn) => set({ bulbOn }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  /** "Kill the power": return to splash, reset every dependent piece of state. */
  cutPower: () => set({ phase: 'idle', bulbOn: false }),
}))

export const selectIsPowered = (s) => s.phase === 'reveal' || s.phase === 'live'

/** Mirrors store state onto <html> so Tailwind variants / CSS tokens stay in sync. */
export function bindThemeToStore() {
  const apply = (s) => {
    const el = document.documentElement
    el.dataset.power = selectIsPowered(s) ? 'on' : 'off'
    el.dataset.bulb = selectIsPowered(s) && s.bulbOn ? 'on' : 'off'
  }
  apply(usePower.getState())
  return usePower.subscribe(apply)
}
