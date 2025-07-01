import { useEffect, useCallback, ElementType, KeyboardEvent } from 'react'
import clsx from 'clsx'

interface PageLayoutProps {
  title: string
  children: React.ReactNode
  center?: boolean
  as?: ElementType
  elevation?: 'none' | 'md' | 'lg'
  padding?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  description?: string
  id?: string
  onClose?: () => void
}

export default function PageLayout({
  title,
  children,
  center = true,
  as: Component = 'div',
  elevation = 'md',
  padding = 'p-6',
  maxWidth = 'lg',
  description,
  id,
  onClose,
}: PageLayoutProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | MakerWorks`
    }

    console.groupCollapsed(`[PageLayout] Mount: ${title}`)
    console.debug('[PageLayout] Title:', title)
    console.groupEnd()

    return () => {
      console.debug(`[PageLayout] Unmount: ${title}`)
    }
  }, [title])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && onClose) {
        console.debug('[PageLayout] ESC pressed — triggering onClose')
        onClose()
      }
    },
    [onClose]
  )

  const shadow =
    elevation === 'none'
      ? ''
      : elevation === 'lg'
        ? 'shadow-2xl'
        : 'shadow-xl'

  const width =
    maxWidth === 'full'
      ? 'max-w-full'
      : maxWidth === 'xl'
        ? 'max-w-6xl'
        : maxWidth === 'lg'
          ? 'max-w-4xl'
          : maxWidth === 'md'
            ? 'max-w-2xl'
            : 'max-w-xl'

  return (
    <div
      className="w-full min-h-screen px-4 py-8 flex justify-center items-start bg-gradient-to-b from-white/80 to-zinc-100 dark:from-zinc-900/90 dark:to-zinc-950 text-zinc-900 dark:text-white"
      aria-describedby={description ? `${id}-description` : undefined}
    >
      <Component
        id={id}
        role="region"
        aria-label={title}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        className={clsx(
          'w-full',
          width,
          padding,
          'rounded-3xl glass-card',
          shadow,
          'transition-all outline-none',
          center && 'flex flex-col items-center justify-center text-center space-y-6'
        )}
      >
        {title && (
          <h1 className="text-3xl font-bold tracking-tight" id={`${id}-title`}>
            {title}
          </h1>
        )}
        {description && (
          <p className="text-zinc-500 text-sm max-w-prose" id={`${id}-description`}>
            {description}
          </p>
        )}
        <div className="w-full">{children}</div>
      </Component>
    </div>
  )
}