import { useEffect } from 'react'
import { usePower, bindThemeToStore, selectIsPowered } from './store/power'
import SplashScreen from './components/splash/SplashScreen'
import ExposureFlash from './components/splash/ExposureFlash'
import MainApp from './MainApp'

/**
 * Two phases, one state machine (see store/power.js).
 *   splash : idle | arming | flash
 *   main   : reveal | live
 * html[data-power] / html[data-bulb] are mirrored from the store so every Tailwind
 * variant and CSS token stays in sync with the switch.
 */
export default function App() {
  const powered = usePower(selectIsPowered)
  const phase = usePower((s) => s.phase)

  useEffect(() => bindThemeToStore(), [])

  // splash keeps the page locked; the main page owns scroll (Lenis)
  useEffect(() => {
    document.documentElement.style.overflow = powered ? '' : 'hidden'
    if (!powered) window.scrollTo(0, 0)
  }, [powered])

  return (
    <>
      {powered && <MainApp />}
      {!powered && phase !== 'reveal' && <SplashScreen />}
      <ExposureFlash />
    </>
  )
}
