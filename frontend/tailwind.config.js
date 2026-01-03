/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
      Play: ["Playfair"],
    },
    extend: {
      colors: {
        "custom-violet": "#362E4A",
        "Custom-Nav": "#a7a8a6",
        "Custom-HeroO": "#494b46",
        "custom-Hero": "#AF5441",
        "custom-body": "#212220",
        "custom-dashboard": "#414240",
        "custom-input": "#3c3d3b",
      },
    },
  },
  plugins: [],
};
