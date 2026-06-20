import { useMemo, useRef, useState } from "react";
import { colors, displayHeading, gradient } from "@/theme";
import { Button, Card, Disclaimer, Field, FieldLabel, Pill } from "@/components/ui";
import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/Logo";
import { useApp } from "@/store/AppContext";
import { calcGoals, MODE_LABELS } from "@/lib/calcGoals";
import { colorFromName, inToFtIn, kgToLb, lbToKg } from "@/lib/util";
import { processAvatar } from "@/lib/image";
import { Celebration } from "@/components/Celebration";
import type { Experience, GoalMode } from "@/types";

const STEPS = ["Profile", "About you", "Goal", "Targets"];
const AVATAR_COLORS = ["#8B2EFF", "#5B18C9", "#B65CFF", "#7C3AED", "#3FD18B", "#FFB020"];

export function Onboarding() {
  const { state, set } = useApp();
  const [step, setStep] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  // step 1
  const [name, setName] = useState(state.name);
  const [contactType, setContactType] = useState(state.contact.type);
  const [contactValue, setContactValue] = useState(state.contact.value);
  const [avatarColor, setAvatarColor] = useState(state.profile.avatar.bgColor);
  const [avatarImage, setAvatarImage] = useState<string | null>(state.profile.avatar.image);
  const [avatarErr, setAvatarErr] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // step 2
  const [weightLb, setWeightLb] = useState(state.profile.weightLb);
  const [heightIn, setHeightIn] = useState(state.profile.heightIn);
  const [experience, setExperience] = useState<Experience>(state.profile.experience);
  const [wUnit, setWUnit] = useState<"lb" | "kg">(state.units.weight);
  const [hUnit, setHUnit] = useState<"ftin" | "cm">("ftin");

  // step 3
  const [mode, setMode] = useState<GoalMode>(state.profile.mode);

  // step 4 (targets) — seeded from calc
  const computed = useMemo(
    () => calcGoals(weightLb, experience, mode),
    [weightLb, experience, mode],
  );
  const [goals, setGoals] = useState(computed);

  // keep avatar bg in sync with name unless user picked a color/photo
  const autoColor = useMemo(() => colorFromName(name || "Pocket Trainer"), [name]);
  const effectiveColor = avatarImage ? avatarColor : avatarColor || autoColor;

  const next = () => {
    if (step === 2) setGoals(computed); // refresh targets when entering step 4
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Celebrate first; commit (and enter the app) when they tap Done.
  const finish = () => setCelebrating(true);

  const commit = () => {
    set((prev) => ({
      ...prev,
      name: name.trim(),
      contact: { type: contactType, value: contactValue.trim() },
      goals,
      profile: {
        ...prev.profile,
        weightLb: Math.round(weightLb),
        heightIn: Math.round(heightIn),
        experience,
        mode,
        avatar: { bgColor: effectiveColor, image: avatarImage },
      },
      units: { ...prev.units, weight: wUnit },
      onboarded: true,
    }));
  };

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setAvatarErr(null);
    setAvatarBusy(true);
    try {
      const dataUrl = await processAvatar(file);
      setAvatarImage(dataUrl);
    } catch (err) {
      setAvatarErr(err instanceof Error ? err.message : "Couldn't read that photo.");
    } finally {
      setAvatarBusy(false);
    }
  }

  const canNext =
    step === 0
      ? name.trim().length > 0 && contactValue.trim().length > 0
      : step === 1
        ? weightLb > 0 && heightIn > 0
        : true;

  if (celebrating) {
    return (
      <Celebration
        badge={`★ Goal: ${goals.cal} kcal/day`}
        title={`Welcome, ${name.split(" ")[0] || "athlete"}!`}
        subtitle="Your plan's ready. Let's get to work."
        onDone={commit}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <div style={{ padding: "24px 20px 8px", textAlign: "center" }}>
        <Logo size={46} withWordmark />
        <p style={{ color: colors.muted, marginTop: 8, fontSize: 13 }}>Your Coach. In Your Pocket.</p>
      </div>

      {/* step indicator */}
      <div style={{ display: "flex", gap: 6, padding: "8px 20px 16px" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: i <= step ? gradient : colors.line,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: i === step ? colors.white : colors.muted,
                marginTop: 6,
                display: "block",
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px", display: "grid", gap: 16 }}>
        <h2 style={{ ...displayHeading, fontSize: 22, margin: 0 }}>{STEPS[step]}</h2>

        {step === 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar
                name={name}
                avatar={{ bgColor: effectiveColor, image: avatarImage }}
                size={72}
              />
              <div style={{ display: "grid", gap: 8 }}>
                <Button variant="ghost" onClick={() => fileRef.current?.click()} disabled={avatarBusy} style={{ width: "auto", padding: "8px 14px" }}>
                  {avatarBusy ? "Processing…" : avatarImage ? "Change photo" : "Upload photo"}
                </Button>
                {avatarImage && (
                  <Button variant="ghost" onClick={() => setAvatarImage(null)} style={{ width: "auto", padding: "8px 14px" }}>
                    Use initials
                  </Button>
                )}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickPhoto} />
              </div>
            </div>
            {avatarErr && <div style={{ color: colors.bad, fontSize: 12.5 }}>{avatarErr}</div>}

            {!avatarImage && (
              <div>
                <FieldLabel>Background color</FieldLabel>
                <div style={{ display: "flex", gap: 10 }}>
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      aria-label={`Color ${c}`}
                      onClick={() => setAvatarColor(c)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: c,
                        border: effectiveColor === c ? "3px solid #fff" : "2px solid transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <Field label="Name" value={name} placeholder="Sam Mullen" onChange={(e) => setName(e.target.value)} />

            <div>
              <FieldLabel>Contact</FieldLabel>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <Pill active={contactType === "email"} onClick={() => setContactType("email")}>
                  Email
                </Pill>
                <Pill active={contactType === "phone"} onClick={() => setContactType("phone")}>
                  Phone
                </Pill>
              </div>
              <Field
                type={contactType === "email" ? "email" : "tel"}
                value={contactValue}
                placeholder={contactType === "email" ? "sam@email.com" : "(555) 123-4567"}
                onChange={(e) => setContactValue(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FieldLabel>Bodyweight</FieldLabel>
                <div style={{ display: "flex", gap: 6 }}>
                  <Pill active={wUnit === "lb"} onClick={() => setWUnit("lb")}>lb</Pill>
                  <Pill active={wUnit === "kg"} onClick={() => setWUnit("kg")}>kg</Pill>
                </div>
              </div>
              <Field
                type="number"
                value={wUnit === "lb" ? Math.round(weightLb) : Math.round(lbToKg(weightLb))}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setWeightLb(wUnit === "lb" ? v : kgToLb(v));
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FieldLabel>Height</FieldLabel>
                <div style={{ display: "flex", gap: 6 }}>
                  <Pill active={hUnit === "ftin"} onClick={() => setHUnit("ftin")}>ft-in</Pill>
                  <Pill active={hUnit === "cm"} onClick={() => setHUnit("cm")}>cm</Pill>
                </div>
              </div>
              {hUnit === "ftin" ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <Field
                    type="number"
                    hint="feet"
                    value={inToFtIn(heightIn).ft}
                    onChange={(e) => setHeightIn(Number(e.target.value) * 12 + inToFtIn(heightIn).inch)}
                  />
                  <Field
                    type="number"
                    hint="inches"
                    value={inToFtIn(heightIn).inch}
                    onChange={(e) => setHeightIn(inToFtIn(heightIn).ft * 12 + Number(e.target.value))}
                  />
                </div>
              ) : (
                <Field
                  type="number"
                  value={Math.round(heightIn * 2.54)}
                  onChange={(e) => setHeightIn(Number(e.target.value) / 2.54)}
                />
              )}
            </div>

            <div>
              <FieldLabel>Experience</FieldLabel>
              <div style={{ display: "flex", gap: 8 }}>
                {(["Beginner", "Intermediate", "Advanced"] as Experience[]).map((x) => (
                  <Pill key={x} active={experience === x} onClick={() => setExperience(x)}>
                    {x}
                  </Pill>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: "grid", gap: 10 }}>
              {(["Deficit", "Maintain", "Surplus", "Bulk"] as GoalMode[]).map((m) => {
                const g = calcGoals(weightLb, experience, m);
                return (
                  <Card
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      borderColor: mode === m ? colors.primary : colors.line,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{m}</div>
                      <div style={{ color: colors.muted, fontSize: 12 }}>{MODE_LABELS[m]}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...displayHeading, fontSize: 18 }}>{g.cal}</div>
                      <div style={{ color: colors.muted, fontSize: 11 }}>kcal / day</div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Card style={{ background: colors.charcoal }}>
              <div style={{ fontSize: 13, color: colors.light }}>
                Live preview for <b>{mode}</b>:{" "}
                <span style={{ color: colors.glow }}>{computed.cal} kcal</span> · P{computed.p} / C
                {computed.c} / F{computed.f}
              </div>
            </Card>
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ color: colors.muted, fontSize: 13, margin: 0 }}>
              These are calculated for you. Tweak anything you like — you can edit them again later.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Calories" type="number" value={goals.cal} onChange={(e) => setGoals({ ...goals, cal: Number(e.target.value) })} />
              <Field label="Protein (g)" type="number" value={goals.p} onChange={(e) => setGoals({ ...goals, p: Number(e.target.value) })} />
              <Field label="Carbs (g)" type="number" value={goals.c} onChange={(e) => setGoals({ ...goals, c: Number(e.target.value) })} />
              <Field label="Fat (g)" type="number" value={goals.f} onChange={(e) => setGoals({ ...goals, f: Number(e.target.value) })} />
              <Field label="Sugar cap (g)" type="number" value={goals.sug} onChange={(e) => setGoals({ ...goals, sug: Number(e.target.value) })} />
            </div>
            <Disclaimer />
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, padding: "12px 20px calc(16px + env(safe-area-inset-bottom))", borderTop: `1px solid ${colors.line}` }}>
        {step > 0 && (
          <Button variant="ghost" onClick={back} style={{ flex: "0 0 38%" }}>
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button onClick={next} disabled={!canNext}>
            Continue
          </Button>
        ) : (
          <Button onClick={finish}>Start training</Button>
        )}
      </div>
    </div>
  );
}
