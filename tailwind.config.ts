import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#ecf0ff",
          500: "#5b63d3",
          600: "#4a51b8",
          700: "#3b4196",
        },
      },
    },
  },
  plugins: [],
};
export default config;
