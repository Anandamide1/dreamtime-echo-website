/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dreamtime': {
          50: '#fef7ee',
          100: '#fdecd6',
          200: '#fad5ac',
          300: '#f6b677',
          400: '#f08d40',
          500: '#ec6f1a',
          600: '#dd5610',
          700: '#b7410f',
          800: '#923414',
          900: '#762c13',
        },
        'ochre': {
          50: '#fef9f3',
          100: '#fef0e6',
          200: '#fcddc0',
          300: '#f9c394',
          400: '#f59e66',
          500: '#f17d43',
          600: '#e25d1f',
          700: '#bc4517',
          800: '#963718',
          900: '#792f17',
        }
      },
      fontFamily: {
        'indigenous': ['Georgia', 'serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

