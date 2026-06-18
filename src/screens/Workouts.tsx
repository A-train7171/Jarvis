import { useMemo, useState } from "react";
import { colors, displayHeading } from "@/theme";
import { Screen } from "@/components/Screen";
import {
  Button,
  Card,
  EmptyState,
  Field,
  FieldLabel,
  Pill,
  ProgressBar,
  SectionTitle,
  Spinner,
} from "@/components/ui";
import { IconPlus, IconTrash, IconCheck, IconDumbbell, IconChevron } from "@/components/icons";
import { MuscleMap, type MuscleGroup } from "@/components/MuscleMap";
import { useApp } from "@/store/AppContext";
import { uid } from "@/lib/util";
import { CARDIO_TYPES, estimateCardioCalories, type Intensity } from "@/lib/cardio";
import { LIBRARY, MUSCLE_GROUPS } from "@/lib/exercises";
import { exerciseDetail, type ExerciseDetail } from "@/lib/ai";
import type { CardioExercise, ResistanceExercise, Workout, WorkoutExercise } from "@/types";

type Stage = "overview" | "builder" | "live" | "library";

const detailCache = new Map<string, ExerciseDetail>();

export function Workouts() {
  const { state, completeWorkout } = useApp();
  const [stage, setStage] = useState<Stage>("overview");
  const [draft, setDraft] = useState<Workout | null>(null);

  function newWorkout() {
    setDraft({ id: uid(), date: "", name: "New Workout", exercises: [], completed: false });
    setStage("builder");
  }

  function startSession() {
    // Move from builder → live. Building alone never changes the score.
    setStage("live");
  }

  function finishSession() {
    if (draft) completeWorkout(draft);
    setDraft(null);
    setStage("overview");
  }

  if (stage === "builder" && draft) {
    return (
      <Builder
        draft={draft}
        setDraft={setDraft}
        bodyweight={state.profile.weightLb}
        onStart={startSession}
        onCancel={() => { setDraft(null); setStage("overview"); }}
      />
    );
  }

  if (stage === "live" && draft) {
    return (
      <LiveSession
        draft={draft}
        setDraft={setDraft}
        onFinish={finishSession}
        onBack={() => setStage("builder")}
      />
    );
  }

  if (stage === "library") {
    return <Library onBack={() => setStage("overview")} />;
  }

  // overview + history
  const completed = state.workouts.filter((w) => w.completed);
  return (
    <Screen title="Workouts">
      <Button onClick={newWorkout} style={{ marginBottom: 12 }}>
        + New workout
      </Button>
      <Button variant="ghost" onClick={() => setStage("library")} style={{ marginBottom: 18 }}>
        Browse exercise library
      </Button>

      <SectionTitle>History</SectionTitle>
      {completed.length === 0 ? (
        <EmptyState icon={<IconDumbbell />} title="No completed workouts yet" body="Build one, then finish it to log it here." />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {completed.map((w) => (
            <Card key={w.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {w.name} <span style={{ color: colors.good }}>✓</span>
                  </div>
                  <div style={{ color: colors.muted, fontSize: 12 }}>{w.date}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                {w.exercises.map((ex) => (
                  <div key={ex.id} style={{ fontSize: 13, color: colors.light }}>
                    {ex.kind === "resistance"
                      ? `${ex.name} — ${ex.sets.length} set(s)`
                      : `${ex.type} — ${ex.minutes} min · ${ex.calories} kcal`}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}

/* ------------------------------- Builder -------------------------------- */

function Builder({
  draft,
  setDraft,
  bodyweight,
  onStart,
  onCancel,
}: {
  draft: Workout;
  setDraft: (w: Workout) => void;
  bodyweight: number;
  onStart: () => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<"resistance" | "cardio">("resistance");

  // resistance form
  const [exName, setExName] = useState("");
  // cardio form
  const [cType, setCType] = useState(CARDIO_TYPES[0]);
  const [cMin, setCMin] = useState(30);
  const [cDist, setCDist] = useState(0);
  const [cInt, setCInt] = useState<Intensity>("Moderate");

  const update = (exercises: WorkoutExercise[]) => setDraft({ ...draft, exercises });

  function addResistance() {
    if (!exName.trim()) return;
    const ex: ResistanceExercise = {
      kind: "resistance",
      id: uid(),
      name: exName.trim(),
      sets: [{ reps: 10, weight: 0, toFailure: false }],
    };
    update([...draft.exercises, ex]);
    setExName("");
  }

  function addCardio() {
    const calories = estimateCardioCalories(cType, cInt, cMin, bodyweight);
    const ex: CardioExercise = {
      kind: "cardio",
      id: uid(),
      type: cType,
      minutes: cMin,
      distance: cDist,
      distanceUnit: "mi",
      intensity: cInt,
      calories,
    };
    update([...draft.exercises, ex]);
    setCDist(0);
  }

  function editSet(exId: string, idx: number, patch: Partial<{ reps: number; weight: number; toFailure: boolean }>) {
    update(
      draft.exercises.map((ex) =>
        ex.id === exId && ex.kind === "resistance"
          ? { ...ex, sets: ex.sets.map((s, i) => (i === idx ? { ...s, ...patch } : s)) }
          : ex,
      ),
    );
  }
  function addSet(exId: string) {
    update(
      draft.exercises.map((ex) =>
        ex.id === exId && ex.kind === "resistance"
          ? { ...ex, sets: [...ex.sets, { reps: 10, weight: ex.sets.at(-1)?.weight ?? 0, toFailure: false }] }
          : ex,
      ),
    );
  }
  function removeExercise(exId: string) {
    update(draft.exercises.filter((ex) => ex.id !== exId));
  }

  const liveCardioCal = estimateCardioCalories(cType, cInt, cMin, bodyweight);

  return (
    <Screen
      title="Build workout"
      onBack={onCancel}
    >
      <Field label="Workout name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />

      <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
        <Pill active={tab === "resistance"} onClick={() => setTab("resistance")}>Resistance</Pill>
        <Pill active={tab === "cardio"} onClick={() => setTab("cardio")}>Cardio</Pill>
      </div>

      {tab === "resistance" ? (
        <Card style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input
            value={exName}
            placeholder="e.g. Barbell Bench Press"
            onChange={(e) => setExName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addResistance()}
            style={{ flex: 1, background: colors.charcoal, border: `1px solid ${colors.line}`, borderRadius: 10, color: "#fff", padding: "12px 14px" }}
          />
          <Button onClick={addResistance} style={{ width: "auto", padding: "0 16px" }}>
            <IconPlus />
          </Button>
        </Card>
      ) : (
        <Card style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <FieldLabel>Type</FieldLabel>
          <select value={cType} onChange={(e) => setCType(e.target.value)} style={selStyle}>
            {CARDIO_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Minutes" type="number" value={cMin} onChange={(e) => setCMin(Number(e.target.value))} />
            <Field label="Distance" type="number" value={cDist} onChange={(e) => setCDist(Number(e.target.value))} hint="mi" />
          </div>
          <div>
            <FieldLabel>Intensity</FieldLabel>
            <div style={{ display: "flex", gap: 8 }}>
              {(["Light", "Moderate", "Vigorous"] as Intensity[]).map((x) => (
                <Pill key={x} active={cInt === x} onClick={() => setCInt(x)}>{x}</Pill>
              ))}
            </div>
          </div>
          <div style={{ color: colors.glow, fontSize: 13 }}>≈ {liveCardioCal} kcal</div>
          <Button onClick={addCardio}>Add cardio</Button>
        </Card>
      )}

      <SectionTitle>Exercises ({draft.exercises.length})</SectionTitle>
      {draft.exercises.length === 0 ? (
        <Card style={{ color: colors.muted, fontSize: 13, marginBottom: 16 }}>Add resistance or cardio above.</Card>
      ) : (
        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          {draft.exercises.map((ex) =>
            ex.kind === "resistance" ? (
              <Card key={ex.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{ex.name}</div>
                  <button onClick={() => removeExercise(ex.id)} aria-label="Remove" style={iconBtn}><IconTrash /></button>
                </div>
                {ex.sets.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ color: colors.muted, width: 18, fontSize: 12 }}>{i + 1}</span>
                    <NumBox label="reps" value={s.reps} onChange={(v) => editSet(ex.id, i, { reps: v })} />
                    <NumBox label="lb" value={s.weight} onChange={(v) => editSet(ex.id, i, { weight: v })} />
                    <Pill active={s.toFailure} onClick={() => editSet(ex.id, i, { toFailure: !s.toFailure })} style={{ padding: "6px 10px", fontSize: 11 }}>
                      AMRAP
                    </Pill>
                  </div>
                ))}
                <Button variant="ghost" onClick={() => addSet(ex.id)} style={{ marginTop: 6, padding: "8px" }}>+ Add set</Button>
              </Card>
            ) : (
              <Card key={ex.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{ex.type}</div>
                    <div style={{ color: colors.muted, fontSize: 12 }}>
                      {ex.minutes} min · {ex.distance} {ex.distanceUnit} · {ex.intensity} · {ex.calories} kcal
                    </div>
                  </div>
                  <button onClick={() => removeExercise(ex.id)} aria-label="Remove" style={iconBtn}><IconTrash /></button>
                </div>
              </Card>
            ),
          )}
        </div>
      )}

      {/* NOTE: "Start workout" opens the live session — it does NOT complete it. */}
      <Button onClick={onStart} disabled={draft.exercises.length === 0}>
        Start workout
      </Button>
    </Screen>
  );
}

/* ----------------------------- Live session ----------------------------- */

function LiveSession({
  draft,
  setDraft,
  onFinish,
  onBack,
}: {
  draft: Workout;
  setDraft: (w: Workout) => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const { total, done } = useMemo(() => {
    let t = 0;
    let d = 0;
    for (const ex of draft.exercises) {
      if (ex.kind === "resistance") {
        t += ex.sets.length;
        d += ex.sets.filter((s) => s.done).length;
      } else {
        t += 1;
        if (ex.done) d += 1;
      }
    }
    return { total: t, done: d };
  }, [draft]);

  function toggleSet(exId: string, idx: number) {
    setDraft({
      ...draft,
      exercises: draft.exercises.map((ex) =>
        ex.id === exId && ex.kind === "resistance"
          ? { ...ex, sets: ex.sets.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)) }
          : ex,
      ),
    });
  }
  function toggleCardio(exId: string) {
    setDraft({
      ...draft,
      exercises: draft.exercises.map((ex) => (ex.id === exId && ex.kind === "cardio" ? { ...ex, done: !ex.done } : ex)),
    });
  }

  return (
    <Screen title={draft.name} onBack={onBack}>
      <Card style={{ marginBottom: 14 }}>
        <ProgressBar value={done} max={total} label="Session progress" />
        <div style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{done} / {total} items complete</div>
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {draft.exercises.map((ex) =>
          ex.kind === "resistance" ? (
            <Card key={ex.id}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{ex.name}</div>
              {ex.sets.map((s, i) => (
                <button
                  key={i}
                  onClick={() => toggleSet(ex.id, i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: s.done ? "rgba(63,209,139,0.12)" : colors.charcoal,
                    border: `1px solid ${s.done ? colors.good : colors.line}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  <Checkbox on={!!s.done} />
                  <span style={{ flex: 1, textAlign: "left", fontSize: 14 }}>
                    Set {i + 1}: {s.reps} reps {s.weight ? `× ${s.weight} lb` : ""} {s.toFailure ? "· AMRAP" : ""}
                  </span>
                </button>
              ))}
            </Card>
          ) : (
            <Card key={ex.id}>
              <button
                onClick={() => toggleCardio(ex.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                }}
              >
                <Checkbox on={!!ex.done} />
                <span style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 700 }}>{ex.type}</div>
                  <div style={{ color: colors.muted, fontSize: 12 }}>
                    {ex.minutes} min · {ex.intensity} · {ex.calories} kcal
                  </div>
                </span>
              </button>
            </Card>
          ),
        )}
      </div>

      {/* Only this completes the workout, logs it, and bumps streak/rank. */}
      <Button onClick={onFinish} style={{ marginTop: 16 }}>
        Finish workout
      </Button>
    </Screen>
  );
}

/* ------------------------------- Library -------------------------------- */

function Library({ onBack }: { onBack: () => void }) {
  const [group, setGroup] = useState<MuscleGroup>("Chest");
  const [open, setOpen] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(false);

  async function openExercise(name: string) {
    if (open === name) {
      setOpen(null);
      return;
    }
    setOpen(name);
    const key = `${group}:${name}`;
    if (detailCache.has(key)) {
      setDetail(detailCache.get(key)!);
      return;
    }
    setLoading(true);
    setDetail(null);
    try {
      const d = await exerciseDetail(name, group);
      detailCache.set(key, d);
      setDetail(d);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Exercise library" onBack={onBack}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <MuscleMap active={group} size={120} />
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
        {MUSCLE_GROUPS.map((g) => (
          <Pill key={g} active={group === g} onClick={() => { setGroup(g); setOpen(null); }}>{g}</Pill>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {LIBRARY[group].map((name) => (
          <Card key={name}>
            <button
              onClick={() => openExercise(name)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", color: "#fff" }}
            >
              <span style={{ fontWeight: 700 }}>{name}</span>
              <span style={{ transform: open === name ? "rotate(90deg)" : "none", transition: "transform .2s", color: colors.muted }}>
                <IconChevron />
              </span>
            </button>
            {open === name && (
              <div style={{ marginTop: 12, fontSize: 13 }}>
                {loading ? (
                  <Spinner />
                ) : detail ? (
                  <>
                    <DetailList title="Steps" items={detail.steps} ordered />
                    <DetailList title="Cues" items={detail.cues} />
                    <DetailList title="Variations" items={detail.variations} />
                  </>
                ) : null}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Screen>
  );
}

function DetailList({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...displayHeading, fontSize: 13, color: colors.glow, marginBottom: 4 }}>{title}</div>
      <List style={{ margin: 0, paddingLeft: 18, color: colors.light, display: "grid", gap: 3 }}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </List>
    </div>
  );
}

/* ------------------------------ small bits ------------------------------ */

const selStyle: React.CSSProperties = {
  background: colors.charcoal,
  border: `1px solid ${colors.line}`,
  borderRadius: 10,
  color: "#fff",
  padding: "12px 14px",
  fontSize: 15,
  width: "100%",
};
const iconBtn: React.CSSProperties = { background: "transparent", border: "none", color: colors.bad };

function NumBox({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", background: colors.charcoal, border: `1px solid ${colors.line}`, borderRadius: 8, color: "#fff", padding: "8px 8px", fontSize: 14 }}
      />
      <span style={{ color: colors.muted, fontSize: 11 }}>{label}</span>
    </div>
  );
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `2px solid ${on ? colors.good : colors.muted}`,
        background: on ? colors.good : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#05130c",
        flexShrink: 0,
      }}
    >
      {on && <IconCheck size={14} />}
    </span>
  );
}
