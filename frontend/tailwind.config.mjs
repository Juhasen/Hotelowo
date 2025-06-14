/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        primaryBrown: "#8D6E63",  // odpowiednik brown[400]
        secondaryBrown: "#6D4C41", // odpowiednik brown[600]
      }
    }
  },
  plugins: [],
};

export default tailwindConfig;
