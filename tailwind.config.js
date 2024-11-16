/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#106EBE',
        'secondary': '#0FFCBE',
        'primary-light': '#2d95ed',
        'secondary-light': '#5bfdd2',
      }
    },
  },
  plugins: [],
}

