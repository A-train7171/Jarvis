"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { scenes } from "./mockData";
import type { Scene } from "@/types";

interface PlayerStore {
  xp: number;
  capturedIds: string[];
  selectedSceneId: string | null;
  capture: (scene: Scene) => boolean;
  isCaptured: (id: string) => boolean;
  select: (id: string | null) => void;
  reset: () => void;
}

export const usePlayer = create<PlayerStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      capturedIds: [],
      selectedSceneId: null,
      capture: (scene) => {
        const ids = get().capturedIds;
        if (ids.includes(scene.id)) return false;
        set({
          capturedIds: [...ids, scene.id],
          xp: get().xp + scene.xp,
        });
        return true;
      },
      isCaptured: (id) => get().capturedIds.includes(id),
      select: (id) => set({ selectedSceneId: id }),
      reset: () => set({ xp: 0, capturedIds: [], selectedSceneId: null }),
    }),
    {
      name: "setlocate-go-player",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ xp: s.xp, capturedIds: s.capturedIds }),
    }
  )
);

export function levelFromXp(xp: number): { level: number; next: number; progress: number } {
  // each level needs 1000 * level XP (cumulative)
  let level = 1;
  let cumulative = 0;
  while (cumulative + 1000 * level <= xp) {
    cumulative += 1000 * level;
    level += 1;
  }
  const next = 1000 * level;
  const into = xp - cumulative;
  return { level, next, progress: Math.min(1, into / next) };
}

export function getCapturedScenes(ids: string[]): Scene[] {
  return scenes.filter((s) => ids.includes(s.id));
}
