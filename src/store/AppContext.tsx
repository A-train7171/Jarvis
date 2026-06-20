import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppState, FoodItem, Post, Workout } from "@/types";
import { storage } from "./storage";
import { defaultState, STORAGE_KEY } from "./defaultState";
import { rankFor } from "@/lib/ranks";
import { todayISO, uid } from "@/lib/util";

interface AppContextValue {
  state: AppState;
  loaded: boolean;
  /** Shallow-merge a patch into root state. */
  update: (patch: Partial<AppState>) => void;
  /** Functional update for nested edits. */
  set: (fn: (prev: AppState) => AppState) => void;
  reset: () => void;
  // domain actions
  addFood: (date: string, item: Omit<FoodItem, "id">) => void;
  updateFood: (date: string, id: string, patch: Partial<FoodItem>) => void;
  removeFood: (date: string, id: string) => void;
  completeWorkout: (workout: Workout) => void;
  addPost: (post: Omit<Post, "id" | "ts">) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Register an active day: bumps activeDays + streak at most once per calendar
 * day, and emits a rank-up post when the tier changes. This is the ONLY path
 * that advances the score — building a workout must never call it.
 */
function registerActiveDay(prev: AppState): AppState {
  const today = todayISO();
  if (prev.lastActive === today) return prev;

  const prevRank = rankFor(prev.activeDays);
  const yesterday = todayISO(new Date(Date.now() - 86_400_000));
  const streak = prev.lastActive === yesterday ? prev.streak + 1 : 1;
  const activeDays = prev.activeDays + 1;
  const nextRank = rankFor(activeDays);

  let posts = prev.posts;
  if (nextRank !== prevRank) {
    posts = [
      {
        id: uid(),
        type: "rankup",
        text: `${prev.name || "You"} reached ${nextRank}! 🔥`,
        ts: new Date().toISOString(),
      },
      ...posts,
    ];
  }

  return { ...prev, activeDays, streak, lastActive: today, posts };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<number | null>(null);

  // hydrate from persistence once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await storage.getJSON<AppState>(STORAGE_KEY);
      if (!cancelled) {
        if (saved) setState({ ...defaultState(), ...saved });
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // persist (debounced) after hydration
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void storage.setJSON(STORAGE_KEY, state);
    }, 250);
  }, [state, loaded]);

  const value = useMemo<AppContextValue>(() => {
    const set = (fn: (prev: AppState) => AppState) => setState(fn);
    const update = (patch: Partial<AppState>) =>
      setState((prev) => ({ ...prev, ...patch }));

    return {
      state,
      loaded,
      update,
      set,
      reset: () => setState(defaultState()),

      addFood: (date, item) =>
        set((prev) => ({
          ...prev,
          food: {
            ...prev.food,
            [date]: [...(prev.food[date] ?? []), { ...item, id: uid() }],
          },
        })),

      updateFood: (date, id, patch) =>
        set((prev) => ({
          ...prev,
          food: {
            ...prev.food,
            [date]: (prev.food[date] ?? []).map((f) =>
              f.id === id ? { ...f, ...patch } : f,
            ),
          },
        })),

      removeFood: (date, id) =>
        set((prev) => ({
          ...prev,
          food: {
            ...prev.food,
            [date]: (prev.food[date] ?? []).filter((f) => f.id !== id),
          },
        })),

      completeWorkout: (workout) =>
        set((prev) => {
          const completed = { ...workout, completed: true, date: todayISO() };
          const withDay = registerActiveDay({
            ...prev,
            workouts: [completed, ...prev.workouts],
          });
          return {
            ...withDay,
            posts: [
              {
                id: uid(),
                type: "workout",
                text: `${prev.name || "You"} completed "${workout.name}". ✓`,
                ts: new Date().toISOString(),
              },
              ...withDay.posts,
            ],
          };
        }),

      addPost: (post) =>
        set((prev) => ({
          ...prev,
          posts: [{ ...post, id: uid(), ts: new Date().toISOString() }, ...prev.posts],
        })),
    };
  }, [state, loaded]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
