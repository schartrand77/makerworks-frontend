// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.08)',
        'glass-light': 'rgba(255, 255, 255, 0.12)',
        'glass-dark': 'rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
        '2xl': '40px',
        '3xl': '60px',
      },
      boxShadow: {
        glass: '0 4px 40px rgba(255,255,255,0.05)',
        glow: '0 0 80px rgba(255,255,255,0.08)',
        inset: 'inset 0 1px 1px rgba(255,255,255,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}