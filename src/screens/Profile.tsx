import { useRef, useState } from "react";
import { colors, displayHeading } from "@/theme";
import { Screen } from "@/components/Screen";
import { Button, Card, Disclaimer, Field, FieldLabel, Pill, SectionTitle } from "@/components/ui";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/store/AppContext";
import { calcGoals } from "@/lib/calcGoals";
import { rankFor } from "@/lib/ranks";
import { processAvatar } from "@/lib/image";
import type { Experience, GoalMode } from "@/types";

const COLORS = ["#8B2EFF", "#5B18C9", "#B65CFF", "#7C3AED", "#3FD18B", "#FFB020"];

export function Profile({ onBack }: { onBack: () => void }) {
  const { state, set } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(state.name);
  const [contactType, setContactType] = useState(state.contact.type);
  const [contactValue, setContactValue] = useState(state.contact.value);
  const [color, setColor] = useState(state.profile.avatar.bgColor);
  const [image, setImage] = useState<string | null>(state.profile.avatar.image);

  const [weightLb, setWeightLb] = useState(state.profile.weightLb);
  const [experience, setExperience] = useState<Experience>(state.profile.experience);
  const [mode, setMode] = useState<GoalMode>(state.profile.mode);
  const [goals, setGoals] = useState(state.goals);
  const [saved, setSaved] = useState(false);

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImage(await processAvatar(file));
    } catch {
      /* ignore */
    }
  }

  function recalc() {
    setGoals(calcGoals(weightLb, experience, mode));
  }

  function save() {
    set((prev) => ({
      ...prev,
      name: name.trim(),
      contact: { type: contactType, value: contactValue.trim() },
      goals,
      profile: {
        ...prev.profile,
        weightLb: Math.round(weightLb),
        experience,
        mode,
        avatar: { bgColor: color, image },
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  const completed = state.workouts.filter((w) => w.completed).length;

  return (
    <Screen title="Profile" onBack={onBack}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <Avatar name={name} avatar={{ bgColor: color, image }} size={72} />
        <div style={{ display: "grid", gap: 8 }}>
          <Button variant="ghost" onClick={() => fileRef.current?.click()} style={{ width: "auto", padding: "8px 14px" }}>
            {image ? "Change photo" : "Upload photo"}
          </Button>
          {image && (
            <Button variant="ghost" onClick={() => setImage(null)} style={{ width: "auto", padding: "8px 14px" }}>
              Use initials
            </Button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickPhoto} />
        </div>
      </div>

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        <Stat value={rankFor(state.activeDays)} label="Rank" />
        <Stat value={`${state.streak}`} label="Streak" />
        <Stat value={`${completed}`} label="Workouts" />
      </div>

      {!image && (
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Avatar color</FieldLabel>
          <div style={{ display: "flex", gap: 10 }}>
            {COLORS.map((c) => (
              <button key={c} aria-label={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: color === c ? "3px solid #fff" : "2px solid transparent" }} />
            ))}
          </div>
        </div>
      )}

      <SectionTitle>Account</SectionTitle>
      <Card style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <FieldLabel>Contact</FieldLabel>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Pill active={contactType === "email"} onClick={() => setContactType("email")}>Email</Pill>
            <Pill active={contactType === "phone"} onClick={() => setContactType("phone")}>Phone</Pill>
          </div>
          <Field type={contactType === "email" ? "email" : "tel"} value={contactValue} onChange={(e) => setContactValue(e.target.value)} />
        </div>
      </Card>

      <SectionTitle>Goals</SectionTitle>
      <Card style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        <Field label="Bodyweight (lb)" type="number" value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value))} />
        <div>
          <FieldLabel>Experience</FieldLabel>
          <div style={{ display: "flex", gap: 8 }}>
            {(["Beginner", "Intermediate", "Advanced"] as Experience[]).map((x) => (
              <Pill key={x} active={experience === x} onClick={() => setExperience(x)}>{x}</Pill>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Mode</FieldLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["Deficit", "Maintain", "Surplus", "Bulk"] as GoalMode[]).map((m) => (
              <Pill key={m} active={mode === m} onClick={() => setMode(m)}>{m}</Pill>
            ))}
          </div>
        </div>
        <Button variant="ghost" onClick={recalc}>Re-run calculator</Button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Calories" type="number" value={goals.cal} onChange={(e) => setGoals({ ...goals, cal: Number(e.target.value) })} />
          <Field label="Protein (g)" type="number" value={goals.p} onChange={(e) => setGoals({ ...goals, p: Number(e.target.value) })} />
          <Field label="Carbs (g)" type="number" value={goals.c} onChange={(e) => setGoals({ ...goals, c: Number(e.target.value) })} />
          <Field label="Fat (g)" type="number" value={goals.f} onChange={(e) => setGoals({ ...goals, f: Number(e.target.value) })} />
          <Field label="Sugar cap (g)" type="number" value={goals.sug} onChange={(e) => setGoals({ ...goals, sug: Number(e.target.value) })} />
        </div>
      </Card>

      <Button onClick={save}>{saved ? "Saved ✓" : "Save changes"}</Button>
      <Disclaimer />
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card style={{ textAlign: "center", padding: 12 }}>
      <div style={{ ...displayHeading, fontSize: 16 }}>{value}</div>
      <div style={{ color: colors.muted, fontSize: 11 }}>{label}</div>
    </Card>
  );
}
