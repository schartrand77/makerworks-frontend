/* eslint-env node */
/* global require */
/** @type {import('tailwindcss').Config} */

export default {
  // Enable class-based dark mode (e.g., <html class="dark">)
  darkMode: 'class',

  // Paths to all template files
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // Custom colors for VisionOS glass backgrounds & toasts
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.6)',           // Light glass card
          dark: 'rgba(24, 24, 27, 0.6)',              // Dark glass card
        },
        toast: {
          success: 'rgba(34, 197, 94, 0.8)',          // Emerald
          error: 'rgba(239, 68, 68, 0.8)',            // Red
          info: 'rgba(59, 130, 246, 0.8)',            // Blue
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

      // Rounded corners for VisionOS UI
      borderRadius: {
        '3xl': '1.5rem',
        pill: '9999px',
      },

      // Shadows for floating glass elements
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        vision: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 12px rgba(0,0,0,0.1)',
      },

      // Fonts
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Optional: add custom plugin for toast utilities
    function ({ addUtilities, theme }) {
      addUtilities({
        '.toast-success': {
          '@apply text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-md': {},
          backgroundColor: theme('colors.toast.success'),
        },
        '.toast-error': {
          '@apply text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-md': {},
          backgroundColor: theme('colors.toast.error'),
        },
        '.toast-info': {
          '@apply text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-md': {},
          backgroundColor: theme('colors.toast.info'),
        },
      })
    },
  ],
}
