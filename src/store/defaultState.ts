import type { AppState } from "@/types";

export const STORAGE_KEY = "pt.appState.v1";

export function defaultState(): AppState {
  return {
    name: "",
    contact: { type: "email", value: "" },
    goals: { cal: 0, p: 0, c: 0, f: 0, sug: 0 },
    profile: {
      weightLb: 170,
      heightIn: 70,
      experience: "Beginner",
      mode: "Maintain",
      avatar: { bgColor: "#8B2EFF", image: null },
    },
    activeDays: 0,
    streak: 0,
    lastActive: null,
    food: {},
    workouts: [],
    planned: [],
    schedulePrefs: {
      dayStart: "07:00",
      dayEnd: "22:00",
      homeSessionMin: 30,
      gymSessionMin: 75,
      commuteMin: 20,
    },
    connections: { apple: false, samsung: false, google: false, watch: false },
    health: { steps: 0, activeKcal: 0, restingHr: 0, sleepHrs: 0, lastSync: null },
    posts: [],
    coachMsgs: [],
    units: { weight: "lb", distance: "mi" },
    onboarded: false,
  };
}
