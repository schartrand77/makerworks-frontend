// src/components/ThemeToggle.jsx
import { useThemeStore } from '../store/useThemeStore'

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="text-white/70">Theme:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-white/10 border border-white/20 text-white px-2 py-1 rounded-md focus:outline-none"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}