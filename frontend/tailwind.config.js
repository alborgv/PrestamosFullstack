/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        'anton': ['Anton', 'sans-serif']
      },
      colors: {
        pryColor: "#25223b",
        secColor: "#1d1a36",
        navColorDark: "#221f3b",
        lightMode: "",
        darkMode: "#2d2b45",
        bgStartCard: "#1f2937",
        bgMiddleCard: "#1f2937",
        bgEndCard: "#ffffff"
      },
    },
  },
  plugins: [],
}

