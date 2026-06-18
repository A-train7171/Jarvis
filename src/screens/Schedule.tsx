import { useMemo, useState } from "react";
import { colors, displayHeading, gradient } from "@/theme";
import { Screen } from "@/components/Screen";
import { Button, Card, Disclaimer, Field, SectionTitle } from "@/components/ui";
import { IconPlus, IconTrash } from "@/components/icons";
import { useApp } from "@/store/AppContext";
import { fmtClock, timeToMin, uid } from "@/lib/util";
import type { Commitment } from "@/types";

interface Slot {
  start: number;
  end: number;
  kind: "home" | "gym";
}

export function Schedule() {
  const { state, set } = useApp();
  const prefs = state.schedulePrefs;
  const commitments = [...state.planned].sort((a, b) => timeToMin(a.start) - timeToMin(b.start));

  const [name, setName] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [showPrefs, setShowPrefs] = useState(false);

  function add() {
    if (!name.trim()) return;
    const c: Commitment = { id: uid(), name: name.trim(), start, end };
    set((prev) => ({ ...prev, planned: [...prev.planned, c] }));
    setName("");
  }
  function remove(id: string) {
    set((prev) => ({ ...prev, planned: prev.planned.filter((c) => c.id !== id) }));
  }
  function setPref<K extends keyof typeof prefs>(key: K, value: (typeof prefs)[K]) {
    set((prev) => ({ ...prev, schedulePrefs: { ...prev.schedulePrefs, [key]: value } }));
  }

  // compute open gaps → proposed sessions
  const slots = useMemo<Slot[]>(() => {
    const dayStart = timeToMin(prefs.dayStart);
    const dayEnd = timeToMin(prefs.dayEnd);
    const busy = commitments
      .map((c) => ({ s: timeToMin(c.start), e: timeToMin(c.end) }))
      .filter((b) => b.e > dayStart && b.s < dayEnd)
      .sort((a, b) => a.s - b.s);

    const out: Slot[] = [];
    let cursor = dayStart;
    for (const b of busy) {
      if (b.s > cursor) proposeGap(cursor, b.s, out, prefs);
      cursor = Math.max(cursor, b.e);
    }
    if (cursor < dayEnd) proposeGap(cursor, dayEnd, out, prefs);
    return out;
  }, [commitments, prefs]);

  // merged, sorted timeline of commitments + proposed sessions
  const timeline = useMemo(() => {
    const items = [
      ...commitments.map((c) => ({ kind: "busy" as const, start: timeToMin(c.start), end: timeToMin(c.end), label: c.name })),
      ...slots.map((s) => ({ kind: s.kind, start: s.start, end: s.end, label: s.kind === "gym" ? "Gym session" : "Home session" })),
    ];
    return items.sort((a, b) => a.start - b.start);
  }, [commitments, slots]);

  return (
    <Screen
      title="Smart Schedule"
      right={
        <button onClick={() => setShowPrefs((v) => !v)} style={{ background: "transparent", border: `1px solid ${colors.line}`, color: colors.light, borderRadius: 999, padding: "6px 12px", fontSize: 12 }}>
          Preferences
        </button>
      }
    >
      {showPrefs && (
        <Card style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Day starts" type="time" value={prefs.dayStart} onChange={(e) => setPref("dayStart", e.target.value)} />
            <Field label="Day ends" type="time" value={prefs.dayEnd} onChange={(e) => setPref("dayEnd", e.target.value)} />
            <Field label="Home session (min)" type="number" value={prefs.homeSessionMin} onChange={(e) => setPref("homeSessionMin", Number(e.target.value))} />
            <Field label="Gym session (min)" type="number" value={prefs.gymSessionMin} onChange={(e) => setPref("gymSessionMin", Number(e.target.value))} />
            <Field label="Commute each way (min)" type="number" value={prefs.commuteMin} onChange={(e) => setPref("commuteMin", Number(e.target.value))} />
          </div>
        </Card>
      )}

      <SectionTitle>Add a commitment</SectionTitle>
      <Card style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        <Field label="What" value={name} placeholder="Class, work, practice…" onChange={(e) => setName(e.target.value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <Field label="End" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          <Button onClick={add} style={{ width: "auto", padding: "12px 16px" }}><IconPlus /></Button>
        </div>
      </Card>

      <SectionTitle>Your day</SectionTitle>
      {timeline.length === 0 ? (
        <Card style={{ color: colors.muted, fontSize: 13 }}>
          Add your commitments above and I'll find open gaps for training.
        </Card>
      ) : (
        <div style={{ position: "relative", paddingLeft: 64 }}>
          <div style={{ position: "absolute", left: 56, top: 6, bottom: 6, width: 2, background: colors.line }} />
          <div style={{ display: "grid", gap: 12 }}>
            {timeline.map((it, i) => {
              const isBusy = it.kind === "busy";
              const accent = isBusy ? colors.line : it.kind === "gym" ? colors.primary : colors.glow;
              return (
                <div key={i} style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: -64, top: 2, width: 48, textAlign: "right", color: colors.muted, fontSize: 11 }}>
                    {fmtClock(it.start)}
                  </span>
                  <span style={{ position: "absolute", left: -12, top: 6, width: 12, height: 12, borderRadius: "50%", background: isBusy ? colors.line : gradient, border: `2px solid ${colors.jet}` }} />
                  <Card style={{ borderColor: accent, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: isBusy ? colors.light : "#fff" }}>{it.label}</div>
                        <div style={{ color: colors.muted, fontSize: 12 }}>
                          {fmtClock(it.start)} – {fmtClock(it.end)} · {it.end - it.start} min
                          {!isBusy && it.kind === "gym" ? " (incl. commute)" : ""}
                        </div>
                      </div>
                      {isBusy ? (
                        <button
                          onClick={() => {
                            const c = commitments.find((x) => x.name === it.label && timeToMin(x.start) === it.start);
                            if (c) remove(c.id);
                          }}
                          aria-label="Remove commitment"
                          style={{ background: "transparent", border: "none", color: colors.bad }}
                        >
                          <IconTrash />
                        </button>
                      ) : (
                        <span style={{ ...displayHeading, fontSize: 12, color: accent }}>{it.kind === "gym" ? "GYM" : "HOME"}</span>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Disclaimer />
    </Screen>
  );
}

/** Propose a home (short gap) or gym (longer gap incl. commute) session in a gap. */
function proposeGap(s: number, e: number, out: Slot[], prefs: { homeSessionMin: number; gymSessionMin: number; commuteMin: number }) {
  const gap = e - s;
  const gymNeeded = prefs.gymSessionMin + prefs.commuteMin * 2;
  if (gap >= gymNeeded) {
    // center the gym session within the gap
    const startAt = s + Math.floor((gap - gymNeeded) / 2);
    out.push({ start: startAt, end: startAt + gymNeeded, kind: "gym" });
  } else if (gap >= prefs.homeSessionMin) {
    const startAt = s + Math.floor((gap - prefs.homeSessionMin) / 2);
    out.push({ start: startAt, end: startAt + prefs.homeSessionMin, kind: "home" });
  }
}
