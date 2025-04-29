/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfitThin: ['outfitThin', 'sans-serif'],
        outfitSemiBold: ['outfitSemiBold', 'sans-serif'],
        outfitRegular: ['outfitRegular', 'sans-serif'],
        outfitMedium: ['outfitMedium', 'sans-serif'],
        outfitLight: ['outfitLight', 'sans-serif'],
        outfitBold: ['outfitBold', 'sans-serif'],
        outfitBlack: ['outfitBlack', 'sans-serif'],
        houseBrush: ['houseBrush', 'sans-serif'],
      }
    },
  },
  plugins: [],
};