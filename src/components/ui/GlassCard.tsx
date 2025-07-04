import { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'

type Elevation = 'none' | 'md' | 'lg'
type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const elevationClasses: Record<Elevation, string> = {
  none: '',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

interface GlassCardProps<T extends ElementType = 'div'> {
  as?: T
  children: ReactNode
  className?: string
  elevation?: Elevation
  padding?: string
  maxWidth?: MaxWidth
}

export default function GlassCard<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  elevation = 'md',
  padding = 'p-6',
  maxWidth = 'lg',
  ...props
}: GlassCardProps<T> & ComponentPropsWithoutRef<T>) {
  const Component = as || 'div'

  return (
    <Component
      className={clsx(
        'glass-card rounded-xl border border-white/30 dark:border-zinc-700/40 backdrop-blur bg-white/70 dark:bg-zinc-800/60 transition-all',
        elevationClasses[elevation],
        maxWidthClasses[maxWidth],
        padding,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
