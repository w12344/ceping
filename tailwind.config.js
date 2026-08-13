/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#FFE100",
          navy: "#1E2066",
          darkNavy: "#2D3092",
          paper: "#FFFDF6",
          softYellow: "#FFFDF5",
          line: "#FDE68A",
          accent: "#D97706"
        }
      }
    }
  },
  plugins: []
};
