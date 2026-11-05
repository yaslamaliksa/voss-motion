# Voss Motion

Motion design portfolio. Next.js (App Router), Tailwind CSS 3, GSAP + ScrollTrigger, Lenis, native View Transitions.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/
  layout.tsx            fonts (next/font), ViewTransitions, Lenis, cursor, nav
  page.tsx              Hero, FeaturedWork, Capabilities, Showreel, Contact
  work/[slug]/page.tsx  case study route (art morphs from the home card)
  globals.css           tokens, glass, cursor, art, view-transition keyframes
components/
  SmoothScroll.tsx      Lenis driven by gsap.ticker + scroll progress bar
  Cursor.tsx            morphing cursor, driven by data-cursor / data-label
  Magnetic.tsx          magnetic hover wrapper
  SplitText.tsx         word/char reveal, split in React (no DOM mutation)
  HeroShader.tsx        WebGL ambient background behind the type knockout
  Hero.tsx              multiply-blend mask: white glyphs reveal the shader
  FeaturedWork.tsx      pinned horizontal rail with parallax art
  Capabilities.tsx      glass plates, scrubbed scale/fade, easing-curve drawing
  Showreel.tsx          canvas reel with play/pause, seek, timecode
  Contact.tsx           brief form (validation, success state)
lib/  data.ts, gsap.ts, lenis.ts, shader.ts
```

## Performance notes

- Animated properties are `transform` and `opacity`. The shader renders at 55% resolution and pauses off-screen; the reel pauses off-screen.
- Fonts come from `next/font` (self-hosted, size-adjusted fallback), and every media box has a fixed `aspect-ratio`, so there is no layout shift from fonts or media.
- Everything animated respects `prefers-reduced-motion`: no Lenis, no pinning (the rail becomes a native scroll strip), no shader loop, no view-transition animation.
- Run Lighthouse on a production build (`npm run build && npm start`) in an incognito window. Scores depend on hosting and device; the code gives you the headroom, it does not guarantee a number.

## Make it yours

- Replace the sample projects in `lib/data.ts` and the `.a1`–`.a6` art in `globals.css` with real stills or video. For video, use `<video muted playsinline preload="metadata" poster=...>` with a fixed aspect ratio.
- To use a real background video in the hero, put a `<video>` where `HeroShader` is. The multiply mask works the same.
- Wire the form: send the payload from `submit()` in `Contact.tsx` to a route handler or form service (see the `TODO`).
