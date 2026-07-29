"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  UserProfile,
  LoggedFood,
  FoodItem,
  MealSlot,
  CompletedSession,
  FormAnalysis,
  ChatMessage,
  FeedPost,
  MacroTargets,
} from "@/types";
import {
  DEFAULT_PROFILE,
  estimateTargets,
  SAMPLE_ANALYSES,
  FEED_SEED,
  workoutById,
  exerciseById,
} from "./data";

interface ActiveSet {
  reps: number;
  weightKg: number;
  done: boolean;
}
interface ActiveExercise {
  exerciseId: string;
  restSec: number;
  sets: ActiveSet[];
}
export interface ActiveSession {
  workoutId: string;
  title: string;
  startedAt: number;
  exercises: ActiveExercise[];
}

interface PTStore {
  hydrated: boolean;
  profile: UserProfile;
  targets: MacroTargets;

  // nutrition (per current day)
  dayKey: string;
  foods: LoggedFood[];
  waterMl: number;

  // training
  streak: number;
  lastActiveDay: string | null;
  history: CompletedSession[];
  analyses: FormAnalysis[];
  active: ActiveSession | null;

  // coach + community
  messages: ChatMessage[];
  feed: FeedPost[];

  // actions
  setProfile: (patch: Partial<UserProfile>) => void;
  logFood: (food: FoodItem, slot: MealSlot) => void;
  removeFood: (loggedId: string) => void;
  addWater: (ml: number) => void;

  startSession: (workoutId: string) => void;
  startCustom: (title: string, items: { exerciseId: string; sets: number; reps: number; weightKg: number; restSec: number }[]) => void;
  toggleSet: (exIdx: number, setIdx: number) => void;
  updateSet: (exIdx: number, setIdx: number, patch: Partial<ActiveSet>) => void;
  finishSession: () => void;
  cancelSession: () => void;

  addAnalysis: (a: FormAnalysis) => void;
  pushMessage: (m: ChatMessage) => void;
  clearChat: () => void;
  toggleKudos: (id: string) => void;
  resetAll: () => void;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const usePT = create<PTStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: DEFAULT_PROFILE,
      targets: estimateTargets(DEFAULT_PROFILE),

      dayKey: todayKey(),
      foods: [],
      waterMl: 0,

      streak: 3,
      lastActiveDay: null,
      history: [],
      analyses: SAMPLE_ANALYSES,
      active: null,

      messages: [],
      feed: FEED_SEED,

      setProfile: (patch) => {
        const profile = { ...get().profile, ...patch };
        set({ profile, targets: estimateTargets(profile) });
      },

      logFood: (food, slot) =>
        set((s) => ({
          foods: [
            ...s.foods,
            { ...food, slot, loggedId: `${food.id}_${s.foods.length}_${Date.now()}` },
          ],
        })),

      removeFood: (loggedId) =>
        set((s) => ({ foods: s.foods.filter((f) => f.loggedId !== loggedId) })),

      addWater: (ml) => set((s) => ({ waterMl: Math.max(0, s.waterMl + ml) })),

      startSession: (workoutId) => {
        const w = workoutById(workoutId);
        if (!w) return;
        set({
          active: {
            workoutId,
            title: w.title,
            startedAt: Date.now(),
            exercises: w.exercises.map((we) => ({
              exerciseId: we.exerciseId,
              restSec: we.restSec,
              sets: we.sets.map((st) => ({ reps: st.reps, weightKg: st.weightKg, done: false })),
            })),
          },
        });
      },

      startCustom: (title, items) => {
        if (!items.length) return;
        set({
          active: {
            workoutId: `custom_${Date.now()}`,
            title: title.trim() || "Custom Session",
            startedAt: Date.now(),
            exercises: items.map((it) => ({
              exerciseId: it.exerciseId,
              restSec: it.restSec,
              sets: Array.from({ length: it.sets }, () => ({
                reps: it.reps,
                weightKg: it.weightKg,
                done: false,
              })),
            })),
          },
        });
      },

      toggleSet: (exIdx, setIdx) =>
        set((s) => {
          if (!s.active) return {};
          const exercises = s.active.exercises.map((ex, i) =>
            i !== exIdx
              ? ex
              : {
                  ...ex,
                  sets: ex.sets.map((st, j) =>
                    j !== setIdx ? st : { ...st, done: !st.done }
                  ),
                }
          );
          return { active: { ...s.active, exercises } };
        }),

      updateSet: (exIdx, setIdx, patch) =>
        set((s) => {
          if (!s.active) return {};
          const exercises = s.active.exercises.map((ex, i) =>
            i !== exIdx
              ? ex
              : { ...ex, sets: ex.sets.map((st, j) => (j !== setIdx ? st : { ...st, ...patch })) }
          );
          return { active: { ...s.active, exercises } };
        }),

      finishSession: () => {
        const a = get().active;
        if (!a) return;
        let volume = 0;
        let sets = 0;
        a.exercises.forEach((ex) =>
          ex.sets.forEach((st) => {
            if (st.done) {
              volume += st.reps * st.weightKg;
              sets += 1;
            }
          })
        );
        const durationMin = Math.max(1, Math.round((Date.now() - a.startedAt) / 60000));
        const day = todayKey();
        const prev = get();
        const continued = prev.lastActiveDay && prev.lastActiveDay !== day;
        const session: CompletedSession = {
          id: `sess_${Date.now()}`,
          workoutId: a.workoutId,
          title: a.title,
          dateISO: day,
          durationMin,
          volumeKg: Math.round(volume),
          sets,
        };
        set({
          active: null,
          history: [session, ...prev.history].slice(0, 60),
          streak: continued ? prev.streak + 1 : prev.streak || 1,
          lastActiveDay: day,
        });
      },

      cancelSession: () => set({ active: null }),

      addAnalysis: (a) => set((s) => ({ analyses: [a, ...s.analyses].slice(0, 40) })),

      pushMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
      clearChat: () => set({ messages: [] }),

      toggleKudos: (id) =>
        set((s) => ({
          feed: s.feed.map((p) =>
            p.id === id
              ? { ...p, liked: !p.liked, kudos: p.kudos + (p.liked ? -1 : 1) }
              : p
          ),
        })),

      resetAll: () =>
        set({
          profile: DEFAULT_PROFILE,
          targets: estimateTargets(DEFAULT_PROFILE),
          foods: [],
          waterMl: 0,
          streak: 0,
          lastActiveDay: null,
          history: [],
          analyses: SAMPLE_ANALYSES,
          active: null,
          messages: [],
          feed: FEED_SEED,
        }),
    }),
    {
      name: "pocket-trainer-v2",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.hydrated = true;
        // Roll nutrition to a fresh day if the stored day is stale.
        const today = todayKey();
        if (state.dayKey !== today) {
          state.dayKey = today;
          state.foods = [];
          state.waterMl = 0;
        }
      },
      partialize: (s) => ({
        profile: s.profile,
        targets: s.targets,
        dayKey: s.dayKey,
        foods: s.foods,
        waterMl: s.waterMl,
        streak: s.streak,
        lastActiveDay: s.lastActiveDay,
        history: s.history,
        analyses: s.analyses,
        messages: s.messages,
        feed: s.feed,
      }),
    }
  )
);

// ── Derived selectors ──────────────────────────────────────────────────────

export function consumedMacros(foods: LoggedFood[]): MacroTargets {
  return foods.reduce(
    (acc, f) => ({
      kcal: acc.kcal + f.kcal,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function sessionProgress(a: ActiveSession | null): { done: number; total: number } {
  if (!a) return { done: 0, total: 0 };
  let done = 0;
  let total = 0;
  a.exercises.forEach((ex) =>
    ex.sets.forEach((st) => {
      total += 1;
      if (st.done) done += 1;
    })
  );
  return { done, total };
}

export function sessionExerciseName(exerciseId: string): string {
  return exerciseById(exerciseId)?.name ?? exerciseId;
}
