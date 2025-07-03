/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode (e.g. <html class="dark">)
  darkMode: 'class',

  // Paths to all template files
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // Custom color overlays for glass backgrounds
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.6)',
          dark: 'rgba(24, 24, 27, 0.6)', // dark zinc tone at 60%
        },
      },

      // Smooth backdrop blur layers
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },

      // Rounded elements for VisionOS UI
      borderRadius: {
        '3xl': '1.5rem',
        pill: '9999px',
      },

      // Shadows for floating glass elements
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        vision:
          'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 12px rgba(0,0,0,0.1)',
      },

      // Custom font stack for UI polish
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },

  // Official plugins for form resets, typography, and responsive ratios
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}