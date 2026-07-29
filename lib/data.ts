import type {
  Exercise,
  Program,
  FoodItem,
  FeedPost,
  FormAnalysis,
  MacroTargets,
  UserProfile,
} from "@/types";

// ── Exercise library ──────────────────────────────────────────────────────

export const EXERCISES: Exercise[] = [
  {
    id: "back-squat",
    name: "Back Squat",
    muscle: "legs",
    equipment: "barbell",
    cues: ["Brace your core before you descend", "Knees track over toes", "Drive through mid-foot", "Chest tall out of the hole"],
    faults: ["Knees caving inward", "Heels lifting off the floor", "Rounding the lower back"],
  },
  {
    id: "bench-press",
    name: "Bench Press",
    muscle: "chest",
    equipment: "barbell",
    cues: ["Retract and pin your shoulder blades", "Slight arch, feet planted", "Bar to lower chest", "Elbows ~45° from torso"],
    faults: ["Flaring elbows to 90°", "Bouncing the bar off the chest", "Hips lifting off the bench"],
  },
  {
    id: "deadlift",
    name: "Deadlift",
    muscle: "back",
    equipment: "barbell",
    cues: ["Bar over mid-foot", "Take slack out of the bar", "Neutral spine, lats tight", "Push the floor away"],
    faults: ["Hips shooting up first", "Rounding the upper back", "Bar drifting away from shins"],
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    muscle: "shoulders",
    equipment: "barbell",
    cues: ["Squeeze glutes, ribs down", "Bar path close to the face", "Finish with biceps by ears"],
    faults: ["Excessive lower-back lean", "Pressing the bar forward", "Shrugging early"],
  },
  {
    id: "pull-up",
    name: "Pull-Up",
    muscle: "back",
    equipment: "bodyweight",
    cues: ["Start from a dead hang", "Lead with the chest", "Drive elbows down and back"],
    faults: ["Kipping / swinging", "Partial range at the top", "Shrugging into the ears"],
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscle: "legs",
    equipment: "barbell",
    cues: ["Soft knees, hinge at the hips", "Bar drags down the thighs", "Feel the hamstring stretch"],
    faults: ["Turning it into a squat", "Rounding the back", "Going too low for your mobility"],
  },
  {
    id: "dumbbell-row",
    name: "Dumbbell Row",
    muscle: "back",
    equipment: "dumbbell",
    cues: ["Flat back, braced core", "Pull to the hip, not the shoulder", "Control the negative"],
    faults: ["Twisting the torso", "Yanking with momentum", "Shrug instead of row"],
  },
  {
    id: "incline-db-press",
    name: "Incline Dumbbell Press",
    muscle: "chest",
    equipment: "dumbbell",
    cues: ["Bench at 30°", "Wrists stacked over elbows", "Press up and slightly in"],
    faults: ["Bench too steep (turns to shoulders)", "Clanking the dumbbells", "Half reps"],
  },
  {
    id: "goblet-squat",
    name: "Goblet Squat",
    muscle: "legs",
    equipment: "dumbbell",
    cues: ["Hold the bell at chest height", "Elbows inside the knees at depth", "Stay tall"],
    faults: ["Leaning too far forward", "Heels rising", "Cutting depth short"],
  },
  {
    id: "plank",
    name: "Plank",
    muscle: "core",
    equipment: "bodyweight",
    cues: ["Elbows under shoulders", "Squeeze glutes and quads", "Ribs down, neutral neck"],
    faults: ["Hips sagging", "Butt in the air", "Holding your breath"],
  },
  {
    id: "lunge",
    name: "Walking Lunge",
    muscle: "legs",
    equipment: "dumbbell",
    cues: ["Long steps", "Back knee toward the floor", "Push through the front heel"],
    faults: ["Front knee caving", "Torso collapsing forward", "Steps too short"],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscle: "back",
    equipment: "cable",
    cues: ["Slight lean back", "Pull the bar to the collarbone", "Elbows down and in"],
    faults: ["Using body swing", "Bar behind the neck", "Partial range"],
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscle: "legs",
    equipment: "machine",
    cues: ["Feet shoulder-width", "Control to 90°", "Don't lock out hard"],
    faults: ["Lower back rounding off the pad", "Bouncing at the bottom", "Knees caving"],
  },
  {
    id: "db-curl",
    name: "Dumbbell Curl",
    muscle: "arms",
    equipment: "dumbbell",
    cues: ["Elbows pinned to sides", "Supinate as you lift", "Slow negative"],
    faults: ["Swinging the torso", "Elbows drifting forward", "Half reps"],
  },
  {
    id: "tricep-pushdown",
    name: "Triceps Pushdown",
    muscle: "arms",
    equipment: "cable",
    cues: ["Elbows glued to your ribs", "Full lockout", "Control back up"],
    faults: ["Elbows flaring out", "Leaning over the weight", "Using shoulders"],
  },
  {
    id: "kb-swing",
    name: "Kettlebell Swing",
    muscle: "full_body",
    equipment: "kettlebell",
    cues: ["Hinge, don't squat", "Snap the hips at the top", "Bell floats — arms are ropes"],
    faults: ["Squatting the swing", "Overarching at the top", "Lifting with the arms"],
  },
];

export function exerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

// ── Programs ──────────────────────────────────────────────────────────────

const set = (reps: number, weightKg: number) => ({ reps, weightKg, done: false });

export const PROGRAMS: Program[] = [
  {
    id: "foundations",
    title: "Foundations",
    subtitle: "Learn the big lifts, build the habit",
    level: "beginner",
    daysPerWeek: 3,
    weeks: 8,
    focus: "Full-body strength",
    accent: "#8B2EFF",
    workouts: [
      {
        id: "fnd-a",
        title: "Full Body A",
        focus: "full_body",
        durationMin: 45,
        exercises: [
          { exerciseId: "goblet-squat", restSec: 90, sets: [set(10, 16), set(10, 16), set(10, 16)] },
          { exerciseId: "incline-db-press", restSec: 90, sets: [set(10, 14), set(10, 14), set(10, 14)] },
          { exerciseId: "dumbbell-row", restSec: 75, sets: [set(12, 16), set(12, 16), set(12, 16)] },
          { exerciseId: "plank", restSec: 60, sets: [set(1, 0), set(1, 0), set(1, 0)] },
        ],
      },
      {
        id: "fnd-b",
        title: "Full Body B",
        focus: "full_body",
        durationMin: 45,
        exercises: [
          { exerciseId: "romanian-deadlift", restSec: 90, sets: [set(10, 30), set(10, 30), set(10, 30)] },
          { exerciseId: "overhead-press", restSec: 90, sets: [set(8, 20), set(8, 20), set(8, 20)] },
          { exerciseId: "lat-pulldown", restSec: 75, sets: [set(12, 34), set(12, 34), set(12, 34)] },
          { exerciseId: "lunge", restSec: 60, sets: [set(12, 12), set(12, 12)] },
        ],
      },
    ],
  },
  {
    id: "power-build",
    title: "Power Build",
    subtitle: "Get stronger, add lean size",
    level: "intermediate",
    daysPerWeek: 4,
    weeks: 10,
    focus: "Strength + hypertrophy",
    accent: "#B65CFF",
    workouts: [
      {
        id: "pb-lower",
        title: "Lower Power",
        focus: "legs",
        durationMin: 60,
        exercises: [
          { exerciseId: "back-squat", restSec: 150, sets: [set(5, 80), set(5, 85), set(5, 90), set(5, 90)] },
          { exerciseId: "romanian-deadlift", restSec: 120, sets: [set(8, 60), set(8, 60), set(8, 60)] },
          { exerciseId: "leg-press", restSec: 90, sets: [set(12, 140), set(12, 140), set(12, 140)] },
        ],
      },
      {
        id: "pb-upper",
        title: "Upper Power",
        focus: "chest",
        durationMin: 60,
        exercises: [
          { exerciseId: "bench-press", restSec: 150, sets: [set(5, 60), set(5, 65), set(5, 70), set(5, 70)] },
          { exerciseId: "pull-up", restSec: 120, sets: [set(6, 0), set(6, 0), set(6, 0)] },
          { exerciseId: "overhead-press", restSec: 90, sets: [set(8, 35), set(8, 35), set(8, 35)] },
          { exerciseId: "db-curl", restSec: 60, sets: [set(12, 12), set(12, 12), set(12, 12)] },
        ],
      },
    ],
  },
  {
    id: "lean-athlete",
    title: "Lean Athlete",
    subtitle: "Conditioning that keeps your strength",
    level: "intermediate",
    daysPerWeek: 4,
    weeks: 6,
    focus: "Metabolic + performance",
    accent: "#3FB6F5",
    workouts: [
      {
        id: "la-metcon",
        title: "Engine Builder",
        focus: "cardio",
        durationMin: 40,
        exercises: [
          { exerciseId: "kb-swing", restSec: 45, sets: [set(15, 20), set(15, 20), set(15, 20), set(15, 20)] },
          { exerciseId: "goblet-squat", restSec: 45, sets: [set(15, 20), set(15, 20), set(15, 20)] },
          { exerciseId: "lunge", restSec: 45, sets: [set(20, 10), set(20, 10), set(20, 10)] },
          { exerciseId: "plank", restSec: 30, sets: [set(1, 0), set(1, 0), set(1, 0)] },
        ],
      },
    ],
  },
];

export function programById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export const ALL_WORKOUTS = PROGRAMS.flatMap((p) => p.workouts);
export function workoutById(id: string) {
  return ALL_WORKOUTS.find((w) => w.id === id);
}

// ── Foods ─────────────────────────────────────────────────────────────────

export const FOODS: FoodItem[] = [
  { id: "eggs", name: "Eggs (2 large)", serving: "2 eggs", kcal: 156, protein: 13, carbs: 1, fat: 11 },
  { id: "oats", name: "Rolled Oats", serving: "60 g dry", kcal: 228, protein: 8, carbs: 40, fat: 4 },
  { id: "chicken", name: "Grilled Chicken Breast", serving: "150 g", kcal: 248, protein: 47, carbs: 0, fat: 5 },
  { id: "rice", name: "White Rice, cooked", serving: "1 cup", kcal: 205, protein: 4, carbs: 45, fat: 0 },
  { id: "salmon", name: "Salmon Fillet", serving: "140 g", kcal: 280, protein: 39, carbs: 0, fat: 13 },
  { id: "greek-yogurt", name: "Greek Yogurt, plain", serving: "170 g", kcal: 100, protein: 17, carbs: 6, fat: 1 },
  { id: "banana", name: "Banana", serving: "1 medium", kcal: 105, protein: 1, carbs: 27, fat: 0 },
  { id: "peanut-butter", name: "Peanut Butter", serving: "2 tbsp", kcal: 190, protein: 8, carbs: 6, fat: 16 },
  { id: "protein-shake", name: "Whey Protein Shake", serving: "1 scoop", kcal: 120, protein: 24, carbs: 3, fat: 2 },
  { id: "sweet-potato", name: "Sweet Potato", serving: "1 medium", kcal: 112, protein: 2, carbs: 26, fat: 0 },
  { id: "avocado", name: "Avocado", serving: "1/2 fruit", kcal: 160, protein: 2, carbs: 9, fat: 15 },
  { id: "almonds", name: "Almonds", serving: "28 g", kcal: 164, protein: 6, carbs: 6, fat: 14 },
  { id: "broccoli", name: "Broccoli, steamed", serving: "1 cup", kcal: 55, protein: 4, carbs: 11, fat: 1 },
  { id: "beef-mince", name: "Lean Beef Mince", serving: "150 g", kcal: 250, protein: 38, carbs: 0, fat: 11 },
];

// ── Sample form analyses (seed history) ────────────────────────────────────

export const SAMPLE_ANALYSES: FormAnalysis[] = [
  {
    id: "an-1",
    exerciseName: "Back Squat",
    dateISO: "2026-07-27",
    score: 86,
    summary: "Strong depth and bar path. Watch a slight knee cave on the last two reps as you fatigue.",
    checkpoints: [
      { label: "Depth", status: "good", detail: "Hip crease breaks parallel on every rep." },
      { label: "Bar path", status: "good", detail: "Stays stacked over mid-foot." },
      { label: "Knee tracking", status: "watch", detail: "Minor inward drift on reps 4–5. Cue 'knees out'." },
      { label: "Torso angle", status: "good", detail: "Consistent, braced throughout." },
    ],
  },
  {
    id: "an-2",
    exerciseName: "Deadlift",
    dateISO: "2026-07-24",
    score: 78,
    summary: "Good lockout power. Your hips rise a touch early — sync the hip and shoulder rise off the floor.",
    checkpoints: [
      { label: "Start position", status: "good", detail: "Bar over mid-foot, lats engaged." },
      { label: "Hip timing", status: "fix", detail: "Hips shoot up before the bar leaves the floor." },
      { label: "Spine", status: "watch", detail: "Slight upper-back rounding under load." },
      { label: "Lockout", status: "good", detail: "Full hip extension, no hyperextension." },
    ],
  },
];

// ── Community feed seed ────────────────────────────────────────────────────

export const FEED_SEED: FeedPost[] = [
  { id: "f1", author: "Maya R.", initials: "MR", timeAgo: "12m", action: "finished Lower Power", detail: "New squat PR — 100 kg × 5. Legs are toast 🔥", kudos: 24 },
  { id: "f2", author: "Dev P.", initials: "DP", timeAgo: "48m", action: "logged a 6 km run", detail: "Negative splits the whole way. Coach nailed the pacing plan.", kudos: 15 },
  { id: "f3", author: "Sofia L.", initials: "SL", timeAgo: "2h", action: "hit a 14-day streak", detail: "Consistency over intensity. Showing up is the whole game.", kudos: 41 },
  { id: "f4", author: "Aaron T.", initials: "AT", timeAgo: "3h", action: "shared a form check", detail: "Bench score jumped 78 → 89 after fixing my elbow flare.", kudos: 19 },
  { id: "f5", author: "Nia K.", initials: "NK", timeAgo: "5h", action: "completed Foundations wk 3", detail: "First time deadlifting bodyweight. Didn't think I could.", kudos: 33 },
];

// ── Defaults ──────────────────────────────────────────────────────────────

export const DEFAULT_PROFILE: UserProfile = {
  name: "Athlete",
  goal: "build_muscle",
  experience: "intermediate",
  units: "metric",
  heightCm: 178,
  weightKg: 78,
  age: 27,
  weeklyTarget: 4,
};

/** A simple, transparent macro estimate. Educational only — not medical advice. */
export function estimateTargets(p: UserProfile): MacroTargets {
  // Mifflin-St Jeor BMR (assumes a moderate activity factor and goal adjustment)
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + 5;
  const activity = 1.45 + (p.weeklyTarget - 3) * 0.03;
  let kcal = bmr * activity;
  if (p.goal === "lose_fat") kcal -= 400;
  if (p.goal === "build_muscle") kcal += 250;
  kcal = Math.round(kcal / 10) * 10;

  const protein = Math.round(p.weightKg * 2.0);
  const fat = Math.round((kcal * 0.27) / 9);
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  return { kcal, protein, carbs: Math.max(carbs, 0), fat };
}
