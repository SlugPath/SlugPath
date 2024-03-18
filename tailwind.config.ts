import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-light": "#e2e8f0",
        "bg-dark": "#203354",

        "bg-faded-dark": "#172554",

        "primary-100": "#bfdbfe",
        "primary-200": "#93c5fd",
        "primary-400": "#0b6bcb",
        "primary-500": "#3b82f6",
        "primary-700": "#12467b",
        "primary-900": "#0a2744",

        "secondary-100": "#f1f5f9",
        "secondary-200": "#e2e8f0",
        "secondary-300": "#cbd5e1",
        "secondary-900": "#27272a",

        "warning-light": "#ffedd5",
        "warning-dark": "#fdba74",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
