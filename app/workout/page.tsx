"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Clock,
  Dumbbell,
  ChevronDown,
  Hammer,
  History,
  Layers,
} from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { PROGRAMS, exerciseById } from "@/lib/data";
import type { Program, Workout } from "@/types";
import { Card, Button, ButtonLink, Badge, SectionHeader, EmptyState } from "@/components/ui";
import { LEVEL_LABEL, cn } from "@/lib/utils";

export default function WorkoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const active = usePT((s) => s.active);
  const history = usePT((s) => s.history);
  const startSession = usePT((s) => s.startSession);

  function begin(w: Workout) {
    startSession(w.id);
    router.push("/session");
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="display-italic text-3xl text-ink-primary">Workout</h1>
          <p className="mt-1 text-[13px] text-ink-secondary">Programs built to progress you.</p>
        </div>
        <Link href="/builder" className="text-xs text-purple-glow">Build custom</Link>
      </div>

      {/* Resume banner */}
      {hydrated && active && (
        <Card glow className="flex items-center justify-between p-4">
          <div>
            <Badge tone="success">In progress</Badge>
            <div className="mt-2 text-sm font-semibold text-ink-primary">{active.title}</div>
            <div className="text-[11px] text-ink-muted">Pick up where you left off</div>
          </div>
          <ButtonLink href="/session" icon={Play} size="sm">Resume</ButtonLink>
        </Card>
      )}

      {/* Programs */}
      <div>
        <SectionHeader title="Programs" action={<span className="flex items-center gap-1 text-xs text-ink-muted"><Layers size={13} />{PROGRAMS.length}</span>} />
        <div className="space-y-3">
          {PROGRAMS.map((p) => (
            <ProgramCard key={p.id} program={p} onStart={begin} />
          ))}
        </div>
      </div>

      {/* Custom builder CTA */}
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple/10 text-purple">
            <Hammer size={20} />
          </span>
          <div>
            <div className="text-sm font-semibold text-ink-primary">Workout Builder</div>
            <div className="text-[11px] text-ink-muted">Design your own session</div>
          </div>
        </div>
        <ButtonLink href="/builder" variant="secondary" size="sm">Open</ButtonLink>
      </Card>

      {/* History */}
      <div>
        <SectionHeader title="Recent sessions" action={<span className="flex items-center gap-1 text-xs text-ink-muted"><History size={13} />{hydrated ? history.length : 0}</span>} />
        {!hydrated || history.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No sessions yet"
            body="Start a program above and your completed workouts will show up here with volume and time."
          />
        ) : (
          <div className="space-y-2">
            {history.slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-2xl border border-line bg-bg-card p-4">
                <div>
                  <div className="text-sm font-semibold text-ink-primary">{s.title}</div>
                  <div className="text-[11px] text-ink-muted">
                    {new Date(s.dateISO).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {s.durationMin} min · {s.sets} sets
                  </div>
                </div>
                <div className="text-right">
                  <div className="stat-number text-lg text-ink-primary">{s.volumeKg.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted">kg volume</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgramCard({ program, onStart }: { program: Program; onStart: (w: Workout) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden p-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-5 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: program.accent }} />
            <span className="text-[11px] uppercase tracking-wider text-ink-muted">{LEVEL_LABEL[program.level]}</span>
          </div>
          <h3 className="mt-1.5 display-italic text-xl text-ink-primary">{program.title}</h3>
          <p className="truncate text-[13px] text-ink-secondary">{program.subtitle}</p>
          <div className="mt-2 flex gap-3 text-[11px] text-ink-muted">
            <span>{program.daysPerWeek}×/week</span>
            <span>{program.weeks} weeks</span>
            <span>{program.focus}</span>
          </div>
        </div>
        <ChevronDown size={20} className={cn("shrink-0 text-ink-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-2 border-t border-line p-4">
          {program.workouts.map((w) => (
            <div key={w.id} className="rounded-2xl border border-line bg-bg-surface/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-ink-primary">{w.title}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
                    <Clock size={12} /> {w.durationMin} min · {w.exercises.length} exercises
                  </div>
                </div>
                <Button size="sm" icon={Play} onClick={() => onStart(w)}>Start</Button>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {w.exercises.map((e) => (
                  <span key={e.exerciseId} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-secondary">
                    {exerciseById(e.exerciseId)?.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
