"use client";

import Link from "next/link";
import { Flame, Dumbbell, Timer, TrendingUp, Award, Target, Settings, type LucideIcon } from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { Card, StatTile, Badge, ProgressBar, SectionHeader } from "@/components/ui";
import { GOAL_LABEL, LEVEL_LABEL, heightLabel, kg, compactNumber } from "@/lib/utils";

export default function ProfilePage() {
  const hydrated = useHydrated();
  const profile = usePT((s) => s.profile);
  const history = usePT((s) => s.history);
  const streak = usePT((s) => s.streak);
  const analyses = usePT((s) => s.analyses);

  const totalVolume = history.reduce((a, s) => a + s.volumeKg, 0);
  const totalMin = history.reduce((a, s) => a + s.durationMin, 0);
  const avgForm = analyses.length
    ? Math.round(analyses.reduce((a, x) => a + x.score, 0) / analyses.length)
    : 0;

  // Simple milestone ladder
  const nextMilestone = history.length < 10 ? 10 : history.length < 25 ? 25 : 50;

  return (
    <div className="animate-fade-up">
      <PageHeader title="Profile" />

      {/* Identity */}
      <Card glow className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-gradient text-2xl font-bold text-white shadow-glow-sm display-italic">
          {(hydrated ? profile.name : "A").slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="display-italic text-xl text-ink-primary">{hydrated ? profile.name : "Athlete"}</h2>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge tone="purple">{GOAL_LABEL[profile.goal]}</Badge>
            <Badge tone="muted">{LEVEL_LABEL[profile.experience]}</Badge>
          </div>
        </div>
        <Link href="/settings" aria-label="Settings" className="text-ink-muted hover:text-white">
          <Settings size={20} />
        </Link>
      </Card>

      {/* Body basics */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniStat label="Weight" value={hydrated ? kg(profile.weightKg, profile.units) : "—"} />
        <MiniStat label="Height" value={hydrated ? heightLabel(profile.heightCm, profile.units) : "—"} />
        <MiniStat label="Age" value={hydrated ? `${profile.age}` : "—"} />
      </div>

      {/* Lifetime stats */}
      <div className="mt-6">
        <SectionHeader title="Lifetime" />
        <div className="grid grid-cols-2 gap-3">
          <StatTile icon={Flame} label="Streak" value={hydrated ? streak : 0} sub="days in a row" />
          <StatTile icon={Dumbbell} label="Sessions" value={hydrated ? history.length : 0} sub="completed" />
          <StatTile icon={TrendingUp} label="Volume" value={hydrated ? `${compactNumber(totalVolume)}` : 0} sub="kg lifted" />
          <StatTile icon={Timer} label="Time" value={hydrated ? `${Math.round(totalMin / 60)}h` : "0h"} sub="training" />
        </div>
      </div>

      {/* Form quality */}
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-purple" />
            <span className="text-sm font-semibold text-ink-primary">Avg. form score</span>
          </div>
          <span className="stat-number text-xl text-ink-primary">{hydrated ? avgForm : 0}</span>
        </div>
        <ProgressBar value={avgForm / 100} className="mt-3" />
        <p className="mt-2 text-[12px] text-ink-muted">Across {hydrated ? analyses.length : 0} analyzed lifts.</p>
      </Card>

      {/* Milestone */}
      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-purple" />
          <span className="text-sm font-semibold text-ink-primary">Next milestone</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between text-sm">
          <span className="text-ink-secondary">{nextMilestone} sessions</span>
          <span className="text-ink-muted">
            <span className="stat-number text-ink-primary">{hydrated ? history.length : 0}</span> / {nextMilestone}
          </span>
        </div>
        <ProgressBar value={(hydrated ? history.length : 0) / nextMilestone} className="mt-2" />
      </Card>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-card p-3 text-center">
      <div className="stat-number text-lg text-ink-primary">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-ink-muted">{label}</div>
    </div>
  );
}
