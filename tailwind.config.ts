import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Poppins'", "system-ui", "-apple-system", "sans-serif"],
        poppins: ["'Poppins'", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nepal: {
          crimson: "#DC143C",
          blue: "#003893",
          navy: "#0a192f",
          gold: "#D4AF37",
        },
      },
      boxShadow: {
        'clean': '0 2px 12px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -1px rgba(0, 0, 0, 0.03)',
        'clean-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'glow-rose': '0 0 25px -5px rgba(225, 29, 72, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
