import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#030303",
      orange: "#FC6432",
      gray: "#0D0D0D",
      green: "#7BF178",
    },
  },
  plugins: [],
};
export default config;
