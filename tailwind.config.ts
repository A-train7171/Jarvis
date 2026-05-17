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
        bg: {
          base: "var(--bg-base)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        accent: {
          primary: "var(--accent-primary)",
          warm: "var(--accent-warm)",
          cool: "var(--accent-cool)",
          gold: "var(--accent-gold)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        divider: "var(--divider)",
        success: "var(--success)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        cinematic: "-0.02em",
        meta: "0.08em",
      },
      borderRadius: {
        card: "14px",
        btn: "8px",
      },
      backdropBlur: {
        glass: "14px",
      },
      keyframes: {
        pulseGold: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,209,102,0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgba(255,209,102,0)" },
        },
        ringExpand: {
          "0%": { transform: "scale(0.6)", opacity: "0.9" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-gold": "pulseGold 2.2s ease-out infinite",
        "ring-expand": "ringExpand 1.6s ease-out forwards",
        "float-in": "floatIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
