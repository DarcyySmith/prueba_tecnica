/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8eaf6',
          100: '#c5cae9',
          500: '#3f51b5',
          600: '#1565c0',
          700: '#0d47a1',
          900: '#1a237e',
        }
      }
    },
  },
  plugins: [],
}

