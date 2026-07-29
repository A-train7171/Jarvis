"use client";

import { useState } from "react";
import { Ruler, Bell, Shield, Trash2, RefreshCw, User2 } from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { Card, Field, Input, Button, SectionHeader, Badge } from "@/components/ui";
import type { Goal, ExperienceLevel, Unit } from "@/types";
import { GOAL_LABEL, LEVEL_LABEL, cn } from "@/lib/utils";

const GOALS: Goal[] = ["lose_fat", "build_muscle", "get_stronger", "improve_endurance", "stay_active"];
const LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];

export default function SettingsPage() {
  const hydrated = useHydrated();
  const profile = usePT((s) => s.profile);
  const targets = usePT((s) => s.targets);
  const setProfile = usePT((s) => s.setProfile);
  const resetAll = usePT((s) => s.resetAll);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notify, setNotify] = useState(true);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Settings" subtitle="Tune Pocket Trainer to you." />

      {/* Profile */}
      <SectionHeader title="Your profile" />
      <Card className="space-y-4">
        <Field label="Name">
          <Input value={profile.name} onChange={(e) => setProfile({ name: e.target.value })} />
        </Field>

        <Field label="Primary goal">
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Toggle key={g} active={profile.goal === g} onClick={() => setProfile({ goal: g })}>
                {GOAL_LABEL[g]}
              </Toggle>
            ))}
          </div>
        </Field>

        <Field label="Experience">
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <Toggle key={l} active={profile.experience === l} onClick={() => setProfile({ experience: l })}>
                {LEVEL_LABEL[l]}
              </Toggle>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={profile.units === "metric" ? "Weight (kg)" : "Weight (kg base)"}>
            <Input
              type="number"
              value={profile.weightKg}
              onChange={(e) => setProfile({ weightKg: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Height (cm)">
            <Input
              type="number"
              value={profile.heightCm}
              onChange={(e) => setProfile({ heightCm: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Age">
            <Input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ age: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Weekly target (sessions)">
            <Input
              type="number"
              value={profile.weeklyTarget}
              onChange={(e) => setProfile({ weeklyTarget: Number(e.target.value) || 0 })}
            />
          </Field>
        </div>
      </Card>

      {/* Computed targets */}
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-primary">Daily targets</span>
          <Badge tone="muted">auto</Badge>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            ["kcal", targets.kcal],
            ["P", `${targets.protein}g`],
            ["C", `${targets.carbs}g`],
            ["F", `${targets.fat}g`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-line bg-bg-surface/40 p-2">
              <div className="stat-number text-base text-ink-primary">{hydrated ? v : "—"}</div>
              <div className="text-[10px] uppercase tracking-wider text-ink-muted">{k}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
          Estimated from your inputs for general guidance only. Not a medical or dietary prescription.
        </p>
      </Card>

      {/* Preferences */}
      <SectionHeader title="Preferences" className="mt-6" />
      <Card className="divide-y divide-line">
        <Row icon={Ruler} label="Units">
          <div className="flex gap-1.5">
            {(["metric", "imperial"] as Unit[]).map((u) => (
              <Toggle key={u} active={profile.units === u} onClick={() => setProfile({ units: u })}>
                {u === "metric" ? "Metric" : "Imperial"}
              </Toggle>
            ))}
          </div>
        </Row>
        <Row icon={Bell} label="Reminders">
          <Switch on={notify} onToggle={() => setNotify((v) => !v)} />
        </Row>
        <Row icon={Shield} label="Data & privacy">
          <span className="text-[12px] text-ink-muted">Stored on device</span>
        </Row>
      </Card>

      {/* Danger zone */}
      <Card className="mt-6 border-danger/20">
        <div className="flex items-center gap-2 text-danger">
          <RefreshCw size={16} />
          <span className="text-sm font-semibold">Reset app data</span>
        </div>
        <p className="mt-1.5 text-[12px] text-ink-muted">
          Clears your logged food, sessions, streak, and chat on this device. Cannot be undone.
        </p>
        {confirmReset ? (
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" fullWidth onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} fullWidth onClick={() => { resetAll(); setConfirmReset(false); }}>
              Reset everything
            </Button>
          </div>
        ) : (
          <Button variant="danger" size="sm" className="mt-3" onClick={() => setConfirmReset(true)}>
            Reset…
          </Button>
        )}
      </Card>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-muted">
        <User2 size={12} /> Pocket Trainer v2 · Your Coach. In Your Pocket.
      </p>
    </div>
  );
}

function Toggle({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-1.5 text-[13px] font-medium transition-colors",
        active ? "border-purple/60 bg-purple/15 text-white" : "border-line bg-bg-surface/40 text-ink-secondary hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof Ruler; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
      <span className="flex items-center gap-2.5 text-sm text-ink-primary">
        <Icon size={16} className="text-ink-muted" /> {label}
      </span>
      {children}
    </div>
  );
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn("relative h-6 w-11 rounded-full transition-colors", on ? "bg-purple" : "bg-bg-surface")}
      role="switch"
      aria-checked={on}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform", on ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}
