/** Domain types for Pocket Trainer. Mirrors the prototype data model. */

export type ContactType = "email" | "phone";
export type Experience = "Beginner" | "Intermediate" | "Advanced";
export type GoalMode = "Deficit" | "Maintain" | "Surplus" | "Bulk";
export type WeightUnit = "lb" | "kg";
export type DistanceUnit = "mi" | "km";

export interface Contact {
  type: ContactType;
  value: string;
}

/** Daily macro/calorie targets. */
export interface Goals {
  cal: number;
  p: number; // protein (g)
  c: number; // carbs (g)
  f: number; // fat (g)
  sug: number; // sugar cap (g)
}

export interface Avatar {
  /** Background color used when showing initials. */
  bgColor: string;
  /** Data URL of an uploaded, cropped & downscaled photo, or null for initials. */
  image: string | null;
}

export interface Profile {
  weightLb: number;
  heightIn: number;
  experience: Experience;
  mode: GoalMode;
  avatar: Avatar;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}

export interface ResistanceSet {
  reps: number;
  weight: number; // lb
  toFailure: boolean;
  done?: boolean;
}

export interface ResistanceExercise {
  kind: "resistance";
  id: string;
  name: string;
  sets: ResistanceSet[];
}

export interface CardioExercise {
  kind: "cardio";
  id: string;
  type: string; // e.g. "Running"
  minutes: number;
  distance: number;
  distanceUnit: DistanceUnit;
  intensity: "Light" | "Moderate" | "Vigorous";
  calories: number; // estimated
  done?: boolean;
}

export type WorkoutExercise = ResistanceExercise | CardioExercise;

export interface Workout {
  id: string;
  date: string; // ISO date (yyyy-mm-dd) when completed
  name: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface Commitment {
  id: string;
  name: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface SchedulePrefs {
  dayStart: string; // "HH:MM"
  dayEnd: string; // "HH:MM"
  homeSessionMin: number;
  gymSessionMin: number;
  commuteMin: number;
}

export interface Connections {
  apple: boolean;
  samsung: boolean;
  google: boolean;
  watch: boolean;
}

export interface HealthData {
  steps: number;
  activeKcal: number;
  restingHr: number;
  sleepHrs: number;
  lastSync: string | null; // ISO datetime
}

export interface Post {
  id: string;
  type: "rankup" | "workout";
  text: string;
  ts: string; // ISO datetime
}

export interface CoachMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: string;
}

/** Root application state — persisted as a single JSON blob (Milestone 1). */
export interface AppState {
  name: string;
  contact: Contact;
  goals: Goals;
  profile: Profile;
  activeDays: number;
  streak: number;
  lastActive: string | null; // ISO date
  food: Record<string, FoodItem[]>; // keyed by ISO date
  workouts: Workout[];
  planned: Commitment[];
  schedulePrefs: SchedulePrefs;
  connections: Connections;
  health: HealthData;
  posts: Post[];
  coachMsgs: CoachMsg[];
  /** Weight + distance unit preferences. */
  units: { weight: WeightUnit; distance: DistanceUnit };
  onboarded: boolean;
}
