// src/components/GlassLayout.jsx
export default function GlassLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0c0c0c] via-[#121212] to-[#1a1a1a] text-white">
      {/* Optional animated lighting layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black opacity-60 pointer-events-none z-0" />
      <div className="relative z-10 backdrop-blur-3xl">{children}</div>
    </div>
  )
}