import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { productImage } from '../../lib/productArt'

/**
 * Hover transition: a fragment shader liquifies the studio shot around the cursor
 * (ripples + lens magnification + chromatic aberration) while a circular X-ray lens
 * reveals the internal blueprint of the component.
 *
 * Perf notes: the <img> is always the resting state. A WebGL canvas is only created
 * while hovered (or while a card sits mid-viewport on touch devices) and torn down
 * (context released) once the effect has faded out.
 */

const VERT = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2  uMouse;
uniform float uHover;
uniform float uTime;
vec3 samp(sampler2D t, vec2 uv, vec2 ca){
  return vec3(texture2D(t, uv + ca).r, texture2D(t, uv).g, texture2D(t, uv - ca).b);
}
void main(){
  vec2 uv = vUv;
  vec2 d = uv - uMouse;
  float dist = length(d);
  vec2 dir = d / (dist + 1e-4);
  float fall = smoothstep(0.62, 0.0, dist) * uHover;
  float ripple = sin(dist * 34.0 - uTime * 4.0) * 0.010 * fall;
  vec2 flow = vec2(sin(uv.y * 10.0 + uTime * 1.3), cos(uv.x * 10.0 + uTime * 1.1)) * 0.008 * uHover;
  vec2 duv = uv + dir * ripple + flow - d * fall * 0.10;
  vec2 ca = dir * 0.006 * fall;
  vec3 a = samp(uA, duv, ca);
  vec3 b = samp(uB, duv, ca * 0.5);
  b *= 1.0 + 0.12 * sin(uv.y * 420.0 + uTime * 6.0);
  float r = 0.23 * uHover;
  float lens = smoothstep(r, r - 0.035, dist);
  vec3 col = mix(a, b, lens);
  float ring = smoothstep(0.012, 0.0, abs(dist - r)) * uHover;
  col += ring * vec3(0.30, 0.88, 1.0);
  col += fall * 0.04;
  gl_FragColor = vec4(col, 1.0);
}`

const texCache = new Map()
function loadTexture(url) {
  if (!texCache.has(url)) {
    texCache.set(
      url,
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const t = new THREE.Texture(img)
          t.minFilter = THREE.LinearMipmapLinearFilter
          t.magFilter = THREE.LinearFilter
          t.generateMipmaps = true
          t.needsUpdate = true
          resolve(t)
        }
        img.onerror = reject
        img.src = url
      }),
    )
  }
  return texCache.get(url)
}

function LiquidCanvas({ id, state, onIdle }) {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    let disposed = false
    let raf = 0
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' })
    } catch {
      onIdle()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    const canvas = renderer.domElement
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .35s ease'
    el.appendChild(canvas)

    const resize = () => renderer.setSize(el.clientWidth, el.clientHeight, false)
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const scene = new THREE.Scene()
    const cam = new THREE.Camera()
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uA: { value: null },
        uB: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uTime: { value: 0 },
      },
    })
    scene.add(new THREE.Mesh(geo, mat))

    const mouse = new THREE.Vector2(0.5, 0.5)
    let hover = 0
    let shown = false
    const t0 = performance.now()

    const tick = (now) => {
      if (disposed) return
      const t = (now - t0) / 1000
      if (state.auto) {
        state.x = 0.5 + Math.sin(t * 0.9) * 0.28
        state.y = 0.5 + Math.cos(t * 1.3) * 0.24
      }
      mouse.x += (state.x - mouse.x) * 0.16
      mouse.y += (state.y - mouse.y) * 0.16
      hover += ((state.hover ? 1 : 0) - hover) * 0.1
      mat.uniforms.uMouse.value.copy(mouse)
      mat.uniforms.uHover.value = hover
      mat.uniforms.uTime.value = t
      renderer.render(scene, cam)
      if (!shown) {
        shown = true
        canvas.style.opacity = '1'
      }
      if (!state.hover && hover < 0.01) {
        onIdle()
        return
      }
      raf = requestAnimationFrame(tick)
    }

    Promise.all([loadTexture(productImage(id, 'photo')), loadTexture(productImage(id, 'xray'))])
      .then(([a, b]) => {
        if (disposed) return
        mat.uniforms.uA.value = a
        mat.uniforms.uB.value = b
        raf = requestAnimationFrame(tick)
      })
      .catch(() => onIdle())

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return <div ref={host} className="pointer-events-none absolute inset-0" />
}

export default function LiquidImage({ id, className = '', alt }) {
  const wrap = useRef(null)
  const state = useRef({ x: 0.5, y: 0.5, hover: false, auto: false })
  const [mounted, setMounted] = useState(false)

  // warm the image cache so first hover is instant
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 400))
    const h = idle(() => {
      loadTexture(productImage(id, 'photo'))
      loadTexture(productImage(id, 'xray'))
    })
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(h) : clearTimeout(h))
  }, [id])

  // touch / no-hover devices: auto-play while the card is in the middle of the viewport
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        state.current.auto = e.isIntersecting
        state.current.hover = e.isIntersecting
        if (e.isIntersecting) setMounted(true)
      },
      { rootMargin: '-38% 0px -38% 0px' },
    )
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  const move = (e) => {
    if (e.pointerType === 'touch') return
    const r = wrap.current.getBoundingClientRect()
    state.current.x = (e.clientX - r.left) / r.width
    state.current.y = 1 - (e.clientY - r.top) / r.height
  }

  return (
    <div
      ref={wrap}
      className={`relative aspect-square w-full overflow-hidden ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return
        move(e)
        state.current.hover = true
        setMounted(true)
      }}
      onPointerMove={move}
      onPointerLeave={(e) => {
        if (e.pointerType === 'touch') return
        state.current.hover = false
      }}
    >
      <img
        src={productImage(id, 'photo')}
        alt={alt}
        draggable={false}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {mounted && <LiquidCanvas id={id} state={state.current} onIdle={() => setMounted(false)} />}
    </div>
  )
}
