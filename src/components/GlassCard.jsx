// components/GlassCard.jsx
export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`glass-panel p-6 ${className}`}>
      {children}
    </div>
  )
}