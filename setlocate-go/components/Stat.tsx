import { View, Text } from "react-native";
import { colors, weight } from "@/lib/theme";

type Props = {
  label: string;
  value: string | number;
  accent?: boolean;
};

export function Stat({ label, value, accent = false }: Props) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Text
        style={{
          color: accent ? colors.accent.primary : colors.text.primary,
          fontSize: 28,
          fontWeight: weight.bold,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 11,
          fontWeight: weight.medium,
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
