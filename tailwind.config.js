export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#eae3d5',
          300: '#ddd4c0',
          400: '#c9b99a',
          500: '#b89d7a',
          600: '#a68966',
          700: '#8a7054',
          800: '#6f5a47',
          900: '#5a4a3c',
        },
      },
    },
  },
  plugins: [],
}
