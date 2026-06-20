import { gradient } from "@/theme";

/** Kettlebell "PT" mark. Original art (no scraped images). */
export function Logo({ size = 36, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  const gid = "pt-logo-grad";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label="Pocket Trainer"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5B18C9" />
            <stop offset="0.55" stopColor="#8B2EFF" />
            <stop offset="1" stopColor="#B65CFF" />
          </linearGradient>
        </defs>
        {/* kettlebell body */}
        <path
          d="M24 12c-7 0-12 5-12 13 0 6 4 10 12 10s12-4 12-10c0-8-5-13-12-13z"
          fill={`url(#${gid})`}
        />
        {/* handle */}
        <path
          d="M18 16c0-4 2.6-7 6-7s6 3 6 7"
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* PT monogram */}
        <text
          x="24"
          y="30.5"
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="13"
          fill="#0A0A0C"
        >
          PT
        </text>
      </svg>
      {withWordmark && (
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            textTransform: "uppercase",
            background: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontSize: size * 0.5,
            letterSpacing: "0.02em",
          }}
        >
          Pocket Trainer
        </span>
      )}
    </span>
  );
}
