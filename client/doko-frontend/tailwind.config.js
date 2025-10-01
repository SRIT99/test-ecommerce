/** @type {import('tailwindcss').Config} */
export default {
     darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
             colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        agricultural: {
          green: '#22c55e',
          brown: '#a16207',
          yellow: '#eab308',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
    },
    plugins: [],
}