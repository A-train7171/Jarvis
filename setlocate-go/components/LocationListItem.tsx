import { Pressable, View, Text } from "react-native";
import { colors, weight } from "@/lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  distanceMeters?: number;
  points?: number;
  checkedIn?: boolean;
  onPress?: () => void;
};

function formatDistance(meters?: number): string | null {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function LocationListItem({
  title,
  subtitle,
  distanceMeters,
  points,
  checkedIn = false,
  onPress,
}: Props) {
  const distance = formatDistance(distanceMeters);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        backgroundColor: colors.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: checkedIn ? colors.accent.primary : colors.bg.surfaceElevated,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: checkedIn ? colors.bg.primary : colors.text.secondary,
            fontWeight: weight.bold,
            fontSize: 13,
          }}
        >
          {checkedIn ? "✓" : "📍"}
        </Text>
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          numberOfLines={1}
          style={{ color: colors.text.primary, fontSize: 15, fontWeight: weight.bold }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{ color: colors.text.secondary, fontSize: 13 }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={{ alignItems: "flex-end", gap: 2 }}>
        {distance ? (
          <Text style={{ color: colors.text.primary, fontSize: 13, fontWeight: weight.medium }}>
            {distance}
          </Text>
        ) : null}
        {points != null ? (
          <Text style={{ color: colors.accent.primary, fontSize: 11, fontWeight: weight.bold }}>
            +{points} pts
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
