import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces — dark-first command center
        bg: {
          base: "var(--bg-base)", // #050505 jet
          card: "var(--bg-card)", // #121212 charcoal
          surface: "var(--bg-surface)", // #1F1F1F gray
          overlay: "var(--bg-overlay)",
        },
        line: {
          DEFAULT: "var(--line)", // #2C2C2E
          strong: "var(--line-strong)",
        },
        // Text
        ink: {
          primary: "var(--ink-primary)", // #FFFFFF
          secondary: "var(--ink-secondary)", // #D9D9D9
          muted: "var(--ink-muted)", // #8A8A92
        },
        // Purple system
        purple: {
          DEFAULT: "var(--purple)", // #8B2EFF
          deep: "var(--purple-deep)", // #5B18C9
          glow: "var(--purple-glow)", // #B65CFF
        },
        // Semantic
        success: "var(--success)",
        warn: "var(--warn)",
        danger: "var(--danger)",
        // Macro / metric accents
        protein: "var(--macro-protein)",
        carbs: "var(--macro-carbs)",
        fat: "var(--macro-fat)",
      },
      fontFamily: {
        display: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        card: "var(--radius-card)", // 20px
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 32px -4px var(--purple-glow-soft)",
        "glow-sm": "0 0 18px -6px var(--purple-glow-soft)",
        card: "0 8px 32px rgba(0,0,0,0.45)",
        lift: "0 20px 60px rgba(0,0,0,0.6)",
        "inner-line": "inset 0 0 0 1px var(--line)",
      },
      backgroundImage: {
        "purple-gradient":
          "linear-gradient(135deg, var(--purple-glow) 0%, var(--purple) 45%, var(--purple-deep) 100%)",
        "purple-soft":
          "linear-gradient(135deg, rgba(139,46,255,0.16), rgba(91,24,201,0.06))",
      },
      keyframes: {
        "fade-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-glow": "pulse-glow 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
