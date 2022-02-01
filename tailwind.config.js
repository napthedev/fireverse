module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#242526",
        "dark-lighten": "#3A3B3C",
        primary: "#0D90F3",
      },
    },
    keyframes: {
      "fade-in": {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
    },
    animation: {
      "fade-in": "fade-in 0.3s forwards",
    },
  },
  plugins: [],
};
