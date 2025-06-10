// src/components/GlassButton.jsx
export default function GlassButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-xl transition"
    >
      {children}
    </button>
  )
}