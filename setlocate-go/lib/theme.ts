const tokens = require("./theme.tokens.js") as {
  colors: {
    bg: { primary: string; surface: string; surfaceElevated: string };
    accent: { primary: string; streak: string };
    text: { primary: string; secondary: string; tertiary: string };
    border: { subtle: string; locked: string };
  };
  spacing: Record<string, string>;
  radii: { card: string; button: string; pill: string };
  fontSize: Record<string, [string, { lineHeight: string }]>;
};

export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const radii = tokens.radii;
export const fontSize = tokens.fontSize;

export const weight = {
  regular: "400" as const,
  medium: "500" as const,
  bold: "700" as const,
};
