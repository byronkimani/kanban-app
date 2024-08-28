/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "mainBackgroundColor": "#f4f5f7",
        "columnBackgroundColor": "#ffffff",
        "accentColor": "#6470cd"
      }
    },
  },
  plugins: [],
}

