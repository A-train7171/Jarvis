import { useState } from "react";
import { colors, displayHeading } from "@/theme";
import { Screen } from "@/components/Screen";
import { Button, Card, Disclaimer, SectionTitle, Spinner } from "@/components/ui";
import { IconWatch, IconCheck } from "@/components/icons";
import { useApp } from "@/store/AppContext";
import type { Connections } from "@/types";

const SOURCES: { key: keyof Connections; label: string; sub: string }[] = [
  { key: "apple", label: "Apple Health", sub: "Steps, workouts, heart rate (iOS / HealthKit)" },
  { key: "samsung", label: "Samsung Health", sub: "Steps, sleep, heart rate (Android)" },
  { key: "google", label: "Google Fit / Health Connect", sub: "Steps, active energy, sleep (Android)" },
  { key: "watch", label: "Smartwatch", sub: "Live heart rate & workouts" },
];

export function Devices({ onBack }: { onBack: () => void }) {
  const { state, set } = useApp();
  const [syncing, setSyncing] = useState(false);
  const anyConnected = Object.values(state.connections).some(Boolean);

  function toggle(key: keyof Connections) {
    set((prev) => ({ ...prev, connections: { ...prev.connections, [key]: !prev.connections[key] } }));
  }

  // Milestone 1: preview sync with representative sample data. Milestone 4 wires
  // Health Connect / HealthKit / Samsung Health through Capacitor plugins.
  async function sync() {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 700));
    set((prev) => ({
      ...prev,
      health: {
        steps: 6000 + Math.floor(Math.random() * 6000),
        activeKcal: 300 + Math.floor(Math.random() * 400),
        restingHr: 56 + Math.floor(Math.random() * 12),
        sleepHrs: Math.round((6 + Math.random() * 2.5) * 10) / 10,
        lastSync: new Date().toISOString(),
      },
    }));
    setSyncing(false);
  }

  return (
    <Screen title="Apps & Devices" onBack={onBack}>
      <Card style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, background: colors.charcoal }}>
        <span style={{ color: colors.glow }}><IconWatch size={26} /></span>
        <div style={{ fontSize: 13, color: colors.light }}>
          Connect a health source to pull steps, active calories, resting heart rate, sleep and
          workouts onto your Home screen.
        </div>
      </Card>

      <SectionTitle>Sources</SectionTitle>
      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {SOURCES.map((s) => {
          const on = state.connections[s.key];
          return (
            <Card key={s.key} style={{ display: "flex", alignItems: "center", gap: 12, borderColor: on ? colors.primary : colors.line }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{s.label}</div>
                <div style={{ color: colors.muted, fontSize: 12 }}>{s.sub}</div>
              </div>
              <button
                onClick={() => toggle(s.key)}
                style={{
                  border: `1px solid ${on ? colors.good : colors.line}`,
                  background: on ? "rgba(63,209,139,0.14)" : "transparent",
                  color: on ? colors.good : colors.light,
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {on ? <><IconCheck size={14} /> Connected</> : "Connect"}
              </button>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Synced today</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        {state.health.lastSync ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              <Metric label="Steps" value={state.health.steps.toLocaleString()} />
              <Metric label="Active energy" value={`${state.health.activeKcal} kcal`} />
              <Metric label="Resting HR" value={`${state.health.restingHr} bpm`} />
              <Metric label="Sleep" value={`${state.health.sleepHrs} hr`} />
            </div>
            <div style={{ color: colors.muted, fontSize: 11, marginTop: 12 }}>
              Last synced {new Date(state.health.lastSync).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div style={{ color: colors.muted, fontSize: 13 }}>No data yet. Connect a source and sync.</div>
        )}
      </Card>

      <Button onClick={sync} disabled={syncing || !anyConnected}>
        {syncing ? <Spinner /> : "Sync now"}
      </Button>
      {!anyConnected && (
        <p style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>Connect at least one source to sync.</p>
      )}

      <p style={{ color: colors.muted, fontSize: 11.5, marginTop: 14 }}>
        Native health integrations (HealthKit, Health Connect, Samsung Health) are wired on device.
        On the web this screen shows a representative preview.
      </p>
      <Disclaimer />
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ ...displayHeading, fontSize: 20 }}>{value}</div>
      <div style={{ color: colors.muted, fontSize: 12 }}>{label}</div>
    </div>
  );
}
