import { motion } from 'framer-motion'

export default function GlassSection({ children, className = '', animate = true }) {
  const base =
    'w-full max-w-[1400px] rounded-[30px] bg-white/5 dark:bg-white/2 backdrop-blur-xl border border-white/10 p-6 shadow-xl relative z-10'

  if (!animate) {
    return <div className={`${base} ${className}`}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${base} ${className}`}
    >
      {children}
    </motion.div>
  )
}