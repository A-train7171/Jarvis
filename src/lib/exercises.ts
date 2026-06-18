import type { MuscleGroup } from "@/components/MuscleMap";

export const MUSCLE_GROUPS: MuscleGroup[] = ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core"];

/** Library of resistance movements grouped by primary muscle. */
export const LIBRARY: Record<MuscleGroup, string[]> = {
  Chest: ["Barbell Bench Press", "Incline Dumbbell Press", "Push-Up", "Cable Fly", "Dips"],
  Back: ["Pull-Up", "Bent-Over Row", "Lat Pulldown", "Seated Cable Row", "Deadlift"],
  Shoulders: ["Overhead Press", "Lateral Raise", "Face Pull", "Arnold Press", "Rear Delt Fly"],
  Legs: ["Back Squat", "Romanian Deadlift", "Leg Press", "Walking Lunge", "Calf Raise"],
  Arms: ["Barbell Curl", "Hammer Curl", "Triceps Pushdown", "Skull Crusher", "Concentration Curl"],
  Core: ["Plank", "Hanging Leg Raise", "Cable Crunch", "Russian Twist", "Dead Bug"],
};
