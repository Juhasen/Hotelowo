/** @type {import('tailwindcss').Config} */
const {primaryBrown, secondaryBrown} = require("./src/app/[locale]/lib/themeColors");
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    colors:[
        primaryBrown,
        secondaryBrown
    ]

  },
  plugins: [],
}

