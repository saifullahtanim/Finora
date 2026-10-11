/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'wallet-green': {
          DEFAULT: '#009360',
          50: '#e6f7f0',
          100: '#9cd5b6',
          400: '#3cb37e',
          500: '#00aa70',
          600: '#009360',
          700: '#007d51',
          800: '#006843',
          10: '#21cb87',
        },
        'board-blue': {
          DEFAULT: '#0069de',
          400: '#3189ff',
          600: '#0069de',
          10: '#007AFF',
        },
        'app-colors': {
          positive: '#21cb87',
          negative: '#fe3b2c',
          neutral: '#ffa000',
          blue: '#007AFF',
          needle: '#354052',
          pivot: '#3C5273',
          muted: '#7f8fa4',
          border: '#ccd2db',
          bg: '#eff0f2',
        },
        brand: {
          50: '#e6f7f0',
          100: '#9cd5b6',
          200: '#71c49a',
          300: '#59bb8c',
          400: '#3cb37e',
          500: '#00aa70',
          600: '#009360',
          700: '#007d51',
          800: '#006843',
          900: '#005335',
        },
        slate: {
          850: '#172033',
        },
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-lg': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -6px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'dark-card': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
