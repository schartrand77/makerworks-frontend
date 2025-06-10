// src/components/GlassFadeIn.jsx
export default function GlassFadeIn({ children }) {
  return (
    <div className="opacity-0 animate-fade-in">
      {children}
    </div>
  )
}