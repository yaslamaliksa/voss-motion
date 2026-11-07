import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { productImage } from '../../lib/productArt'

/**
 * Cut-out product renders floating around the bulb. Two independent motions, both
 * transform-only: pointer parallax (framer springs) on the outer node and a slow
 * CSS float on the inner node.
 */
const ITEMS = [
  { id: 'volt-panel-s1', pos: 'left-[3%] top-[24%] w-[17vw] max-w-[230px] min-w-[110px]', depth: 1.0, r: -6, dur: 8, hide: false },
  { id: 'arc-guard-32', pos: 'right-[4%] top-[20%] w-[13vw] max-w-[190px] min-w-[90px]', depth: 0.7, r: 5, dur: 9, hide: false },
  { id: 'quantum-dmm', pos: 'left-[9%] bottom-[8%] w-[12vw] max-w-[170px] min-w-[90px]', depth: 1.3, r: 8, dur: 7, hide: true },
  { id: 'orbit-smart-socket', pos: 'right-[10%] bottom-[10%] w-[14vw] max-w-[200px] min-w-[96px]', depth: 0.5, r: -4, dur: 10, hide: true },
  { id: 'pro-grip-plug', pos: 'left-[30%] top-[10%] w-[9vw] max-w-[130px] min-w-[70px]', depth: 1.6, r: 12, dur: 6, hide: true },
]

function Item({ item, mx, my, i }) {
  const x = useSpring(useTransform(mx, [-1, 1], [-32 * item.depth, 32 * item.depth]), { stiffness: 80, damping: 18 })
  const y = useSpring(useTransform(my, [-1, 1], [-22 * item.depth, 22 * item.depth]), { stiffness: 80, damping: 18 })
  return (
    <motion.div
      className={`pointer-events-none absolute ${item.pos} ${item.hide ? 'max-md:hidden' : ''}`}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + i * 0.12, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="float" style={{ '--r': `${item.r}deg`, '--dur': `${item.dur}s`, '--delay': `${-i * 1.3}s`, '--amp': `${10 + item.depth * 8}px` }}>
        <img
          src={productImage(item.id, 'photo', { bg: false })}
          alt=""
          draggable={false}
          className="h-auto w-full"
          style={{ filter: 'drop-shadow(0 30px 30px rgba(0,0,0,.55))' }}
        />
      </div>
    </motion.div>
  )
}

export default function FloatingProducts() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  useEffect(() => {
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [mx, my])

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {ITEMS.map((it, i) => (
        <Item key={it.id} item={it} mx={mx} my={my} i={i} />
      ))}
    </div>
  )
}
