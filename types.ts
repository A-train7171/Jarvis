// ── Pocket Trainer domain model ────────────────────────────────────────────

export type Goal = "lose_fat" | "build_muscle" | "get_stronger" | "stay_active" | "improve_endurance";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Unit = "metric" | "imperial";

export interface UserProfile {
  name: string;
  goal: Goal;
  experience: ExperienceLevel;
  units: Unit;
  heightCm: number;
  weightKg: number;
  age: number;
  weeklyTarget: number; // sessions per week
}

// ── Training ────────────────────────────────────────────────────────────────

export type MuscleGroup =
  | "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "glutes" | "full_body" | "cardio";

export type Equipment = "barbell" | "dumbbell" | "machine" | "bodyweight" | "kettlebell" | "cable" | "bands";

export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleGroup;
  equipment: Equipment;
  /** Coaching cues — the form checklist surfaced during a session. */
  cues: string[];
  /** Common mistakes flagged by the form analyst. */
  faults: string[];
}

export interface ExerciseSet {
  reps: number;
  weightKg: number;
  done: boolean;
  rpe?: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: ExerciseSet[];
  restSec: number;
  note?: string;
}

export interface Workout {
  id: string;
  title: string;
  focus: MuscleGroup;
  durationMin: number;
  exercises: WorkoutExercise[];
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  level: ExperienceLevel;
  daysPerWeek: number;
  weeks: number;
  focus: string;
  accent: string; // css color
  workouts: Workout[];
}

export interface CompletedSession {
  id: string;
  workoutId: string;
  title: string;
  dateISO: string;
  durationMin: number;
  volumeKg: number;
  sets: number;
}

// ── Nutrition ─────────────────────────────────────────────────────────────

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodItem {
  id: string;
  name: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface LoggedFood extends FoodItem {
  loggedId: string;
  slot: MealSlot;
}

export interface MacroTargets {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ── Form analysis ─────────────────────────────────────────────────────────

export interface FormCheckpoint {
  label: string;
  status: "good" | "watch" | "fix";
  detail: string;
}

export interface FormAnalysis {
  id: string;
  exerciseName: string;
  dateISO: string;
  score: number; // 0–100
  summary: string;
  checkpoints: FormCheckpoint[];
}

// ── Coach ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  ts: number;
}

// ── Community feed ─────────────────────────────────────────────────────────

export interface FeedPost {
  id: string;
  author: string;
  initials: string;
  timeAgo: string;
  action: string;
  detail: string;
  kudos: number;
  liked?: boolean;
}
