"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { askCoach, COACH_SUGGESTIONS } from "@/lib/coach-client";
import { COACH_GREETING } from "@/lib/ai/prompt";
import type { ChatMessage } from "@/types";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/utils";

export default function CoachPage() {
  const hydrated = useHydrated();
  const profile = usePT((s) => s.profile);
  const messages = usePT((s) => s.messages);
  const pushMessage = usePT((s) => s.pushMessage);
  const clearChat = usePT((s) => s.clearChat);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || thinking) return;
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: "user", content, ts: Date.now() };
    pushMessage(userMsg);
    setInput("");
    setThinking(true);
    const history = [...usePT.getState().messages];
    const reply = await askCoach(history, profile);
    pushMessage({ id: `c_${Date.now()}`, role: "coach", content: reply, ts: Date.now() });
    setThinking(false);
  }

  const empty = hydrated && messages.length === 0;

  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col animate-fade-up">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="display-italic text-3xl text-ink-primary">Coach</h1>
          <p className="text-[13px] text-ink-secondary">Your AI trainer, on call 24/7.</p>
        </div>
        {hydrated && messages.length > 0 && (
          <button
            onClick={clearChat}
            className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted hover:text-white"
          >
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 space-y-4">
        {/* Greeting bubble */}
        <div className="flex gap-2.5">
          <CoachAvatar />
          <div className="max-w-[80%] rounded-3xl rounded-tl-md border border-line bg-bg-card px-4 py-3 text-sm leading-relaxed text-ink-secondary">
            {COACH_GREETING}
          </div>
        </div>

        {hydrated &&
          messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
              {m.role === "coach" ? <CoachAvatar /> : <span className="w-8 shrink-0" />}
              <div
                className={cn(
                  "max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-tr-md bg-purple-gradient text-white"
                    : "rounded-tl-md border border-line bg-bg-card text-ink-secondary"
                )}
              >
                <FormattedMessage content={m.content} />
              </div>
            </div>
          ))}

        {thinking && (
          <div className="flex gap-2.5">
            <CoachAvatar />
            <div className="flex items-center gap-1 rounded-3xl rounded-tl-md border border-line bg-bg-card px-4 py-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-pulse-glow rounded-full bg-purple"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {empty && (
          <div className="pt-2">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
              Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {COACH_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-2xl border border-line bg-bg-card px-3.5 py-2 text-left text-[13px] text-ink-secondary transition-colors hover:border-purple/50 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="sticky bottom-24 mt-4 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-3xl border border-line bg-bg-card p-2 shadow-lift"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask your coach anything…"
            className="max-h-28 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-gradient text-white shadow-glow-sm transition-opacity disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </form>
        <p className="mt-2 px-2 text-center text-[11px] text-ink-muted">
          General fitness guidance, not medical advice. Consult a professional for health decisions.
        </p>
      </div>
    </div>
  );
}

function CoachAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple/40 bg-black">
      <LogoMark size={18} />
    </span>
  );
}

/** Minimal formatter: preserves line breaks and renders _italic_ segments. */
function FormattedMessage({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, i) => (
        <p key={i} className={cn(line.trim() === "" ? "h-2" : "", i > 0 && line.trim() !== "" && "mt-1.5")}>
          {renderInline(line)}
        </p>
      ))}
    </>
  );
}

function renderInline(line: string) {
  const parts = line.split(/(_[^_]+_)/g);
  return parts.map((p, i) =>
    p.startsWith("_") && p.endsWith("_") && p.length > 2 ? (
      <em key={i} className="text-ink-muted">{p.slice(1, -1)}</em>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
