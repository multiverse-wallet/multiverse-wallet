const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    './libs/**/*.{html,js,ts,tsx,jsx}',
    './apps/**/*.{html,js,ts,tsx,jsx}',
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
        header: [...fontFamily.serif],
        "light-header": [...fontFamily.serif],
      },
      colors: {
        ...colors,
        gray: colors.slate,
      },
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite",
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
