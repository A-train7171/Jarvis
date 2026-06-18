import { colors } from "@/theme";
import { daysToNextRank, rankFor, rankProgress } from "@/lib/ranks";

/** Signature glowing rank ring shown on Home. */
export function RankRing({ activeDays, size = 168 }: { activeDays: number; size?: number }) {
  const rank = rankFor(activeDays);
  const progress = rankProgress(activeDays);
  const toNext = daysToNextRank(activeDays);
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden>
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5B18C9" />
            <stop offset="0.55" stopColor="#8B2EFF" />
            <stop offset="1" stopColor="#B65CFF" />
          </linearGradient>
          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors.line} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          filter="url(#ring-glow)"
          style={{ transition: "stroke-dasharray .6s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            textTransform: "uppercase",
            fontSize: 24,
            background: "linear-gradient(135deg,#8B2EFF,#B65CFF)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {rank}
        </span>
        <span style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
          {toNext > 0 ? `${toNext} active day${toNext === 1 ? "" : "s"} to next` : "Max rank"}
        </span>
      </div>
    </div>
  );
}
