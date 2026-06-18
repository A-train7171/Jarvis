import { lbToKg } from "./util";

/** MET values for common cardio activities (compendium-style approximations). */
export const CARDIO_METS: Record<string, { Light: number; Moderate: number; Vigorous: number }> = {
  Running: { Light: 7, Moderate: 9.8, Vigorous: 12.3 },
  Walking: { Light: 2.8, Moderate: 3.5, Vigorous: 4.3 },
  Cycling: { Light: 4, Moderate: 7.5, Vigorous: 10 },
  Rowing: { Light: 4.8, Moderate: 7, Vigorous: 8.5 },
  Swimming: { Light: 5.3, Moderate: 7, Vigorous: 9.8 },
  Elliptical: { Light: 4.6, Moderate: 5.5, Vigorous: 7 },
  "Jump Rope": { Light: 8.8, Moderate: 11.8, Vigorous: 12.3 },
  Hiking: { Light: 4.5, Moderate: 6, Vigorous: 7.3 },
  "Stair Climber": { Light: 4, Moderate: 6, Vigorous: 8.8 },
};

export const CARDIO_TYPES = Object.keys(CARDIO_METS);

export type Intensity = "Light" | "Moderate" | "Vigorous";

/** kcal = MET × 3.5 × kg / 200 × minutes */
export function estimateCardioCalories(
  type: string,
  intensity: Intensity,
  minutes: number,
  bodyweightLb: number,
): number {
  const met = CARDIO_METS[type]?.[intensity] ?? 6;
  const kg = lbToKg(bodyweightLb);
  return Math.round((met * 3.5 * kg) / 200 * minutes);
}
