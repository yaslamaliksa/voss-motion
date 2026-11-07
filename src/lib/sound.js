/**
 * Tiny synthesized sound kit (no audio assets). Created lazily on first gesture
 * because browsers block AudioContext before user interaction.
 */
import { usePower } from '../store/power'

let ctx = null
let master = null
let noiseBuf = null
let humNodes = null

function ensure() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.9
    master.connect(ctx.destination)
    const len = ctx.sampleRate * 1
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

const enabled = () => usePower.getState().soundOn

function noise(t, dur, { type = 'bandpass', freq = 2000, q = 1, gain = 0.3, sweepTo } = {}) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.setValueAtTime(freq, t)
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur)
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(master)
  src.start(t, Math.random() * 0.5)
  src.stop(t + dur + 0.02)
}

function tone(t, dur, { type = 'sine', from = 100, to = 40, gain = 0.4 } = {}) {
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(from, t)
  o.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + dur + 0.02)
}

const vibrate = (p) => {
  try {
    navigator.vibrate?.(p)
  } catch {
    /* noop */
  }
}

export const sound = {
  unlock() {
    ensure()
  },
  /** Light mechanical tick (hover) */
  tick() {
    vibrate(6)
    if (!enabled() || !ensure()) return
    const t = ctx.currentTime
    noise(t, 0.035, { type: 'highpass', freq: 4500, gain: 0.12 })
    tone(t, 0.04, { type: 'square', from: 2200, to: 1500, gain: 0.02 })
  },
  /** Heavy industrial clunk (press / snap) */
  clunk() {
    vibrate([18, 30, 12])
    if (!enabled() || !ensure()) return
    const t = ctx.currentTime
    tone(t, 0.22, { from: 140, to: 38, gain: 0.7 })
    noise(t, 0.09, { type: 'bandpass', freq: 1800, q: 0.8, gain: 0.5 })
    noise(t + 0.045, 0.06, { type: 'highpass', freq: 3500, gain: 0.25 })
  },
  /** High-voltage arc crackle */
  zap(duration = 0.9) {
    if (!enabled() || !ensure()) return
    const t = ctx.currentTime
    noise(t, duration, { type: 'bandpass', freq: 3500, sweepTo: 700, q: 0.6, gain: 0.5 })
    // buzzing sawtooth with jittered amplitude
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = 118
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    for (let i = 0; i < 24; i++) g.gain.linearRampToValueAtTime(Math.random() * 0.18, t + (i / 24) * duration)
    g.gain.linearRampToValueAtTime(0, t + duration)
    const shaper = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1
      curve[i] = Math.tanh(x * 4)
    }
    shaper.curve = curve
    o.connect(shaper).connect(g).connect(master)
    o.start(t)
    o.stop(t + duration + 0.05)
  },
  /** Power-up swell during the flash */
  surge() {
    vibrate([40, 40, 80])
    if (!enabled() || !ensure()) return
    const t = ctx.currentTime
    tone(t, 1.4, { type: 'sawtooth', from: 55, to: 880, gain: 0.12 })
    noise(t, 1.2, { type: 'highpass', freq: 800, sweepTo: 9000, gain: 0.2 })
  },
  /** Mains hum (very low) */
  hum(on) {
    if (!ensure()) return
    if (on && enabled() && !humNodes) {
      const g = ctx.createGain()
      g.gain.value = 0
      g.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
      const a = ctx.createOscillator()
      const b = ctx.createOscillator()
      a.frequency.value = 50
      b.frequency.value = 100
      a.connect(g)
      b.connect(g)
      g.connect(master)
      a.start()
      b.start()
      humNodes = { a, b, g }
    } else if (!on && humNodes) {
      const { a, b, g } = humNodes
      g.gain.cancelScheduledValues(ctx.currentTime)
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
      a.stop(ctx.currentTime + 0.5)
      b.stop(ctx.currentTime + 0.5)
      humNodes = null
    }
  },
  /** Bulb relay + filament warming */
  bulb(on) {
    vibrate(on ? 14 : 8)
    if (!enabled() || !ensure()) return
    const t = ctx.currentTime
    noise(t, 0.05, { type: 'bandpass', freq: 2600, q: 2, gain: 0.35 })
    tone(t, 0.08, { type: 'triangle', from: 600, to: 260, gain: 0.15 })
    if (on) {
      for (let i = 0; i < 4; i++) noise(t + 0.06 + i * 0.07, 0.03, { type: 'highpass', freq: 5000, gain: 0.1 })
    }
  },
}
