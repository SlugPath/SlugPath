import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "bg-light": "#e2e8f0",
      "bg-dark": "#10142c",
      blue: "#1e40af",
      "secondary-blue": "#0a2744", // FIXME: rename to darker blue
      "tertiary-blue": "#0b6bcb", // FIXME: rename to lighter blue
      "hover-blue": "#93c5fd",
      "hover-secondary-blue": "#12467b",
      grey: "#8899a6",
      "dark-grey": "#22303c",
      "light-text": "#f1f5f9",
      "light-secondary-text": "#e2e8f0",
      "dark-text": "#27272a",
      "warning-light": "#ffedd5",
      "warning-dark": "#fdba74",
    },
    extend: {
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
