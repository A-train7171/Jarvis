/** @type {import('tailwindcss').Config} */
const { colors, spacing, radii, fontSize } = require("./lib/theme.tokens");

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        accent: colors.accent,
        text: colors.text,
        border: colors.border,
      },
      spacing,
      borderRadius: radii,
      fontSize,
    },
  },
  plugins: [],
};
