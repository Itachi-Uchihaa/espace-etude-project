/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7372B7",
          light: "#7372B7",
          dark: "#7372B7",
        },
        secondary: {
          DEFAULT: "#9A9A9A",
          light: "#9A9A9A",
          dark: "#9A9A9A",
        },
        primarytext: {
          DEFAULT: "#212121",
          light: "#212121",
          dark: "#212121",
        },
        secondarytext: {
          DEFAULT: "#9A9A9A",
          light: "#9A9A9A",
          dark: "#9A9A9A",
        },
        inputColor: {
          DEFAULT: "#F5F5F5",
          light: "#F5F5F5",
          dark: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
