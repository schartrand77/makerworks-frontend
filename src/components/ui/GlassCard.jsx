import { useRef } from 'react'

const themeClasses = {
  light: 'bg-white/40 text-black',
  dark: 'bg-white/5 text-white',
  auto: 'bg-white/10 dark:bg-white/5 text-white',
}

const sizeClasses = {
  compact: 'p-4 rounded-xl min-h-[120px]',
  medium: 'p-6 rounded-2xl min-h-[180px]',
  expanded: 'p-8 rounded-3xl min-h-[260px]',
}

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  glass: 'shadow-[0_12px_40px_rgba(0,0,0,0.3)]',
}

export default function GlassCard({
  children,
  theme = 'auto',
  size = 'expanded',
  elevation = 'xl',
  hoverEffect = false,
  ripple = false,
  focusRing = false,
  onClick,
  className = '',
}) {
  const ref = useRef(null)

  const bg = themeClasses[theme] || themeClasses.auto
  const shape = sizeClasses[size] || sizeClasses.expanded
  const shadow = shadowClasses[elevation] || shadowClasses.xl
  const interactive = onClick ? 'cursor-pointer active:scale-[0.99]' : ''
  const hover = hoverEffect ? 'hover:brightness-110 hover:shadow-2xl transition-transform duration-200' : ''
  const focus = focusRing ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400' : ''

  const handleRipple = (e) => {
    if (!ripple || !ref.current) return
    const circle = document.createElement('span')
    const diameter = Math.max(ref.current.clientWidth, ref.current.clientHeight)
    const radius = diameter / 2

    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - ref.current.getBoundingClientRect().left - radius}px`
    circle.style.top = `${e.clientY - ref.current.getBoundingClientRect().top - radius}px`
    circle.classList.add('ripple')
    const rippleContainer = ref.current.querySelector('.ripple-container') || ref.current
    rippleContainer.appendChild(circle)

    setTimeout(() => circle.remove(), 600)
  }

  return (
    <div
      ref={ref}
      onClick={(e) => {
        if (ripple) handleRipple(e)
        if (onClick) onClick(e)
      }}
      className={`relative overflow-hidden border border-white/15 backdrop-blur-2xl transition-all duration-300 ${bg} ${shape} ${shadow} ${hover} ${interactive} ${focus} ${className}`}
    >
      {ripple && <span className="absolute inset-0 pointer-events-none ripple-container" />}
      {children}
    </div>
  )
}