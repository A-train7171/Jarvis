import { View, Text } from "react-native";
import { colors, weight } from "@/lib/theme";
import { ProgressBar } from "./ProgressBar";

type Props = {
  name: string;
  icon: string;
  earned: boolean;
  progress?: number;
};

export function Badge({ name, icon, earned, progress }: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: earned ? colors.accent.primary : colors.border.locked,
        padding: 16,
        alignItems: "center",
        gap: 8,
        opacity: earned ? 1 : 0.7,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: earned ? colors.accent.primary : colors.bg.surfaceElevated,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 28 }}>{icon}</Text>
      </View>

      <Text
        numberOfLines={2}
        style={{
          color: earned ? colors.text.primary : colors.text.tertiary,
          fontSize: 13,
          fontWeight: weight.bold,
          textAlign: "center",
        }}
      >
        {name}
      </Text>

      {!earned && progress != null ? (
        <View style={{ alignSelf: "stretch", marginTop: 4 }}>
          <ProgressBar value={progress} />
        </View>
      ) : null}
    </View>
  );
}
