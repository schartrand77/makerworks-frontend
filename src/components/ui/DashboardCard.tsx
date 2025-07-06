import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { MouseEvent, ReactNode } from 'react'

type DashboardCardProps = {
  title: string
  description: string
  icon?: ReactNode
  to?: string
  onClick?: (e: MouseEvent) => void
  onNavigate?: (path: string) => void
  className?: string
  children?: ReactNode
}

export default function DashboardCard({
  title,
  description,
  icon,
  to,
  onClick,
  onNavigate,
  className = '',
  children,
}: DashboardCardProps) {
  const Wrapper = to
    ? (props: any) => (
        <Link
          to={to}
          onClick={(e) => {
            onClick?.(e)
            if (onNavigate) {
              console.debug(`[DashboardCard] Triggered navigation to ${to}`)
              onNavigate(to)
            }
          }}
          {...props}
        />
      )
    : (props: any) => (
        <div
          onClick={onClick}
          {...props}
        />
      )

  return (
    <Wrapper
      className={cn(
        'rounded-xl shadow-md border border-zinc-300/30 dark:border-zinc-700/50 p-6 bg-white/70 dark:bg-zinc-800/60 backdrop-blur transition hover:shadow-lg cursor-pointer space-y-2',
        className
      )}
    >
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {children}
    </Wrapper>
  )
}
