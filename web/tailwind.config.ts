import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "dark-green": {
          100: "#d2d7d6",
          200: "#a4afac",
          300: "#778883",
          400: "#496059",
          500: "#1c3830",
          600: "#162d26",
          700: "#11221d",
          800: "#0b1613",
          900: "#060b0a",
        },
        "fluor-green": {
          100: "#e5fce4",
          200: "#caf9c9",
          300: "#b0f7ae",
          400: "#95f493",
          500: "#7bf178",
          600: "#62c160",
          700: "#4a9148",
          800: "#316030",
          900: "#193018",
        },
        "sd-gray": {
          light: "#F2F2F2",
          DEFAULT: "#797C80",
          dark: "#E0E0E0",
          darker: "#00060F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
