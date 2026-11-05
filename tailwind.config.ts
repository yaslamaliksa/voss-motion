import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0D0D0D",
        ink: "#F2F1EC",
        mute: "#9A9A94",
        lime: "#C6FF3D",
        violet: "#8B5CFF",
        line: "rgba(255,255,255,0.12)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "Arial Black", "system-ui", "sans-serif"],
        body: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: { expo: "cubic-bezier(.16,1,.3,1)" },
    },
  },
  plugins: [],
};
export default config;
