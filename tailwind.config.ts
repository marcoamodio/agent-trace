import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        muted: "var(--muted)",
        "signal-real": "var(--signal-real)",
        "signal-derived": "var(--signal-derived)",
        "signal-convention": "var(--signal-convention)",
      },
    },
  },
  plugins: [],
};
export default config;
