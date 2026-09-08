/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#f2f4ff',
          100: '#e5e9fe',
          400: '#7d84f2',
          500: '#6c63e8',
          600: '#5647d6',
          700: '#4636b3',
        },
        accent: {
          500: '#ff7e5f',
          600: '#f4633f',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6c63e8 0%, #8f6ae8 45%, #ff7e5f 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #f2f4ff 0%, #fdf1ee 100%)',
      },
      boxShadow: {
        glow: '0 8px 40px -8px rgba(108, 99, 232, 0.45)',
        card: '0 2px 8px rgba(20, 20, 43, 0.04), 0 12px 24px -8px rgba(20, 20, 43, 0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
