/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        primary: {
          50: '#e6edfd',
          100: '#c2d2fa',
          200: '#9ab5f5',
          300: '#6a91ec',
          400: '#356ae3',
          500: '#034ed2',
          600: '#0245b8',
          700: '#02358a',
        },
        neutral: {
          50: '#f1f5f9',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        success: {
          50: '#dcfce7',
          500: '#16a34a',
          700: '#166534',
        },
        error: {
          50: '#fee2e2',
          500: '#dc2626',
          700: '#991b1b',
        },
        warning: {
          50: '#fef3c7',
          500: '#d97706',
          700: '#92400e',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      addUtilities({
        '.perspective': {
          'perspective': '1000px'
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d'
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden'
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)'
        }
      })
    }
  ],
} 