import { forwardRef } from 'react'
import clsx from 'clsx'

const IconButton = forwardRef(
  ({ icon: Icon, onClick, title, size = 'md', theme = 'auto', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    }

    const themeClasses = {
      light: 'bg-white/10 text-black hover:bg-white/20',
      dark: 'bg-black/10 text-white hover:bg-black/20',
      auto: 'bg-white/10 text-white hover:bg-white/20 dark:bg-black/10 dark:text-white dark:hover:bg-black/20',
    }

    return (
      <button
        ref={ref}
        onClick={onClick}
        title={title}
        className={clsx(
          'inline-flex items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          sizeClasses[size],
          themeClasses[theme],
          className
        )}
        {...props}
      >
        {Icon && <Icon className="w-5 h-5 pointer-events-none" />}
      </button>
    )
  }
)

export default IconButton