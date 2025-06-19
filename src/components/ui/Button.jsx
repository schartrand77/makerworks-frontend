import { forwardRef } from 'react'
import clsx from 'clsx'

const Button = forwardRef(
  (
    {
      children,
      icon,
      onClick,
      type = 'button',
      size = 'md',
      theme = 'auto',
      variant = 'solid',
      ripple = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full backdrop-blur-md shadow-inner hover:shadow-lg'

    const themeClasses = {
      auto: {
        solid: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30',
        ghost: 'bg-transparent text-white hover:bg-white/10 border border-transparent dark:text-white',
      },
      light: {
        solid: 'bg-white text-black hover:bg-neutral-100 border border-neutral-300',
        ghost: 'text-black hover:bg-neutral-200 border border-transparent',
      },
      dark: {
        solid: 'bg-neutral-900 text-white hover:bg-neutral-800 border border-white/10',
        ghost: 'text-white hover:bg-white/10 border border-transparent',
      },
    }

    const safeSize = sizeClasses[size] || sizeClasses.md
    const safeTheme = themeClasses[theme] || themeClasses.auto
    const safeVariant = safeTheme[variant] || themeClasses.auto.solid

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={clsx(baseClasses, safeSize, safeVariant, className)}
        {...props}
      >
        {icon}
        {children}
      </button>
    )
  }
)

export default Button