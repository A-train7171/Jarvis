/** JSON schemas for structured AI responses (must mirror the app's TS types). */

export const macroSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", description: "Short label for the meal" },
    calories: { type: "number" },
    protein: { type: "number", description: "grams" },
    carbs: { type: "number", description: "grams" },
    fat: { type: "number", description: "grams" },
    sugar: { type: "number", description: "grams" },
  },
  required: ["name", "calories", "protein", "carbs", "fat", "sugar"],
} as const;

export const exerciseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: { type: "array", items: { type: "string" }, description: "Ordered how-to steps" },
    cues: { type: "array", items: { type: "string" }, description: "Short form cues" },
    variations: { type: "array", items: { type: "string" } },
  },
  required: ["steps", "cues", "variations"],
} as const;

export const formSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "One short paragraph of overall feedback" },
    cues: { type: "array", items: { type: "string" }, description: "2-4 specific actionable cues" },
  },
  required: ["summary", "cues"],
} as const;
