import type { Experience, GoalMode, Goals } from "@/types";

const EXPERIENCE_MULTIPLIER: Record<Experience, number> = {
  Beginner: 14,
  Intermediate: 15,
  Advanced: 16,
};

const MODE_ADJUST: Record<GoalMode, number> = {
  Deficit: 0.8,
  Maintain: 1.0,
  Surplus: 1.1,
  Bulk: 1.2,
};

export const MODE_LABELS: Record<GoalMode, string> = {
  Deficit: "Lose fat",
  Maintain: "Maintain",
  Surplus: "Lean gain",
  Bulk: "Bulk",
};

/**
 * Compute daily targets from bodyweight, experience and goal mode.
 *
 * maintenance = bodyweight(lb) × experience multiplier × mode adjust, floored at 1500
 * protein = 1 g/lb · fat = 0.4 g/lb · carbs = remainder · sugar cap = 10% of cal ÷ 4
 */
export function calcGoals(
  weightLb: number,
  experience: Experience,
  mode: GoalMode,
): Goals {
  const cal = Math.max(
    1500,
    Math.round(weightLb * EXPERIENCE_MULTIPLIER[experience] * MODE_ADJUST[mode]),
  );
  const p = Math.round(weightLb * 1);
  const f = Math.round(weightLb * 0.4);
  const remainder = cal - (p * 4 + f * 9);
  const c = Math.max(0, Math.round(remainder / 4));
  const sug = Math.round((cal * 0.1) / 4);
  return { cal, p, c, f, sug };
}
