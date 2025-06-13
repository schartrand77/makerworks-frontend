// src/components/ui/GlassCard.jsx
export default function GlassCard({ children }) {
  return (
    <div className="backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 shadow-xl rounded-2xl p-8">
      {children}
    </div>
  )
}