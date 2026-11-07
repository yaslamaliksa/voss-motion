import { navigate } from '../../lib/router'

/** Anchor that routes without a reload but stays a real, crawlable, middle-clickable link. */
export default function RouteLink({ to, children, className = '', cursor = 'link', onNavigate, ...rest }) {
  return (
    <a
      href={`#${to}`}
      data-cursor={cursor}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onNavigate?.()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
