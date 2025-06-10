// src/components/GlassTransition.jsx
export default function GlassTransition({ children }) {
  return (
    <div className="transition-all duration-300 ease-in-out transform animate-slide-fade">
      {children}
    </div>
  )
}