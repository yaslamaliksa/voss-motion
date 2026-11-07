import { useSyncExternalStore } from 'react'

/**
 * Minimal hash router. Zero server config, zero full reloads, works with
 * AnimatePresence page transitions. Routes: "/", "/shop", "/product/:id"
 */
const getPath = () => (typeof window === 'undefined' ? '/' : window.location.hash.replace(/^#/, '') || '/')

const subscribe = (cb) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function usePath() {
  return useSyncExternalStore(subscribe, getPath, () => '/')
}

export function navigate(to) {
  if (getPath() === to) return
  window.location.hash = to
}

export function matchRoute(path) {
  if (path === '/' || path === '') return { name: 'home', params: {} }
  if (path === '/shop') return { name: 'shop', params: {} }
  const m = path.match(/^\/product\/([\w-]+)$/)
  if (m) return { name: 'product', params: { id: m[1] } }
  return { name: 'home', params: {} }
}
