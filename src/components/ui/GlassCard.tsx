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
  glow?: boolean
}

export default function GlassCard<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  elevation = 'md',
  padding = 'p-6',
  maxWidth = 'lg',
  glow = true,
  ...props
}: GlassCardProps<T> & ComponentPropsWithoutRef<T>) {
  const Component = as || 'div'

  return (
    <Component
      className={clsx(
        'glass-card',
        elevationClasses[elevation],
        maxWidthClasses[maxWidth],
        padding,
        glow &&
          'shadow-[0_8px_20px_rgba(128,128,128,0.15)]', // 🔷 updated grey glow
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
