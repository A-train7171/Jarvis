/**
 * AI client.
 *
 * Every AI call goes through our backend (Milestone 2) so the Anthropic API key
 * stays server-side and is never bundled into the app. Until the backend is
 * wired up — and any time it is unreachable — we degrade gracefully to small
 * local heuristics so the app stays usable offline. The shapes below are the
 * contract the backend must honor.
 */

import type { FoodItem } from "@/types";
import { uid } from "./util";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  return (await res.json()) as T;
}

export type MacroEstimate = Omit<FoodItem, "id">;

/** Estimate macros from a plain-language meal description. */
export async function estimateMacros(description: string): Promise<MacroEstimate> {
  try {
    return await postJSON<MacroEstimate>("/api/macros", { description });
  } catch {
    return localMacroGuess(description);
  }
}

export interface ExerciseDetail {
  steps: string[];
  cues: string[];
  variations: string[];
}

/** AI-generated steps/cues/variations for a library exercise (cached upstream). */
export async function exerciseDetail(name: string, muscle: string): Promise<ExerciseDetail> {
  try {
    return await postJSON<ExerciseDetail>("/api/exercise", { name, muscle });
  } catch {
    return {
      steps: [
        "Set up with a stable base and a neutral spine.",
        `Move through the ${name} with control — no bouncing.`,
        "Pause briefly at the hardest point, then return.",
      ],
      cues: ["Brace your core", "Full range of motion", "Steady tempo (2s down, 1s up)"],
      variations: ["Add tempo", "Increase load", "Single-side version"],
    };
  }
}

const COACH_OFFLINE =
  "I'm offline right now, so here's the basics: stay consistent, hit your protein, sleep 7–9 hours, and progress gradually. We'll dig into specifics once I'm back online. (General info, not medical advice.)";

/**
 * Stream a coach reply token-by-token from the backend (SSE). `onDelta` is
 * called with each chunk; the full text is returned. Falls back to a static
 * offline message if the server is unreachable or returns an error.
 */
export async function coachStream(
  message: string,
  context: Record<string, unknown>,
  onDelta: (chunk: string) => void,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });
  } catch {
    onDelta(COACH_OFFLINE);
    return COACH_OFFLINE;
  }
  if (!res.ok || !res.body) {
    onDelta(COACH_OFFLINE);
    return COACH_OFFLINE;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  // Parse the SSE stream: lines of `data: {...}` separated by blank lines.
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const evt of events) {
      const line = evt.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return full;
      try {
        const { text } = JSON.parse(payload) as { text?: string };
        if (text) {
          full += text;
          onDelta(text);
        }
      } catch {
        /* ignore malformed event */
      }
    }
  }
  return full || COACH_OFFLINE;
}

export interface FormFeedback {
  summary: string;
  cues: string[];
}

/** Form-check feedback from a captured frame (data URL). */
export async function formCheck(imageDataUrl: string, exercise: string): Promise<FormFeedback> {
  try {
    return await postJSON<FormFeedback>("/api/form", { image: imageDataUrl, exercise });
  } catch {
    return {
      summary:
        "Form check needs the coaching server, which isn't connected yet. Once it's online I'll give you specific cues from your photo.",
      cues: ["Keep a neutral spine", "Knees track over toes", "Control the eccentric"],
    };
  }
}

/* ----------------------------- local fallback ----------------------------- */

/** Rough offline macro guess so manual flow still works without a backend. */
function localMacroGuess(description: string): MacroEstimate {
  const d = description.toLowerCase();
  let calories = 300;
  let protein = 15;
  let carbs = 30;
  let fat = 10;
  let sugar = 5;
  if (/chicken|beef|steak|turkey|fish|salmon|egg|protein|tofu/.test(d)) {
    protein += 25;
    calories += 150;
  }
  if (/rice|pasta|bread|potato|oat|cereal|bagel/.test(d)) {
    carbs += 40;
    calories += 200;
  }
  if (/cheese|butter|oil|avocado|nuts|peanut/.test(d)) {
    fat += 15;
    calories += 130;
  }
  if (/soda|candy|cake|cookie|donut|sugar|juice|ice cream/.test(d)) {
    sugar += 25;
    carbs += 25;
    calories += 180;
  }
  const name = description.trim().slice(0, 40) || "Meal";
  return { name, calories, protein, carbs, fat, sugar };
}

export { uid };
