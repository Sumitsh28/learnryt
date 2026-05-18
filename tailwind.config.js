/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#2A264F", // The deep purple/navy background
          dark: "#1C1A38", // Even darker shade for cards/modals
          lime: "#C6F432", // The vibrant green action color
          peach: "#F9C0AB", // The soft orange accent
          gray: "#8A88A4", // Muted text color for the dark theme
          light: "#F8F9FA", // Light mode background
          card: "#FFFFFF", // Light mode card background
        },
      },
    },
  },
  plugins: [],
};
