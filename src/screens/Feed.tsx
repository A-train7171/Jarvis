import { colors } from "@/theme";
import { Screen } from "@/components/Screen";
import { Card, EmptyState } from "@/components/ui";
import { Avatar } from "@/components/Avatar";
import { IconFeed, IconFlame, IconCheck } from "@/components/icons";
import { useApp } from "@/store/AppContext";

export function Feed({ onBack }: { onBack: () => void }) {
  const { state } = useApp();

  return (
    <Screen title="Feed" onBack={onBack}>
      {state.posts.length === 0 ? (
        <EmptyState
          icon={<IconFeed />}
          title="Nothing here yet"
          body="Complete workouts and rank up to fill your feed."
        />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {state.posts.map((p) => (
            <Card key={p.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar name={state.name} avatar={state.profile.avatar} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{p.text}</div>
                <div style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                  {new Date(p.ts).toLocaleString()}
                </div>
              </div>
              <span style={{ color: p.type === "rankup" ? colors.warn : colors.good }}>
                {p.type === "rankup" ? <IconFlame size={20} /> : <IconCheck size={18} />}
              </span>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}
