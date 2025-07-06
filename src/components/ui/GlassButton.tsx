// src/components/ui/GlassButton.tsx
import clsx from 'clsx'
import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react'

type GlassButtonVariant = 'primary' | 'secondary' | 'ghost'
type GlassButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  as?: ElementType
  children: ReactNode
  className?: string
  variant?: GlassButtonVariant
  size?: GlassButtonSize
  disabled?: boolean
  loading?: boolean
}

type GlassButtonProps<T extends ElementType = 'button'> = BaseProps &
  ComponentPropsWithoutRef<T>

export default function GlassButton<T extends ElementType = 'button'>({
  as,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ...rest
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

  const isDisabled = disabled || loading

  return (
    <Component
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 pointer-events-none',
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      type={!as || as === 'button' ? 'submit' : undefined}
      {...rest}
    >
      {loading ? (
        <span className="animate-pulse">Loading…</span>
      ) : (
        children
      )}
    </Component>
  )
}
