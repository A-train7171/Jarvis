import { colors, displayHeading, gradient } from "@/theme";
import { Button } from "./ui";
import { Confetti } from "./Confetti";

/**
 * Full-screen celebration overlay with a confetti burst. Used when a workout is
 * finished or the user levels up. Optional "Share" CTA hooks into share banners.
 */
export function Celebration({
  title,
  subtitle,
  leveledUp,
  onDone,
  onShare,
}: {
  title: string;
  subtitle: string;
  leveledUp?: boolean;
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
        background: "rgba(5,5,5,0.92)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Confetti />

      <div className="pt-fade" style={{ position: "relative", textAlign: "center", maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{leveledUp ? "🔥" : "✅"}</div>
        <h2
          style={{
            ...displayHeading,
            fontSize: 30,
            margin: "0 0 10px",
            background: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </h2>
        <p style={{ color: colors.light, fontSize: 15, margin: "0 0 28px" }}>{subtitle}</p>

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
