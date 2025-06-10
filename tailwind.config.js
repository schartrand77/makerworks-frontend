import './styles/globals.css'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // Enables system-wide or manual dark/light theming
  theme: {
    extend: {
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31,38,135,0.37)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '6px',
        xl: '18px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.3)',
        }
      },
    },
  },
  plugins: [],
}