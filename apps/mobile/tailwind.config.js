/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        safe: "#39FF14",
        alert: "#FF10F0",
        surface: "#0a0a0a",
        rejected: "#FF3333",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
