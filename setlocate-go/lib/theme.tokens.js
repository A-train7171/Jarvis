const colors = {
  bg: {
    primary: "#000000",
    surface: "#1A1A1A",
    surfaceElevated: "#2A2A2A",
  },
  accent: {
    primary: "#FFD60A",
    streak: "#FF6B35",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#888888",
    tertiary: "#666666",
  },
  border: {
    subtle: "#222222",
    locked: "#333333",
  },
};

const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
};

const radii = {
  card: "16px",
  button: "12px",
  pill: "9999px",
};

const fontSize = {
  hero: ["28px", { lineHeight: "32px" }],
  title: ["20px", { lineHeight: "24px" }],
  section: ["18px", { lineHeight: "22px" }],
  body: ["15px", { lineHeight: "20px" }],
  small: ["13px", { lineHeight: "18px" }],
  caption: ["11px", { lineHeight: "14px" }],
};

module.exports = { colors, spacing, radii, fontSize };
