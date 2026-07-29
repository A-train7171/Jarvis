"use client";

import Link from "next/link";
import {
  Flame,
  Dumbbell,
  Salad,
  ScanLine,
  Sparkles,
  ChevronRight,
  Play,
  TrendingUp,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import { usePT, consumedMacros } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { greeting, GOAL_LABEL } from "@/lib/utils";
import { PROGRAMS, exerciseById } from "@/lib/data";
import { Card, ProgressRing, ProgressBar, ButtonLink, SectionHeader, Badge } from "@/components/ui";

export default function HomePage() {
  const hydrated = useHydrated();
  const profile = usePT((s) => s.profile);
  const foods = usePT((s) => s.foods);
  const targets = usePT((s) => s.targets);
  const streak = usePT((s) => s.streak);
  const history = usePT((s) => s.history);
  const waterMl = usePT((s) => s.waterMl);

  const consumed = consumedMacros(foods);
  const kcalLeft = Math.max(0, targets.kcal - consumed.kcal);
  const kcalRatio = targets.kcal ? consumed.kcal / targets.kcal : 0;

  // This week's sessions
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const weekSessions = history.filter((s) => new Date(s.dateISO) >= weekStart).length;
  const weekRatio = profile.weeklyTarget ? weekSessions / profile.weeklyTarget : 0;

  // Suggested next workout
  const nextWorkout = PROGRAMS[0].workouts[history.length % 2];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Greeting */}
      <div>
        <p className="text-sm text-ink-muted">{greeting()},</p>
        <h1 className="display-italic text-3xl text-ink-primary">
          {hydrated ? profile.name : "Athlete"}
        </h1>
        <p className="mt-1 text-[13px] text-ink-secondary">
          Goal: <span className="text-purple-glow">{GOAL_LABEL[profile.goal]}</span> · Let&apos;s make today count.
        </p>
      </div>

      {/* Today rings */}
      <Card glow className="overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center">
            <ProgressRing value={kcalRatio} size={132} stroke={13} color="var(--purple)">
              <span className="stat-number text-2xl text-ink-primary">
                {hydrated ? kcalLeft : targets.kcal}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-ink-muted">kcal left</span>
            </ProgressRing>
          </div>
          <div className="flex-1 space-y-3">
            <MacroLine label="Protein" value={consumed.protein} target={targets.protein} color="var(--macro-protein)" ready={hydrated} />
            <MacroLine label="Carbs" value={consumed.carbs} target={targets.carbs} color="var(--macro-carbs)" ready={hydrated} />
            <MacroLine label="Fat" value={consumed.fat} target={targets.fat} color="var(--macro-fat)" ready={hydrated} />
          </div>
        </div>
        <Link
          href="/nutrition"
          className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-bg-surface/40 px-4 py-2.5 text-sm text-ink-secondary transition-colors hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Droplets size={15} className="text-macro-carbs" />
            Water · {hydrated ? (waterMl / 1000).toFixed(1) : "0.0"} L
          </span>
          <span className="flex items-center gap-1 text-purple-glow">Log nutrition <ChevronRight size={15} /></span>
        </Link>
      </Card>

      {/* Streak + weekly */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <Flame size={15} className="text-warn" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Streak</span>
          </div>
          <div className="stat-number mt-2 text-3xl text-ink-primary">{hydrated ? streak : 0}</div>
          <p className="text-[11px] text-ink-muted">days in a row 🔥</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <TrendingUp size={15} className="text-purple" />
            <span className="text-[11px] font-medium uppercase tracking-wider">This week</span>
          </div>
          <div className="stat-number mt-2 text-3xl text-ink-primary">
            {hydrated ? weekSessions : 0}
            <span className="text-base text-ink-muted">/{profile.weeklyTarget}</span>
          </div>
          <ProgressBar value={weekRatio} className="mt-2.5" />
        </Card>
      </div>

      {/* Today's workout */}
      <div>
        <SectionHeader title="Today's plan" action={<Link href="/workout" className="text-xs text-purple-glow">All workouts</Link>} />
        <Card className="relative overflow-hidden p-0">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple/20 blur-3xl" />
          <div className="relative p-5">
            <div className="flex items-center gap-2">
              <Badge tone="purple">{PROGRAMS[0].title}</Badge>
              <span className="text-xs text-ink-muted">{nextWorkout.durationMin} min</span>
            </div>
            <h3 className="mt-3 display-italic text-2xl text-ink-primary">{nextWorkout.title}</h3>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink-secondary">
              {nextWorkout.exercises.slice(0, 4).map((e) => (
                <span key={e.exerciseId} className="text-ink-muted">
                  {exerciseById(e.exerciseId)?.name}
                </span>
              ))}
            </div>
            <ButtonLink href="/workout" icon={Play} fullWidth className="mt-5">
              Start workout
            </ButtonLink>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <SectionHeader title="Jump in" />
        <div className="grid grid-cols-2 gap-3">
          <QuickAction href="/workout" icon={Dumbbell} title="Train" sub="Start a session" />
          <QuickAction href="/nutrition" icon={Salad} title="Log food" sub="Track macros" />
          <QuickAction href="/form" icon={ScanLine} title="Form check" sub="Analyze a lift" />
          <QuickAction href="/coach" icon={Sparkles} title="Ask coach" sub="Get guidance" />
        </div>
      </div>
    </div>
  );
}

function MacroLine({
  label,
  value,
  target,
  color,
  ready,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
  ready: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[12px]">
        <span className="text-ink-secondary">{label}</span>
        <span className="text-ink-muted">
          <span className="stat-number text-sm text-ink-primary">{ready ? value : 0}</span> / {target} g
        </span>
      </div>
      <ProgressBar value={target ? value / target : 0} color={color} />
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  sub,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-line bg-bg-card p-4 transition-colors hover:border-purple/50"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple/10 text-purple transition-colors group-hover:bg-purple/20">
        <Icon size={20} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink-primary">{title}</span>
        <span className="block text-[11px] text-ink-muted">{sub}</span>
      </span>
    </Link>
  );
}
