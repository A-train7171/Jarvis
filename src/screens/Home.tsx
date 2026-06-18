import { colors, displayHeading } from "@/theme";
import { Card, ProgressBar, SectionTitle } from "@/components/ui";
import { Avatar } from "@/components/Avatar";
import { RankRing } from "@/components/RankRing";
import { useApp } from "@/store/AppContext";
import { totalMacros } from "@/lib/nutrition";
import { todayISO } from "@/lib/util";
import type { Route } from "@/routes";
import type { ShareKind } from "@/lib/shareCard";
import {
  IconChevron,
  IconFlame,
  IconDumbbell,
  IconWatch,
  IconCamera,
  IconFeed,
  IconInfo,
  IconCalendar,
  IconShare,
} from "@/components/icons";

export function Home({
  onNavigate,
  onShare,
}: {
  onNavigate: (r: Route) => void;
  onShare: (kind?: ShareKind) => void;
}) {
  const { state } = useApp();
  const today = todayISO();
  const macros = totalMacros(state.food[today]);
  const lastWorkout = state.workouts.find((w) => w.completed);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = state.name.split(" ")[0] || "there";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, paddingBottom: 28 }} className="pt-fade">
      {/* greeting + avatar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ color: colors.muted, fontSize: 13 }}>{greeting},</div>
          <div style={{ ...displayHeading, fontSize: 24 }}>{firstName}</div>
        </div>
        <Avatar name={state.name} avatar={state.profile.avatar} size={48} onClick={() => onNavigate("profile")} />
      </div>

      {/* rank ring */}
      <Card style={{ paddingTop: 22, paddingBottom: 22, marginBottom: 14 }}>
        <RankRing activeDays={state.activeDays} />
      </Card>

      {/* streak + workouts tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Tile
          icon={<IconFlame size={20} />}
          value={`${state.streak}`}
          label={`day streak`}
          accent={colors.warn}
        />
        <Tile
          icon={<IconDumbbell size={20} />}
          value={`${state.workouts.filter((w) => w.completed).length}`}
          label="workouts"
          accent={colors.glow}
        />
      </div>

      {/* nutrition bars */}
      <SectionTitle>Today's nutrition</SectionTitle>
      <Card onClick={() => onNavigate("nutrition")} style={{ display: "grid", gap: 12, marginBottom: 14 }}>
        <ProgressBar value={macros.calories} max={state.goals.cal} label="Calories" />
        <ProgressBar value={macros.protein} max={state.goals.p} label="Protein (g)" color={colors.good} />
        <ProgressBar value={macros.carbs} max={state.goals.c} label="Carbs (g)" color={colors.glow} />
        <ProgressBar value={macros.fat} max={state.goals.f} label="Fat (g)" color={colors.warn} />
        <ProgressBar value={macros.sugar} max={state.goals.sug} label="Sugar (g)" color={colors.bad} />
      </Card>

      {/* from your watch */}
      {(state.connections.watch || state.connections.apple || state.connections.google || state.connections.samsung) &&
      state.health.lastSync ? (
        <>
          <SectionTitle>From your watch</SectionTitle>
          <Card onClick={() => onNavigate("devices")} style={{ marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, textAlign: "center" }}>
              <Metric label="Steps" value={state.health.steps.toLocaleString()} />
              <Metric label="Active" value={`${state.health.activeKcal}`} unit="kcal" />
              <Metric label="Rest HR" value={`${state.health.restingHr}`} unit="bpm" />
              <Metric label="Sleep" value={`${state.health.sleepHrs}`} unit="hr" />
            </div>
          </Card>
        </>
      ) : null}

      {/* smart schedule */}
      <SectionTitle>Smart Schedule</SectionTitle>
      <NavCard
        icon={<IconCalendar size={22} />}
        title="Plan your sessions"
        sub={state.planned.length ? `${state.planned.length} commitment(s) added` : "Add your day, get session slots"}
        onClick={() => onNavigate("schedule")}
      />

      {/* last workout */}
      <SectionTitle style={{ marginTop: 18 }}>Last workout</SectionTitle>
      <Card onClick={() => onNavigate("workouts")} style={{ marginBottom: 14 }}>
        {lastWorkout ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700 }}>
                {lastWorkout.name} <span style={{ color: colors.good }}>✓</span>
              </div>
              <div style={{ color: colors.muted, fontSize: 12 }}>
                {lastWorkout.date} · {lastWorkout.exercises.length} item(s)
              </div>
            </div>
            <IconChevron />
          </div>
        ) : (
          <div style={{ color: colors.muted, fontSize: 13 }}>No completed workouts yet — start one!</div>
        )}
      </Card>

      {/* quick entries */}
      <div style={{ display: "grid", gap: 10 }}>
        <NavCard icon={<IconShare size={22} />} title="Share a banner" sub="Make a card to screenshot or share" onClick={() => onShare()} />
        <NavCard icon={<IconCamera size={22} />} title="Form Check" sub="Check your form with the camera" onClick={() => onNavigate("form")} />
        <NavCard icon={<IconFeed size={22} />} title="Feed" sub="Your activity and milestones" onClick={() => onNavigate("feed")} />
        <NavCard icon={<IconWatch size={22} />} title="Apps & Devices" sub="Sync health & smartwatch" onClick={() => onNavigate("devices")} />
        <NavCard icon={<IconInfo size={22} />} title="About" sub="Founder, mission & sources" onClick={() => onNavigate("about")} />
      </div>
    </div>
  );
}

function Tile({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent: string }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ color: accent }}>{icon}</span>
      <div>
        <div style={{ ...displayHeading, fontSize: 22 }}>{value}</div>
        <div style={{ color: colors.muted, fontSize: 12 }}>{label}</div>
      </div>
    </Card>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <div style={{ ...displayHeading, fontSize: 18 }}>{value}</div>
      <div style={{ color: colors.muted, fontSize: 10.5 }}>
        {unit ? `${unit} · ` : ""}
        {label}
      </div>
    </div>
  );
}

function NavCard({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} ariaLabel={title} style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ color: colors.glow }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div style={{ color: colors.muted, fontSize: 12 }}>{sub}</div>
      </div>
      <IconChevron />
    </Card>
  );
}
