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
        "orange-ink": "#AD4F0F",
        "orange-soft": "#FDF0E0",
        peach: "#F4D2A5",
        brown: "#402312",
        clay: "#8D6543",
        red: "#B83935",
        divider: "#EFE4D6",
        ink: "#344054",
        charcoal: "#171717",
        surface: "#F2F4F7",
        accent: "#FD853A",
        "accent-deep": "#BB3F17",
        muted: "#ADA4A4",
        line: "#D9D9D9"
      },
      boxShadow: {
        card: "0 10px 25px rgba(64, 35, 18, 0.06)",
        "card-hover": "0 25px 45px rgba(64, 35, 18, 0.12)",
        float: "0 20px 55px rgba(52, 64, 84, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
