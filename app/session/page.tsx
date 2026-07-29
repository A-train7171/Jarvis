"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Check,
  Timer,
  Flag,
  ChevronDown,
  Info,
  Dumbbell,
  Plus,
  Minus,
} from "lucide-react";
import { usePT, sessionProgress, sessionExerciseName } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { exerciseById } from "@/lib/data";
import { Button, ButtonLink, ProgressBar, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function SessionPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const active = usePT((s) => s.active);
  const toggleSet = usePT((s) => s.toggleSet);
  const updateSet = usePT((s) => s.updateSet);
  const finishSession = usePT((s) => s.finishSession);
  const cancelSession = usePT((s) => s.cancelSession);

  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState<number | null>(null);
  const [openIdx, setOpenIdx] = useState(0);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - active.startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [active]);

  useEffect(() => {
    if (rest === null) return;
    if (rest <= 0) {
      setRest(null);
      return;
    }
    const t = setTimeout(() => setRest((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(t);
  }, [rest]);

  if (hydrated && !active) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10 text-purple">
          <Dumbbell size={26} />
        </span>
        <div>
          <h1 className="display-italic text-2xl text-ink-primary">No active session</h1>
          <p className="mt-1 text-sm text-ink-muted">Pick a workout to start training.</p>
        </div>
        <ButtonLink href="/workout">Browse workouts</ButtonLink>
      </div>
    );
  }
  if (!active) return null;

  const { done, total } = sessionProgress(active);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  function endWorkout() {
    finishSession();
    router.push("/workout");
  }

  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-md flex-col bg-bg-base">
      {/* Header */}
      <div className="border-b border-line bg-bg-overlay px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => cancelSession()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-secondary hover:text-white"
            aria-label="Discard session"
          >
            <X size={18} />
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold text-ink-primary">{active.title}</div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-ink-muted">
              <Timer size={12} /> <span className="stat-number">{mm}:{ss}</span>
            </div>
          </div>
          <span className="stat-number text-sm text-purple-glow">{done}/{total}</span>
        </div>
        <ProgressBar value={total ? done / total : 0} className="mt-2.5" />
      </div>

      {/* Exercises */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 pb-40">
        {active.exercises.map((ex, exIdx) => {
          const meta = exerciseById(ex.exerciseId);
          const exDone = ex.sets.every((s) => s.done);
          const open = openIdx === exIdx;
          return (
            <Card key={ex.exerciseId} className={cn("p-0", exDone && "border-success/40")}>
              <button
                onClick={() => setOpenIdx(open ? -1 : exIdx)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold",
                      exDone ? "bg-success/15 text-success" : "bg-purple/10 text-purple"
                    )}
                  >
                    {exDone ? <Check size={17} /> : exIdx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-primary">{sessionExerciseName(ex.exerciseId)}</div>
                    <div className="text-[11px] text-ink-muted">
                      {ex.sets.length} sets · {ex.restSec}s rest
                    </div>
                  </div>
                </div>
                <ChevronDown size={18} className={cn("text-ink-muted transition-transform", open && "rotate-180")} />
              </button>

              {open && (
                <div className="border-t border-line p-4">
                  {/* Set rows */}
                  <div className="mb-1 grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 px-1 text-[10px] uppercase tracking-wider text-ink-muted">
                    <span>Set</span>
                    <span className="text-center">kg</span>
                    <span className="text-center">reps</span>
                    <span />
                  </div>
                  <div className="space-y-2">
                    {ex.sets.map((st, setIdx) => (
                      <div
                        key={setIdx}
                        className={cn(
                          "grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 rounded-xl border p-1.5",
                          st.done ? "border-success/40 bg-success/5" : "border-line bg-bg-surface/30"
                        )}
                      >
                        <span className="stat-number pl-1 text-sm text-ink-secondary">{setIdx + 1}</span>
                        <Stepper
                          value={st.weightKg}
                          step={2.5}
                          onChange={(v) => updateSet(exIdx, setIdx, { weightKg: Math.max(0, v) })}
                        />
                        <Stepper
                          value={st.reps}
                          step={1}
                          onChange={(v) => updateSet(exIdx, setIdx, { reps: Math.max(0, v) })}
                        />
                        <button
                          onClick={() => {
                            toggleSet(exIdx, setIdx);
                            if (!st.done) setRest(ex.restSec);
                          }}
                          aria-label="Complete set"
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                            st.done ? "bg-success text-black" : "border border-line text-ink-muted hover:text-white"
                          )}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Cues */}
                  {meta && (
                    <div className="mt-3 rounded-xl border border-line bg-bg-surface/20 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                        <Info size={12} /> Form cues
                      </div>
                      <ul className="space-y-0.5 text-[12px] text-ink-secondary">
                        {meta.cues.map((c) => (
                          <li key={c}>· {c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Rest timer */}
      <AnimatePresence>
        {rest !== null && rest > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-md justify-center px-4"
          >
            <div className="flex items-center gap-3 rounded-full border border-purple/40 bg-bg-card px-5 py-3 shadow-glow">
              <Timer size={16} className="text-purple" />
              <span className="text-sm text-ink-secondary">Rest</span>
              <span className="stat-number text-lg text-ink-primary">{rest}s</span>
              <button onClick={() => setRest(null)} className="ml-1 text-xs text-ink-muted hover:text-white">
                skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finish */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line bg-bg-overlay p-4 backdrop-blur-xl">
        <Button fullWidth icon={Flag} onClick={() => setConfirmEnd(true)}>
          Finish workout
        </Button>
      </div>

      {/* Confirm end */}
      <AnimatePresence>
        {confirmEnd && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmEnd(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/3 z-50 mx-auto max-w-sm rounded-3xl border border-line bg-bg-card p-6 text-center"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
            >
              <h3 className="display-italic text-xl text-ink-primary">Finish session?</h3>
              <p className="mt-1 text-sm text-ink-muted">
                {done} of {total} sets logged. Great work — this counts toward your streak.
              </p>
              <div className="mt-5 flex gap-2">
                <Button variant="secondary" fullWidth onClick={() => setConfirmEnd(false)}>
                  Keep going
                </Button>
                <Button fullWidth onClick={endWorkout}>
                  Finish
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stepper({ value, step, onChange }: { value: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-bg-base/60 px-1">
      <button
        onClick={() => onChange(value - step)}
        className="flex h-7 w-7 items-center justify-center text-ink-muted hover:text-white"
        aria-label="Decrease"
      >
        <Minus size={13} />
      </button>
      <span className="stat-number text-sm text-ink-primary tabular-nums">{value}</span>
      <button
        onClick={() => onChange(value + step)}
        className="flex h-7 w-7 items-center justify-center text-ink-muted hover:text-white"
        aria-label="Increase"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
