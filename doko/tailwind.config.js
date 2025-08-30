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
        primary: '#2e7d32',
        'primary-light': '#4caf50',
        secondary: '#ff9800',
        dark: '#1b5e20',
        light: '#f1f8e9',
      },
    },
    },
    plugins: [],
}