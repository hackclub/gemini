import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3DDC84", // Android Green
        secondary: "#2DA568", // Darker Android Green
        accent: "#1B5E20", // Deep Green
        "gemini-black": "#17171d",
        "gemini-blue": "#4285F4",
        "gemini-yellow": "#FFD600",
        "gemini-muted": "#7a787d",
        "gemini-smoke": "#f5f5f7",
      },
      fontFamily: {
        garamond: ["VC Garamond", "Garamond", "serif"],
        sans: ["Phantom Sans", "system-ui", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config

