import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF5EF",
        orange: "#D96A1C",
        peach: "#F4D2A5",
        brown: "#402312",
        clay: "#8D6543",
        red: "#B83935",
        divider: "#EFE4D6"
      },
      boxShadow: {
        card: "0 10px 25px rgba(64, 35, 18, 0.06)",
        "card-hover": "0 25px 45px rgba(64, 35, 18, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
