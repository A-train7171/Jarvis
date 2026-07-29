import type { ChatMessage, UserProfile } from "@/types";
import { offlineCoachReply } from "@/lib/ai/fallback";

/**
 * Client helper that talks to the server-side /api/coach route. Falls back to
 * the local knowledge engine if the network is unavailable, so the Coach never
 * leaves the user hanging.
 */
export async function askCoach(
  messages: ChatMessage[],
  profile: UserProfile
): Promise<string> {
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        profile,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error(`coach ${res.status}`);
    const data = (await res.json()) as { reply?: string };
    if (data.reply) return data.reply;
    throw new Error("empty reply");
  } catch {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return offlineCoachReply(lastUser?.content ?? "", profile);
  }
}

export const COACH_SUGGESTIONS = [
  "How do I start if I'm a total beginner?",
  "How much protein should I eat?",
  "I keep losing motivation — help.",
  "How do I fix my squat depth?",
];
