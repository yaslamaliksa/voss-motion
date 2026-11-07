import { useEffect, useRef } from 'react'
import { bus } from '../../lib/lightBus'

/**
 * Fixed full-screen glow that follows the 3D bulb. Position/opacity are written
 * straight to this node by the light engine (transform + opacity only).
 * The background colour shift itself comes from html[data-bulb] CSS tokens.
 */
export default function AmbientLayer() {
  const glow = useRef(null)
  useEffect(() => {
    bus.ambient = glow.current
    return () => {
      bus.ambient = null
    }
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={glow}
        className="absolute left-0 top-0 aspect-square w-[170vmax] rounded-full opacity-0 will-change-transform"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,176,84,.20), rgba(255,140,50,.09) 38%, rgba(255,120,30,.03) 62%, transparent 80%)',
        }}
      />
      {/* static vignette keeps edges deep black in both states */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,.55))' }}
      />
    </div>
  )
}
