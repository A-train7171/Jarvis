import { useEffect, useRef, useState } from "react";
import { colors, gradient } from "@/theme";
import { Screen } from "@/components/Screen";
import { Disclaimer, Spinner } from "@/components/ui";
import { useApp } from "@/store/AppContext";
import { coachReply } from "@/lib/ai";
import { rankFor } from "@/lib/ranks";
import { uid } from "@/lib/util";
import type { CoachMsg } from "@/types";

export function Coach() {
  const { state, set } = useApp();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const msgs = state.coachMsgs;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, sending]);

  function pushMsg(msg: CoachMsg) {
    set((prev) => ({ ...prev, coachMsgs: [...prev.coachMsgs, msg] }));
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    pushMsg({ id: uid(), role: "user", text, ts: new Date().toISOString() });
    setSending(true);

    const context = {
      name: state.name,
      rank: rankFor(state.activeDays),
      experience: state.profile.experience,
      goalMode: state.profile.mode,
      goals: state.goals,
      streak: state.streak,
      bodyweightLb: state.profile.weightLb,
    };

    try {
      const reply = await coachReply(text, context);
      pushMsg({ id: uid(), role: "assistant", text: reply.text, ts: new Date().toISOString() });
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <Screen title="Coach">
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", color: colors.muted, padding: "24px 8px" }}>
            <div style={{ fontSize: 15, color: colors.light, marginBottom: 6 }}>
              Hey {state.name.split(" ")[0] || "there"} 👋
            </div>
            Ask me about training, nutrition, recovery, or your plan. I know your stats.
          </div>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                justifySelf: m.role === "user" ? "end" : "start",
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: 14,
                fontSize: 14,
                lineHeight: 1.5,
                background: m.role === "user" ? gradient : colors.charcoal2,
                border: m.role === "user" ? "none" : `1px solid ${colors.line}`,
                color: "#fff",
              }}
            >
              {m.text}
            </div>
          ))}
          {sending && (
            <div style={{ justifySelf: "start", padding: "10px 14px" }}>
              <Spinner />
            </div>
          )}
        </div>
        <div ref={endRef} />
        <Disclaimer />
      </Screen>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
          borderTop: `1px solid ${colors.line}`,
          background: colors.jet,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message your coach…"
          aria-label="Message your coach"
          style={{
            flex: 1,
            background: colors.charcoal,
            border: `1px solid ${colors.line}`,
            borderRadius: 999,
            color: "#fff",
            padding: "12px 16px",
            fontSize: 15,
          }}
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          aria-label="Send"
          style={{
            background: gradient,
            border: "none",
            borderRadius: "50%",
            width: 46,
            height: 46,
            color: "#fff",
            fontSize: 18,
            opacity: sending || !input.trim() ? 0.5 : 1,
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
