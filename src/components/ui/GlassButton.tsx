import clsx from 'clsx'
import { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'

type GlassButtonVariant = 'primary' | 'secondary' | 'ghost'
type GlassButtonSize = 'sm' | 'md' | 'lg'

interface GlassButtonProps<T extends ElementType = 'button'> {
  as?: T
  children: ReactNode
  className?: string
  variant?: GlassButtonVariant
  size?: GlassButtonSize
  disabled?: boolean
} & ComponentPropsWithoutRef<T>

export default function GlassButton<T extends ElementType = 'button'>({
  as,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}: GlassButtonProps<T>) {
  const Component = as || 'button'

  const base =
    'inline-flex items-center justify-center font-medium transition-all rounded-pill backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  const variants = {
    primary:
      'bg-black/80 text-white dark:bg-white/80 dark:text-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    secondary:
      'bg-zinc-200/80 text-black dark:bg-zinc-700/70 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600',
    ghost:
      'bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/40 dark:hover:bg-zinc-700/40',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2',
    lg: 'text-lg px-6 py-3',
  }

  return (
    <Component
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  )
}