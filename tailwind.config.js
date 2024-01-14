/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#3C88FA",
        secondary: "#003483",
        "grey-100": "#F8F8F8",
        "grey-300": "#CBCBCD",
        "grey-500": "#9A9A9A",
        "grey-900": "#313131",
      },
      fontFamily: {
        suite: ["SUITE Variable", "sans-serif"],
        dangam: ["CWDangamAsac-Bold"],
      },
    },
  },
  plugins: [],
};
