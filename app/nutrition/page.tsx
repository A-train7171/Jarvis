"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Droplets,
  Search,
  X,
  Trash2,
  Coffee,
  Sun,
  Moon,
  Cookie,
  type LucideIcon,
} from "lucide-react";
import { usePT, consumedMacros } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { FOODS } from "@/lib/data";
import type { MealSlot, FoodItem } from "@/types";
import {
  Card,
  ProgressRing,
  ProgressBar,
  Button,
  Input,
  SafetyNote,
  SectionHeader,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const SLOTS: { key: MealSlot; label: string; icon: LucideIcon }[] = [
  { key: "breakfast", label: "Breakfast", icon: Coffee },
  { key: "lunch", label: "Lunch", icon: Sun },
  { key: "dinner", label: "Dinner", icon: Moon },
  { key: "snack", label: "Snacks", icon: Cookie },
];

export default function NutritionPage() {
  const hydrated = useHydrated();
  const foods = usePT((s) => s.foods);
  const targets = usePT((s) => s.targets);
  const waterMl = usePT((s) => s.waterMl);
  const addWater = usePT((s) => s.addWater);
  const removeFood = usePT((s) => s.removeFood);
  const [sheetSlot, setSheetSlot] = useState<MealSlot | null>(null);

  const consumed = consumedMacros(foods);
  const kcalRatio = targets.kcal ? consumed.kcal / targets.kcal : 0;
  const kcalLeft = Math.max(0, targets.kcal - consumed.kcal);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="display-italic text-3xl text-ink-primary">Nutrition</h1>
        <p className="mt-1 text-[13px] text-ink-secondary">Fuel the work. Track your day.</p>
      </div>

      {/* Summary */}
      <Card glow>
        <div className="flex items-center gap-5">
          <ProgressRing value={kcalRatio} size={128} stroke={13} color="var(--purple)">
            <span className="stat-number text-2xl text-ink-primary">{hydrated ? kcalLeft : targets.kcal}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink-muted">kcal left</span>
          </ProgressRing>
          <div className="flex-1 space-y-3">
            <Macro label="Protein" v={consumed.protein} t={targets.protein} c="var(--macro-protein)" ready={hydrated} />
            <Macro label="Carbs" v={consumed.carbs} t={targets.carbs} c="var(--macro-carbs)" ready={hydrated} />
            <Macro label="Fat" v={consumed.fat} t={targets.fat} c="var(--macro-fat)" ready={hydrated} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl border border-line bg-bg-surface/40 p-2.5">
            <div className="stat-number text-lg text-ink-primary">{hydrated ? consumed.kcal : 0}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-muted">eaten</div>
          </div>
          <div className="rounded-2xl border border-line bg-bg-surface/40 p-2.5">
            <div className="stat-number text-lg text-ink-primary">{targets.kcal}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-muted">target</div>
          </div>
        </div>
      </Card>

      {/* Water */}
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-macro-carbs/15 text-macro-carbs">
            <Droplets size={20} />
          </span>
          <div>
            <div className="stat-number text-xl text-ink-primary">
              {hydrated ? (waterMl / 1000).toFixed(2) : "0.00"} <span className="text-sm text-ink-muted">L</span>
            </div>
            <div className="text-[11px] text-ink-muted">Hydration · goal 2.5 L</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addWater(-250)}
            className="h-9 w-9 rounded-xl border border-line text-ink-secondary hover:text-white"
            aria-label="Remove 250ml"
          >
            −
          </button>
          <button
            onClick={() => addWater(250)}
            className="h-9 rounded-xl bg-purple-gradient px-3 text-sm font-medium text-white shadow-glow-sm"
          >
            +250 ml
          </button>
        </div>
      </Card>

      {/* Meals */}
      <div className="space-y-3">
        <SectionHeader title="Today's meals" />
        {SLOTS.map(({ key, label, icon: Icon }) => {
          const items = foods.filter((f) => f.slot === key);
          const slotKcal = items.reduce((a, f) => a + f.kcal, 0);
          return (
            <Card key={key} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple/10 text-purple">
                    <Icon size={17} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-primary">{label}</div>
                    <div className="text-[11px] text-ink-muted">
                      {hydrated ? `${items.length} item${items.length === 1 ? "" : "s"} · ${slotKcal} kcal` : "—"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSheetSlot(key)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-purple hover:border-purple/60"
                  aria-label={`Add to ${label}`}
                >
                  <Plus size={17} />
                </button>
              </div>
              {hydrated && items.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                  {items.map((f) => (
                    <li key={f.loggedId} className="flex items-center justify-between text-sm">
                      <span className="min-w-0 truncate text-ink-secondary">{f.name}</span>
                      <span className="flex items-center gap-3">
                        <span className="stat-number text-ink-primary">{f.kcal}</span>
                        <button
                          onClick={() => removeFood(f.loggedId)}
                          className="text-ink-muted hover:text-danger"
                          aria-label="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      <SafetyNote>
        Macro targets are a simple starting estimate for general guidance — not a
        medical or dietary prescription. For personalized nutrition, especially with any
        health condition, consult a registered dietitian.
      </SafetyNote>

      <AddFoodSheet slot={sheetSlot} onClose={() => setSheetSlot(null)} />
    </div>
  );
}

function Macro({ label, v, t, c, ready }: { label: string; v: number; t: number; c: string; ready: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[12px]">
        <span className="text-ink-secondary">{label}</span>
        <span className="text-ink-muted">
          <span className="stat-number text-sm text-ink-primary">{ready ? v : 0}</span>/{t}g
        </span>
      </div>
      <ProgressBar value={t ? v / t : 0} color={c} />
    </div>
  );
}

function AddFoodSheet({ slot, onClose }: { slot: MealSlot | null; onClose: () => void }) {
  const logFood = usePT((s) => s.logFood);
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? FOODS.filter((f) => f.name.toLowerCase().includes(term)) : FOODS;
  }, [q]);

  return (
    <AnimatePresence>
      {slot && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[82dvh] w-full max-w-md flex-col rounded-t-3xl border border-line bg-bg-card"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-muted">Add to</div>
                <div className="text-lg font-semibold capitalize text-ink-primary">{slot}</div>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-ink-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-3">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                <Input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search foods…"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              <div className="space-y-2">
                {results.map((f) => (
                  <FoodRow key={f.id} food={f} onAdd={() => logFood(f, slot)} />
                ))}
                {results.length === 0 && (
                  <p className="py-8 text-center text-sm text-ink-muted">No foods match “{q}”.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FoodRow({ food, onAdd }: { food: FoodItem; onAdd: () => void }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-bg-surface/30 p-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-ink-primary">{food.name}</div>
        <div className="text-[11px] text-ink-muted">
          {food.serving} · {food.kcal} kcal · P{food.protein} C{food.carbs} F{food.fat}
        </div>
      </div>
      <Button
        size="sm"
        variant={added ? "secondary" : "primary"}
        onClick={() => {
          onAdd();
          setAdded(true);
          setTimeout(() => setAdded(false), 900);
        }}
        className={cn("ml-3 shrink-0", added && "text-success")}
      >
        {added ? "Added ✓" : "Add"}
      </Button>
    </div>
  );
}
