"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Player = {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  reels: number;
  streakDays: number;
  capturedSceneIds: string[];
};

type State = {
  player: Player;
  addCapture: (sceneId: string, points: number) => void;
  reset: () => void;
};

const initial: Player = {
  username: "director.cut",
  level: 7,
  xp: 4280,
  xpToNext: 6000,
  reels: 320,
  streakDays: 12,
  capturedSceneIds: [],
};

export const usePlayer = create<State>()(
  persist(
    (set, get) => ({
      player: initial,
      addCapture: (sceneId, points) => {
        const p = get().player;
        if (p.capturedSceneIds.includes(sceneId)) return;
        const newXp = p.xp + points;
        const leveled = newXp >= p.xpToNext;
        set({
          player: {
            ...p,
            xp: leveled ? newXp - p.xpToNext : newXp,
            level: leveled ? p.level + 1 : p.level,
            xpToNext: leveled ? Math.round(p.xpToNext * 1.4) : p.xpToNext,
            reels: p.reels + Math.round(points / 10),
            capturedSceneIds: [...p.capturedSceneIds, sceneId],
          },
        });
      },
      reset: () => set({ player: initial }),
    }),
    { name: "setlocate-go-player" }
  )
);
