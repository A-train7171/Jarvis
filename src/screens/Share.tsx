import { useEffect, useMemo, useState } from "react";
import { colors } from "@/theme";
import { Screen } from "@/components/Screen";
import { Button, Card, Pill, Spinner } from "@/components/ui";
import { useApp } from "@/store/AppContext";
import { rankFor } from "@/lib/ranks";
import { totalMacros } from "@/lib/nutrition";
import { todayISO } from "@/lib/util";
import { renderShareCard, type ShareData, type ShareFormat, type ShareKind } from "@/lib/shareCard";
import { shareImage } from "@/lib/share";

const KINDS: { kind: ShareKind; label: string }[] = [
  { kind: "profile", label: "Profile" },
  { kind: "rankup", label: "Rank" },
  { kind: "streak", label: "Streak" },
  { kind: "workout", label: "Workout" },
  { kind: "nutrition", label: "Nutrition" },
];

export function Share({ onBack, seed }: { onBack: () => void; seed?: ShareKind | null }) {
  const { state } = useApp();
  const [kind, setKind] = useState<ShareKind>(seed ?? "profile");
  const [format, setFormat] = useState<ShareFormat>("square");
  const [img, setImg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const data = useMemo<ShareData>(() => {
    const lastWorkout = state.workouts.find((w) => w.completed);
    const macros = totalMacros(state.food[todayISO()]);
    return {
      kind,
      name: state.name,
      avatar: state.profile.avatar,
      rank: rankFor(state.activeDays),
      activeDays: state.activeDays,
      streak: state.streak,
      workouts: state.workouts.filter((w) => w.completed).length,
      workoutName: lastWorkout?.name,
      workoutItems: lastWorkout?.exercises.length,
      cal: Math.round(macros.calories),
      calGoal: state.goals.cal,
      protein: Math.round(macros.protein),
    };
  }, [state, kind]);

  // re-render the banner whenever the variant/format/data changes
  useEffect(() => {
    let cancelled = false;
    setImg(null);
    renderShareCard(data, format)
      .then((url) => !cancelled && setImg(url))
      .catch(() => !cancelled && setImg(null));
    return () => {
      cancelled = true;
    };
  }, [data, format]);

  async function onShare() {
    if (!img) return;
    setBusy(true);
    setNote(null);
    try {
      const result = await shareImage(img, `pocket-trainer-${kind}.png`, captionFor(data.name));
      setNote(result === "downloaded" ? "Saved to your device — share it anywhere." : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen title="Share a banner" onBack={onBack}>
      <p style={{ color: colors.muted, fontSize: 13, margin: "0 0 14px" }}>
        Make a card to screenshot or share. Pick a moment, then share or save it.
      </p>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
        {KINDS.map((k) => (
          <Pill key={k.kind} active={kind === k.kind} onClick={() => setKind(k.kind)}>
            {k.label}
          </Pill>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Pill active={format === "square"} onClick={() => setFormat("square")}>
          Square (1:1)
        </Pill>
        <Pill active={format === "story"} onClick={() => setFormat("story")}>
          Story (9:16)
        </Pill>
      </div>

      <Card
        style={{
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.charcoal,
          minHeight: 240,
        }}
      >
        {img ? (
          <img
            src={img}
            alt={`${kind} share banner`}
            style={{
              width: "100%",
              maxWidth: format === "story" ? 260 : 360,
              borderRadius: 12,
              display: "block",
            }}
          />
        ) : (
          <Spinner size={26} />
        )}
      </Card>

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <Button onClick={onShare} disabled={!img || busy}>
          {busy ? <Spinner /> : "Share / save image"}
        </Button>
        <p style={{ color: colors.muted, fontSize: 12, textAlign: "center", margin: 0 }}>
          {note ?? "Tip: you can also just screenshot this card."}
        </p>
      </div>
    </Screen>
  );
}

function captionFor(name: string): string {
  return `${name || "I'm"} training with Pocket Trainer — Your Coach. In Your Pocket. 💪`;
}
