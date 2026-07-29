"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, X, Play, Search, GripVertical, Dumbbell } from "lucide-react";
import { usePT } from "@/lib/store";
import { EXERCISES, exerciseById } from "@/lib/data";
import type { MuscleGroup } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, Input, Chip, EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Item {
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg: number;
  restSec: number;
}

const FILTERS: { key: MuscleGroup | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "chest", label: "Chest" },
  { key: "back", label: "Back" },
  { key: "legs", label: "Legs" },
  { key: "shoulders", label: "Shoulders" },
  { key: "arms", label: "Arms" },
  { key: "core", label: "Core" },
  { key: "full_body", label: "Full body" },
];

export default function BuilderPage() {
  const router = useRouter();
  const startCustom = usePT((s) => s.startCustom);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const library = useMemo(() => {
    const term = q.trim().toLowerCase();
    return EXERCISES.filter(
      (e) =>
        (filter === "all" || e.muscle === filter) &&
        (!term || e.name.toLowerCase().includes(term))
    );
  }, [filter, q]);

  const chosen = new Set(items.map((i) => i.exerciseId));
  const totalSets = items.reduce((a, i) => a + i.sets, 0);

  function add(exerciseId: string) {
    if (chosen.has(exerciseId)) {
      setItems((prev) => prev.filter((i) => i.exerciseId !== exerciseId));
      return;
    }
    setItems((prev) => [...prev, { exerciseId, sets: 3, reps: 10, weightKg: 20, restSec: 90 }]);
  }

  function patch(id: string, p: Partial<Item>) {
    setItems((prev) => prev.map((i) => (i.exerciseId === id ? { ...i, ...p } : i)));
  }

  function begin() {
    startCustom(title, items);
    router.push("/session");
  }

  return (
    <div className="animate-fade-up pb-4">
      <PageHeader title="Workout Builder" subtitle="Design a session, then train it live." />

      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session name (e.g. Push Day)" className="mb-4" />

      {/* Selected */}
      {items.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-ink-muted">
            <span>Your session · {items.length} exercises · {totalSets} sets</span>
          </div>
          <div className="space-y-2">
            {items.map((it) => {
              const ex = exerciseById(it.exerciseId);
              return (
                <Card key={it.exerciseId} className="p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-ink-muted" />
                    <span className="flex-1 text-sm font-semibold text-ink-primary">{ex?.name}</span>
                    <button onClick={() => add(it.exerciseId)} aria-label="Remove" className="text-ink-muted hover:text-danger">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    <NumField label="Sets" value={it.sets} min={1} onChange={(v) => patch(it.exerciseId, { sets: v })} />
                    <NumField label="Reps" value={it.reps} min={1} onChange={(v) => patch(it.exerciseId, { reps: v })} />
                    <NumField label="kg" value={it.weightKg} min={0} step={2.5} onChange={(v) => patch(it.exerciseId, { weightKg: v })} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Library */}
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises…" className="pl-10" />
      </div>
      <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {library.length === 0 ? (
        <EmptyState icon={Dumbbell} title="Nothing here" body="Try a different filter or search term." />
      ) : (
        <div className="space-y-2">
          {library.map((ex) => {
            const on = chosen.has(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => add(ex.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-colors",
                  on ? "border-purple/50 bg-purple/10" : "border-line bg-bg-card hover:border-line-strong"
                )}
              >
                <div>
                  <div className="text-sm font-medium text-ink-primary">{ex.name}</div>
                  <div className="text-[11px] capitalize text-ink-muted">{ex.muscle.replace("_", " ")} · {ex.equipment}</div>
                </div>
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", on ? "bg-purple text-white" : "border border-line text-ink-muted")}>
                  {on ? <Minus size={15} /> : <Plus size={15} />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Start bar */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-4">
          <Button fullWidth icon={Play} onClick={begin} className="shadow-lift">
            Start session · {items.length} exercises
          </Button>
        </div>
      )}
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg-surface/30 p-1.5">
      <div className="text-center text-[10px] uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="mt-0.5 flex items-center justify-between">
        <button onClick={() => onChange(Math.max(min, value - step))} className="flex h-6 w-6 items-center justify-center text-ink-muted hover:text-white" aria-label="Decrease">
          <Minus size={12} />
        </button>
        <span className="stat-number text-sm text-ink-primary">{value}</span>
        <button onClick={() => onChange(value + step)} className="flex h-6 w-6 items-center justify-center text-ink-muted hover:text-white" aria-label="Increase">
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}
