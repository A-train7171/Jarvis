import type { FoodItem } from "@/types";

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}

export function totalMacros(items: FoodItem[] = []): MacroTotals {
  return items.reduce<MacroTotals>(
    (acc, i) => ({
      calories: acc.calories + i.calories,
      protein: acc.protein + i.protein,
      carbs: acc.carbs + i.carbs,
      fat: acc.fat + i.fat,
      sugar: acc.sugar + i.sugar,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 },
  );
}
