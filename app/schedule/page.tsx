"use client";

import { useRouter } from "next/navigation";
import { Play, Moon, Dumbbell, Check } from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { PROGRAMS } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = usePT((s) => s.profile);
  const history = usePT((s) => s.history);
  const startSession = usePT((s) => s.startSession);

  const program = PROGRAMS[0];
  // Distribute the weekly target across the week (simple even-ish spread).
  const target = profile.weeklyTarget;
  const trainDays = pickTrainDays(target);

  const todayIdx = (new Date().getDay() + 6) % 7;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - todayIdx);
  weekStart.setHours(0, 0, 0, 0);
  const doneDays = new Set(
    history
      .filter((s) => new Date(s.dateISO) >= weekStart)
      .map((s) => (new Date(s.dateISO).getDay() + 6) % 7)
  );

  return (
    <div className="animate-fade-up">
      <PageHeader title="Schedule" subtitle={`${program.title} · ${target}×/week`} />

      <div className="space-y-3">
        {DAYS.map((day, i) => {
          const isTrain = trainDays.includes(i);
          const workout = isTrain ? program.workouts[trainDays.indexOf(i) % program.workouts.length] : null;
          const isToday = i === todayIdx;
          const completed = hydrated && doneDays.has(i);
          return (
            <Card
              key={day}
              className={cn("flex items-center gap-4 p-4", isToday && "border-purple/50 shadow-glow-sm")}
            >
              <div className="flex w-12 shrink-0 flex-col items-center">
                <span className={cn("text-[11px] uppercase tracking-wider", isToday ? "text-purple-glow" : "text-ink-muted")}>
                  {day}
                </span>
                <span className={cn("stat-number text-lg", isToday ? "text-ink-primary" : "text-ink-secondary")}>
                  {String(weekDate(weekStart, i)).padStart(2, "0")}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                {workout ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Dumbbell size={15} className="text-purple" />
                      <span className="text-sm font-semibold text-ink-primary">{workout.title}</span>
                      {isToday && <Badge tone="purple">Today</Badge>}
                    </div>
                    <div className="text-[11px] text-ink-muted">{workout.durationMin} min · {workout.exercises.length} exercises</div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Moon size={15} /> <span className="text-sm">Rest &amp; recover</span>
                  </div>
                )}
              </div>

              {workout &&
                (completed ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check size={17} />
                  </span>
                ) : (
                  <Button
                    size="sm"
                    icon={Play}
                    onClick={() => { startSession(workout.id); router.push("/session"); }}
                  >
                    Start
                  </Button>
                ))}
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[12px] text-ink-muted">
        Rest days are part of the plan — that&apos;s when your body adapts and gets stronger.
      </p>
    </div>
  );
}

function pickTrainDays(target: number): number[] {
  const clamped = Math.max(1, Math.min(6, target));
  // Reasonable default splits that keep rest between hard days.
  const maps: Record<number, number[]> = {
    1: [2],
    2: [1, 4],
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
  };
  return maps[clamped] ?? [0, 2, 4];
}

function weekDate(weekStart: Date, offset: number): number {
  const d = new Date(weekStart);
  d.setDate(weekStart.getDate() + offset);
  return d.getDate();
}
