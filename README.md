# VOLTRA — premium electrical e-commerce

React 19 · Tailwind v4 · Framer Motion · React Three Fiber · Three.js · Lenis · Zustand

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Architecture

```
src/
  store/power.js        state machine: idle → arming → flash → reveal → live (+ bulbOn, soundOn)
  store/cart.js         persisted cart
  store/ui.js           cursor mode
  lib/lightBus.js       one rAF loop: bulb position → transform/opacity on every lit DOM surface
  lib/sound.js          synthesized click / arc / surge / hum (WebAudio) + navigator.vibrate haptics
  lib/router.js         tiny hash router (no reloads)
  lib/lenis.js          smooth-scroll singleton
  lib/productArt.js     procedural studio + X-ray product renders (swap for real photos)
  components/splash/    PowerSwitch, ArcCanvas, SplashScreen, ExposureFlash
  components/hero/      BulbScene (R3F), FloatingProducts (parallax), Hero
  components/shop/      LiquidImage (GLSL liquify + X-ray lens), ProductCard, ProductGrid
  components/shared/    LitSurface (cast shadow + key-light sheen)
  components/layout/    Header, Footer, CartDrawer, CustomCursor, AmbientLayer, RouteLink
  pages/                Home, Shop, Product
```

## How the two phases stay in sync

`usePower` is the single source of truth. `bindThemeToStore()` mirrors it onto
`<html data-power data-bulb>`, and CSS tokens (`--accent`, `--surface`, registered with
`@property` so they animate) react to it — cyan when powered, amber when the bulb is lit.
The header "Live" pill calls `cutPower()` and drops you back to the splash.

## Performance notes

- Only `transform` / `opacity` are written per frame (light engine, parallax, cursor, wipes).
- The bulb never triggers React renders per frame: light level, swing and screen position live in refs / the `bus`.
- Hero render loop pauses off-screen; `PerformanceMonitor` drops DPR if frames slip.
- Shader card canvases exist only while hovered (or mid-viewport on touch) and release their GL context after.
- three / R3F / drei are split into separate chunks and the 3D scene is lazy-loaded.

## Swapping in real photography

Replace `productImage(id, kind)` in `lib/productArt.js` with URLs for `photo` and `xray`
images. `LiquidImage` already loads them as textures.
