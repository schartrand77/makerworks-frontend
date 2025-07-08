import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="
            px-4 py-2 rounded-xl text-sm
            backdrop-blur-md bg-white/60 dark:bg-zinc-800/70
            border border-white/30 dark:border-zinc-700/50
            shadow text-black dark:text-white
            pointer-events-auto
          "
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast