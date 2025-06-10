// src/components/GlassStaggerList.jsx
export default function GlassStaggerList({ children }) {
  return (
    <div>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
              className="opacity-0 animate-stagger-in"
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}