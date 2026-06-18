import type { ReactNode } from "react";
import { colors, displayHeading, gradient } from "@/theme";
import { Button } from "./ui";
import { Confetti } from "./Confetti";

/**
 * Full-screen celebration overlay with a confetti burst. `leveledUp` makes the
 * moment bigger — heavier confetti, larger headline, and a glow — since a rank
 * tier is the marquee finish. Optional "Share" CTA hooks into share banners.
 */
export function Celebration({
  title,
  subtitle,
  leveledUp,
  badge,
  onDone,
  onShare,
}: {
  title: string;
  subtitle: string;
  leveledUp?: boolean;
  badge?: ReactNode;
  onDone: () => void;
  onShare?: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        background: "rgba(5,5,5,0.93)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Confetti intensity={leveledUp ? "big" : "normal"} />

      <div
        className="pt-pop"
        style={{ position: "relative", textAlign: "center", maxWidth: 380, width: "100%" }}
      >
        <div
          style={{ fontSize: leveledUp ? 80 : 56, marginBottom: 10, animation: "pt-bob 2.4s ease-in-out infinite" }}
        >
          {leveledUp ? "🔥" : "✅"}
        </div>

        {badge && (
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              border: `1px solid ${colors.primary}`,
              background: "rgba(139,46,255,0.16)",
              color: colors.glow,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {badge}
          </div>
        )}

        <h2
          style={{
            ...displayHeading,
            fontSize: leveledUp ? 42 : 30,
            lineHeight: 1.05,
            margin: "0 0 12px",
            background: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: leveledUp ? "drop-shadow(0 0 22px rgba(182,92,255,0.55))" : "none",
          }}
        >
          {title}
        </h2>
        <p style={{ color: colors.light, fontSize: leveledUp ? 16 : 15, margin: "0 0 30px" }}>{subtitle}</p>

        <div style={{ display: "grid", gap: 10 }}>
          {onShare && (
            <Button variant="ghost" onClick={onShare}>
              Share a banner
            </Button>
          )}
          <Button onClick={onDone}>Done</Button>
        </div>
      </div>
    </div>
  );
}
