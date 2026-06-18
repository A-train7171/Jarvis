/** Rank progression — advances one tier every 10 active days. */

export const RANKS = [
  "Beginner",
  "Athlete",
  "Pro",
  "Gym Rat",
  "Beast",
  "Titan",
  "Legend",
] as const;

export type Rank = (typeof RANKS)[number];

const DAYS_PER_RANK = 10;

export function rankIndex(activeDays: number): number {
  return Math.min(RANKS.length - 1, Math.floor(activeDays / DAYS_PER_RANK));
}

export function rankFor(activeDays: number): Rank {
  return RANKS[rankIndex(activeDays)];
}

/** Progress (0..1) within the current rank toward the next. */
export function rankProgress(activeDays: number): number {
  const idx = rankIndex(activeDays);
  if (idx >= RANKS.length - 1) return 1;
  const into = activeDays - idx * DAYS_PER_RANK;
  return Math.max(0, Math.min(1, into / DAYS_PER_RANK));
}

export function daysToNextRank(activeDays: number): number {
  const idx = rankIndex(activeDays);
  if (idx >= RANKS.length - 1) return 0;
  return (idx + 1) * DAYS_PER_RANK - activeDays;
}
