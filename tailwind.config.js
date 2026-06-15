/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#FDF7F0',
          100: '#F9EBD9',
          200: '#F3D7B5',
          300: '#EAC18B',
          400: '#DFA962',
          500: '#D4A574',
          600: '#C08B4F',
          700: '#A06F3C',
          800: '#7A542E',
          900: '#553A20',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF0E0',
        },
        mint: {
          400: '#98D497',
          500: '#7FB77E',
          600: '#5E9A5D',
        },
        coral: {
          400: '#FFA5A5',
          500: '#FF8A8A',
          600: '#E86B6B',
        },
        sky: {
          400: '#A8DDF5',
          500: '#89CFF0',
          600: '#5EB3DC',
        },
        lavender: {
          400: '#C9B8E8',
          500: '#B19CD9',
          600: '#947CC4',
        },
      },
      fontFamily: {
        display: ['"Comic Sans MS"', '"Chalkboard SE"', 'cursive', 'sans-serif'],
        handwrite: ['"Comic Sans MS"', '"Chalkboard SE"', 'cursive'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(180, 140, 100, 0.15)',
        'card-hover': '0 8px 30px rgba(180, 140, 100, 0.25)',
        'soft': '0 2px 12px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
