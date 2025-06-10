// src/components/AuthInput.jsx
export default function AuthInput({ id, type, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <input
        id={id}
        type={type}
        aria-label={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
        placeholder={placeholder}
      />
    </div>
  )
}