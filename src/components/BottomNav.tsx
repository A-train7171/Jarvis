import { colors } from "@/theme";
import type { Route } from "@/routes";
import { IconHome, IconNutrition, IconDumbbell, IconCoach, IconCalendar } from "./icons";

const TABS: { route: Route; label: string; Icon: (p: { size?: number }) => JSX.Element }[] = [
  { route: "home", label: "Home", Icon: IconHome },
  { route: "nutrition", label: "Nutrition", Icon: IconNutrition },
  { route: "workouts", label: "Workouts", Icon: IconDumbbell },
  { route: "coach", label: "Coach", Icon: IconCoach },
  { route: "schedule", label: "Schedule", Icon: IconCalendar },
];

export function BottomNav({ active, onNavigate }: { active: Route; onNavigate: (r: Route) => void }) {
  return (
    <nav
      aria-label="Primary"
      style={{
        position: "sticky",
        bottom: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
        background: "rgba(16,16,20,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${colors.line}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map(({ route, label, Icon }) => {
        const on = active === route;
        return (
          <button
            key={route}
            onClick={() => onNavigate(route)}
            aria-current={on ? "page" : undefined}
            style={{
              background: "transparent",
              border: "none",
              padding: "10px 4px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: on ? colors.glow : colors.muted,
            }}
          >
            <Icon size={22} />
            <span style={{ fontSize: 11, fontWeight: on ? 700 : 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
