import { useState } from "react";
import { colors } from "@/theme";
import { Screen } from "@/components/Screen";
import { Button, Card, Disclaimer, Field, FieldLabel, ProgressBar, SectionTitle, Spinner } from "@/components/ui";
import { IconPlus, IconTrash } from "@/components/icons";
import { useApp } from "@/store/AppContext";
import { totalMacros } from "@/lib/nutrition";
import { todayISO } from "@/lib/util";
import { estimateMacros } from "@/lib/ai";
import type { FoodItem } from "@/types";

const EMPTY = { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 };

export function Nutrition() {
  const { state, addFood, updateFood, removeFood } = useApp();
  const today = todayISO();
  const items = state.food[today] ?? [];
  const macros = totalMacros(items);

  const [desc, setDesc] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [draft, setDraft] = useState<Omit<FoodItem, "id">>(EMPTY);
  const [showManual, setShowManual] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  async function onEstimate() {
    if (!desc.trim()) return;
    setEstimating(true);
    try {
      const est = await estimateMacros(desc.trim());
      setDraft(est);
      setShowManual(true);
    } finally {
      setEstimating(false);
    }
  }

  function logDraft() {
    if (!draft.name.trim()) return;
    if (editId) {
      updateFood(today, editId, draft);
      setEditId(null);
    } else {
      addFood(today, draft);
    }
    setDraft(EMPTY);
    setDesc("");
    setShowManual(false);
  }

  function startEdit(item: FoodItem) {
    const { id, ...rest } = item;
    setEditId(id);
    setDraft(rest);
    setShowManual(true);
  }

  return (
    <Screen title="Nutrition">
      <SectionTitle>Today's totals</SectionTitle>
      <Card style={{ display: "grid", gap: 12, marginBottom: 18 }}>
        <ProgressBar value={macros.calories} max={state.goals.cal} label="Calories" />
        <ProgressBar value={macros.protein} max={state.goals.p} label="Protein (g)" color={colors.good} />
        <ProgressBar value={macros.carbs} max={state.goals.c} label="Carbs (g)" color={colors.glow} />
        <ProgressBar value={macros.fat} max={state.goals.f} label="Fat (g)" color={colors.warn} />
        <ProgressBar value={macros.sugar} max={state.goals.sug} label="Sugar (g)" color={colors.bad} />
      </Card>

      <SectionTitle>Add food</SectionTitle>
      <Card style={{ marginBottom: 14 }}>
        <FieldLabel>Describe a meal</FieldLabel>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="2 eggs, oatmeal with banana, black coffee"
          rows={2}
          style={{
            width: "100%",
            background: colors.charcoal,
            border: `1px solid ${colors.line}`,
            borderRadius: 10,
            color: colors.white,
            padding: "12px 14px",
            fontSize: 15,
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button onClick={onEstimate} disabled={estimating || !desc.trim()}>
            {estimating ? <Spinner /> : "Estimate macros with AI"}
          </Button>
          <Button variant="ghost" onClick={() => { setShowManual((v) => !v); setEditId(null); setDraft(EMPTY); }} style={{ width: "auto", padding: "0 16px" }}>
            <IconPlus />
          </Button>
        </div>
      </Card>

      {showManual && (
        <Card style={{ marginBottom: 14, display: "grid", gap: 10 }}>
          <Field label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Calories" type="number" value={draft.calories} onChange={(e) => setDraft({ ...draft, calories: Number(e.target.value) })} />
            <Field label="Protein (g)" type="number" value={draft.protein} onChange={(e) => setDraft({ ...draft, protein: Number(e.target.value) })} />
            <Field label="Carbs (g)" type="number" value={draft.carbs} onChange={(e) => setDraft({ ...draft, carbs: Number(e.target.value) })} />
            <Field label="Fat (g)" type="number" value={draft.fat} onChange={(e) => setDraft({ ...draft, fat: Number(e.target.value) })} />
            <Field label="Sugar (g)" type="number" value={draft.sugar} onChange={(e) => setDraft({ ...draft, sugar: Number(e.target.value) })} />
          </div>
          <Button onClick={logDraft} disabled={!draft.name.trim()}>
            {editId ? "Save changes" : "Log food"}
          </Button>
        </Card>
      )}

      <SectionTitle>Logged today ({items.length})</SectionTitle>
      {items.length === 0 ? (
        <Card style={{ color: colors.muted, fontSize: 13 }}>Nothing logged yet.</Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((it) => (
            <Card key={it.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }} onClick={() => startEdit(it)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && startEdit(it)}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div style={{ color: colors.muted, fontSize: 12 }}>
                  {it.calories} kcal · P{it.protein} C{it.carbs} F{it.fat} · {it.sugar}g sugar
                </div>
              </div>
              <button
                onClick={() => removeFood(today, it.id)}
                aria-label={`Delete ${it.name}`}
                style={{ background: "transparent", border: "none", color: colors.bad }}
              >
                <IconTrash />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Disclaimer />
    </Screen>
  );
}
