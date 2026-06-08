import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff1f1",
          100: "#ffe4e4",
          200: "#ffcccc",
          300: "#ffa3a3",
          400: "#ff6b6b",
          500: "#f83b3b",
          600: "#e51b1b",
          700: "#c11212",
          800: "#9f1313",
          900: "#831717",
          950: "#470707",
        },
        safe: {
          500: "#22c55e",
          600: "#16a34a",
        },
        warn: {
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          500: "#ef4444",
          600: "#dc2626",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
