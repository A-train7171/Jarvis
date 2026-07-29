import { NextRequest, NextResponse } from "next/server";
import type { UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/lib/data";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { offlineCoachReply } from "@/lib/ai/fallback";

export const runtime = "nodejs";

const DEFAULT_MODEL = process.env.PT_AI_MODEL || "claude-sonnet-5";

interface ClientMessage {
  role: "user" | "coach";
  content: string;
}

interface CoachRequest {
  messages: ClientMessage[];
  profile?: UserProfile;
}

/**
 * Server-side Coach endpoint. The API key never leaves the server. If no key is
 * configured, we transparently fall back to the offline knowledge engine so the
 * feature always works.
 */
export async function POST(req: NextRequest) {
  let body: CoachRequest;
  try {
    body = (await req.json()) as CoachRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const profile = body.profile ?? DEFAULT_PROFILE;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  if (!lastUser || !lastUser.content.trim()) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key → offline engine (still safe + useful).
  if (!apiKey) {
    return NextResponse.json({
      reply: offlineCoachReply(lastUser.content, profile),
      source: "offline",
    });
  }

  try {
    const anthropicMessages = messages.slice(-12).map((m) => ({
      role: m.role === "coach" ? "assistant" : "user",
      content: m.content,
    }));

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 700,
        system: buildSystemPrompt(profile),
        messages: anthropicMessages,
      }),
    });

    if (!res.ok) {
      // Degrade gracefully rather than failing the user's request.
      return NextResponse.json({
        reply: offlineCoachReply(lastUser.content, profile),
        source: "offline_fallback",
      });
    }

    const data = await res.json();
    const reply: string =
      data?.content?.map((c: { text?: string }) => c.text ?? "").join("").trim() ||
      offlineCoachReply(lastUser.content, profile);

    return NextResponse.json({ reply, source: "live" });
  } catch {
    return NextResponse.json({
      reply: offlineCoachReply(lastUser.content, profile),
      source: "offline_fallback",
    });
  }
}
