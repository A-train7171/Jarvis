import "dotenv/config";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type Anthropic from "@anthropic-ai/sdk";
import { getClient, generateStructured, MODEL, NoKeyError } from "./anthropic.js";
import { macroSchema, exerciseSchema, formSchema } from "./schemas.js";
import { MACROS_SYSTEM, EXERCISE_SYSTEM, FORM_SYSTEM, coachSystem } from "./prompts.js";

const app = express();
const PORT = Number(process.env.PORT ?? 8787);

app.use(express.json({ limit: "12mb" })); // form-check images can be large

const origins = (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:4173")
  .split(",")
  .map((s) => s.trim());
app.use(cors({ origin: origins }));

// Rate limit all AI routes: 60 requests / 5 min / IP.
app.use(
  "/api",
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, slow down a moment." },
  }),
);

/** Wrap an async handler and turn a missing key into a clean 503. */
function handler(fn: (req: express.Request, res: express.Response) => Promise<void>) {
  return async (req: express.Request, res: express.Response) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof NoKeyError) {
        res.status(503).json({ error: err.message });
        return;
      }
      console.error(err);
      if (!res.headersSent) res.status(500).json({ error: "AI request failed." });
      else res.end();
    }
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: MODEL, configured: !!getClient() });
});

// landing-page waitlist signups (appended to a JSONL file; swap for a DB later)
const WAITLIST_FILE = resolve(process.env.WAITLIST_FILE ?? "data/waitlist.jsonl");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post(
  "/api/waitlist",
  handler(async (req, res) => {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    // Honeypot: real users leave this empty; bots fill it. Pretend success.
    if (String(req.body?.company ?? "").trim()) {
      res.json({ ok: true });
      return;
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      res.status(400).json({ error: "Please enter a valid email address." });
      return;
    }
    const entry = {
      email,
      source: String(req.body?.source ?? "site").slice(0, 40),
      ts: new Date().toISOString(),
    };
    await mkdir(dirname(WAITLIST_FILE), { recursive: true });
    await appendFile(WAITLIST_FILE, JSON.stringify(entry) + "\n", "utf8");
    res.json({ ok: true });
  }),
);

// meal description -> macros
app.post(
  "/api/macros",
  handler(async (req, res) => {
    const description = String(req.body?.description ?? "").slice(0, 600);
    if (!description.trim()) {
      res.status(400).json({ error: "description is required" });
      return;
    }
    const out = await generateStructured({
      system: MACROS_SYSTEM,
      content: `Estimate macros for: ${description}`,
      schema: macroSchema,
    });
    res.json(out);
  }),
);

// exercise + muscle -> steps/cues/variations
app.post(
  "/api/exercise",
  handler(async (req, res) => {
    const name = String(req.body?.name ?? "").slice(0, 120);
    const muscle = String(req.body?.muscle ?? "").slice(0, 60);
    if (!name.trim()) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const out = await generateStructured({
      system: EXERCISE_SYSTEM,
      content: `Exercise: ${name}\nPrimary muscle group: ${muscle || "unspecified"}`,
      schema: exerciseSchema,
      maxTokens: 1024,
    });
    res.json(out);
  }),
);

// captured frame + exercise -> form feedback (vision)
app.post(
  "/api/form",
  handler(async (req, res) => {
    const exercise = String(req.body?.exercise ?? "").slice(0, 80);
    const image = String(req.body?.image ?? "");
    const parsed = parseDataUrl(image);
    if (!parsed) {
      res.status(400).json({ error: "a base64 image data URL is required" });
      return;
    }
    const content: Anthropic.MessageParam["content"] = [
      {
        type: "image",
        source: { type: "base64", media_type: parsed.mediaType, data: parsed.data },
      },
      { type: "text", text: `The user is attempting: ${exercise || "an exercise"}. Check their form.` },
    ];
    const out = await generateStructured({
      system: FORM_SYSTEM,
      content,
      schema: formSchema,
      maxTokens: 1024,
    });
    res.json(out);
  }),
);

// coach chat — streamed via SSE
app.post(
  "/api/coach",
  handler(async (req, res) => {
    const message = String(req.body?.message ?? "").slice(0, 2000);
    const context = (req.body?.context ?? {}) as Record<string, unknown>;
    if (!message.trim()) {
      res.status(400).json({ error: "message is required" });
      return;
    }
    const client = getClient();
    if (!client) throw new NoKeyError();

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    const send = (obj: unknown) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "disabled" },
      system: coachSystem(context),
      messages: [{ role: "user", content: message }],
    });

    stream.on("text", (delta) => send({ text: delta }));

    req.on("close", () => stream.abort());

    await stream.finalMessage().catch(() => {
      /* aborted or failed; close below */
    });
    res.write("data: [DONE]\n\n");
    res.end();
  }),
);

app.listen(PORT, () => {
  const ready = getClient() ? "configured" : "NO API KEY (routes will 503)";
  console.log(`Pocket Trainer AI backend on :${PORT} — model ${MODEL} — ${ready}`);
});

/** Parse "data:image/jpeg;base64,XXXX" -> {mediaType, data}. */
function parseDataUrl(
  url: string,
): { mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"; data: string } | null {
  const m = /^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/s.exec(url);
  if (!m) return null;
  return { mediaType: m[1] as "image/jpeg", data: m[2] };
}
