import { colors } from "@/theme";

export type MuscleGroup = "Chest" | "Back" | "Shoulders" | "Legs" | "Arms" | "Core";

/**
 * Original anterior-view muscle-map illustration. Hand-drawn vector shapes — no
 * scraped or copyrighted anatomy images. The selected group is highlighted in
 * brand purple.
 */
export function MuscleMap({ active, size = 150 }: { active?: MuscleGroup; size?: number }) {
  const on = (g: MuscleGroup) => (active === g ? colors.primary : "#23232a");
  const stroke = "#34343c";
  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 120 200" role="img" aria-label={`Muscle map${active ? `: ${active}` : ""}`}>
      {/* head + neck */}
      <circle cx="60" cy="20" r="12" fill="#23232a" stroke={stroke} />
      <rect x="54" y="30" width="12" height="8" rx="3" fill="#23232a" stroke={stroke} />
      {/* shoulders */}
      <path d="M38 44c-8 1-12 6-13 12 6-2 12-3 18-3z" fill={on("Shoulders")} stroke={stroke} />
      <path d="M82 44c8 1 12 6 13 12-6-2-12-3-18-3z" fill={on("Shoulders")} stroke={stroke} />
      {/* chest */}
      <path d="M44 44c-6 2-9 7-9 14 0 6 6 9 14 9 5 0 9-2 11-5V44z" fill={on("Chest")} stroke={stroke} />
      <path d="M76 44c6 2 9 7 9 14 0 6-6 9-14 9-5 0-9-2-11-5V44z" fill={on("Chest")} stroke={stroke} />
      {/* arms (biceps) */}
      <path d="M30 58c-4 6-5 16-4 26 4-1 7-4 8-9 1-7 0-13-1-18z" fill={on("Arms")} stroke={stroke} />
      <path d="M90 58c4 6 5 16 4 26-4-1-7-4-8-9-1-7 0-13-1-18z" fill={on("Arms")} stroke={stroke} />
      <path d="M26 86c-2 8-2 16-1 24 3-1 5-5 5-11 0-5-2-9-4-13z" fill={on("Arms")} stroke={stroke} />
      <path d="M94 86c2 8 2 16 1 24-3-1-5-5-5-11 0-5 2-9 4-13z" fill={on("Arms")} stroke={stroke} />
      {/* core / abdomen */}
      <rect x="46" y="78" width="28" height="34" rx="6" fill={on("Core")} stroke={stroke} />
      <path d="M60 80v30M48 90h24M48 100h24" stroke={stroke} strokeWidth="1" />
      {/* legs (quads) */}
      <path d="M46 116c-3 16-3 36 0 54 5-1 8-6 9-15 1-13 0-27-2-39z" fill={on("Legs")} stroke={stroke} />
      <path d="M74 116c3 16 3 36 0 54-5-1-8-6-9-15-1-13 0-27 2-39z" fill={on("Legs")} stroke={stroke} />
      {/* back hint label band */}
      <text x="60" y="195" textAnchor="middle" fill={active === "Back" ? colors.glow : colors.muted} fontSize="8">
        {active === "Back" ? "Back engaged" : ""}
      </text>
    </svg>
  );
}
