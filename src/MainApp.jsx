import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePath, matchRoute } from './lib/router'
import { startLenis, stopLenis, scrollToTop } from './lib/lenis'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AmbientLayer from './components/layout/AmbientLayer'
import CustomCursor from './components/layout/CustomCursor'
import CartDrawer from './components/layout/CartDrawer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'

const EASE = [0.16, 1, 0.3, 1]

function Page({ route }) {
  switch (route.name) {
    case 'shop':
      return <ShopPage />
    case 'product':
      return <ProductPage id={route.params.id} />
    default:
      return <HomePage />
  }
}

/** Curtain that sweeps over each route change (transform only). */
function RouteWipe({ routeKey }) {
  const first = useRef(true)
  useEffect(() => {
    first.current = false
  }, [])
  if (first.current) return null
  return (
    <motion.div
      key={routeKey}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] bg-[#0b0d10]"
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 0.95, times: [0, 0.4, 0.55, 1], ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-accent shadow-[0_0_24px_var(--accent)]" />
    </motion.div>
  )
}

/** Phase 2 root. Mounted underneath the flash, so it's already live when the exposure bleeds off. */
export default function MainApp() {
  const path = usePath()
  const route = matchRoute(path)
  const key = route.name + (route.params.id ?? '')
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    startLenis()
    return stopLenis
  }, [reduce])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}>
      <AmbientLayer />
      <Header />
      <div className="relative z-10">
        <AnimatePresence mode="wait" onExitComplete={() => scrollToTop(true)}>
          <motion.main
            key={key}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Page route={route} />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
      <RouteWipe routeKey={key} />
      <CartDrawer />
      <CustomCursor />
    </motion.div>
  )
}
