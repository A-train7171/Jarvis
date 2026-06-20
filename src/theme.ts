/**
 * Pocket Trainer brand kit — single source of truth for design tokens.
 * These values must match the marketing site and the prototype exactly.
 */

export const colors = {
  jet: "#050505",
  charcoal: "#101014",
  charcoal2: "#15151A",
  line: "#26262C",
  primary: "#8B2EFF",
  deep: "#5B18C9",
  glow: "#B65CFF",
  white: "#FFFFFF",
  light: "#D9D9D9",
  muted: "#8A8A92",
  // semantic
  good: "#3FD18B",
  warn: "#FFB020",
  bad: "#FF5C5C",
} as const;

export const gradient =
  "linear-gradient(135deg,#5B18C9,#8B2EFF 55%,#B65CFF)";

export const radius = {
  card: 16,
  pill: 999,
  sm: 10,
} as const;

export const font = {
  display: "'Montserrat', system-ui, sans-serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

/** Heading style: italic + uppercase + heavy. */
export const displayHeading: React.CSSProperties = {
  fontFamily: font.display,
  fontWeight: 800,
  fontStyle: "italic",
  textTransform: "uppercase",
  letterSpacing: "0.01em",
};

export const shadow = {
  card: "0 8px 24px rgba(0,0,0,0.35)",
  glow: `0 0 24px ${colors.glow}66`,
} as const;
