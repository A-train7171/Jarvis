import { View } from "react-native";
import { colors } from "@/lib/theme";

type Props = {
  value: number;
  height?: number;
};

export function ProgressBar({ value, height = 6 }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityRole="progressbar"
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: colors.bg.surfaceElevated,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          backgroundColor: colors.accent.primary,
        }}
      />
    </View>
  );
}
