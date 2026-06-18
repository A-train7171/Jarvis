import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

let client: Anthropic | null = null;

/** Lazily build the client so the server still boots without a key (routes 503). */
export function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export class NoKeyError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY is not configured on the server.");
  }
}

type JSONSchema = Record<string, unknown>;

/**
 * Run a single structured-output request and return the parsed JSON.
 * Uses output_config.format so the model is constrained to the schema.
 */
export async function generateStructured<T>(opts: {
  system: string;
  content: Anthropic.MessageParam["content"];
  schema: JSONSchema;
  maxTokens?: number;
}): Promise<T> {
  const c = getClient();
  if (!c) throw new NoKeyError();

  const res = await c.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 1024,
    thinking: { type: "disabled" },
    system: opts.system,
    output_config: { format: { type: "json_schema", schema: opts.schema } },
    messages: [{ role: "user", content: opts.content }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return JSON.parse(text) as T;
}
