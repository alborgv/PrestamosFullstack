/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'anton': ['Anton', 'sans-serif']
      },
      colors: {
        bgStartCard: "#1f2937",
        bgMiddleCard: "#1f2937",
        bgEndCard: "#ffffff"
      },
    },
  },
  plugins: [],
}

