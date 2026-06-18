import { create } from "zustand";

type PlayerState = {
  displayName: string | null;
  level: number;
  points: number;
  streakDays: number;
  setDisplayName: (name: string) => void;
  addPoints: (delta: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  displayName: null,
  level: 1,
  points: 0,
  streakDays: 0,
  setDisplayName: (displayName) => set({ displayName }),
  addPoints: (delta) =>
    set((state) => ({
      points: state.points + delta,
      level: 1 + Math.floor((state.points + delta) / 500),
    })),
}));
