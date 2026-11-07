import Lenis from 'lenis'
import { markDirty } from './lightBus'

let instance = null
let raf = 0

/** Creates the single Lenis instance and drives it from one rAF loop. */
export function startLenis() {
  if (instance) return instance
  instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true })
  instance.on('scroll', markDirty)
  const loop = (t) => {
    instance?.raf(t)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  return instance
}

export function stopLenis() {
  cancelAnimationFrame(raf)
  instance?.destroy()
  instance = null
}

export const scrollToTop = (immediate = true) => {
  if (instance) instance.scrollTo(0, { immediate })
  else window.scrollTo(0, 0)
  markDirty()
}

export const lenis = () => instance
