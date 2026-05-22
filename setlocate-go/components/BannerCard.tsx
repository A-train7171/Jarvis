import { View, Text } from "react-native";
import { colors, weight } from "@/lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  locked?: boolean;
  levelRequired?: number;
};

export function BannerCard({ title, subtitle, locked = false, levelRequired }: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: locked ? colors.border.locked : colors.accent.primary,
        padding: 20,
        opacity: locked ? 0.65 : 1,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text
          style={{
            color: locked ? colors.text.tertiary : colors.text.primary,
            fontSize: 18,
            fontWeight: weight.bold,
          }}
        >
          {title}
        </Text>
        {locked && levelRequired != null ? (
          <View
            style={{
              backgroundColor: colors.bg.surfaceElevated,
              borderRadius: 9999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 11,
                fontWeight: weight.bold,
                letterSpacing: 0.6,
                textTransform: "uppercase",
              }}
            >
              LVL {levelRequired}
            </Text>
          </View>
        ) : null}
      </View>
      {subtitle ? (
        <Text style={{ color: colors.text.secondary, fontSize: 13 }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}
