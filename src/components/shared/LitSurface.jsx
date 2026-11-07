import { useEffect, useRef } from 'react'
import { registerSurface } from '../../lib/lightBus'

/**
 * Wraps any card/tile so it reacts to the 3D bulb:
 *  - a cast shadow (blurred layer pushed away from the light)
 *  - a key-light sheen that tracks the bulb position
 * All per-frame writes are transform/opacity done by lib/lightBus.
 */
export default function LitSurface({ className = '', innerClassName = '', radius = 'rounded-3xl', children, ...rest }) {
  const root = useRef(null)
  const shadow = useRef(null)
  const sheen = useRef(null)

  useEffect(
    () => registerSurface({ root: root.current, shadow: shadow.current, sheen: sheen.current }),
    [],
  )

  return (
    <div ref={root} className={`relative ${radius} ${className}`} {...rest}>
      <span
        ref={shadow}
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[inherit] bg-black opacity-0 blur-2xl will-change-transform"
      />
      <div className={`relative h-full overflow-hidden rounded-[inherit] ${innerClassName}`}>
        {children}
        <span
          ref={sheen}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-full opacity-0 mix-blend-screen will-change-transform"
          style={{
            width: 460,
            height: 460,
            background: 'radial-gradient(closest-side, rgba(255,196,110,.32), rgba(255,160,60,.08) 55%, transparent)',
          }}
        />
      </div>
    </div>
  )
}
