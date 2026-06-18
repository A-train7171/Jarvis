import { Pressable, Text, ActivityIndicator, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, weight } from "@/lib/theme";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
};

const surfaces: Record<Variant, { bg: string; border: string; text: string }> = {
  primary: {
    bg: colors.accent.primary,
    border: colors.accent.primary,
    text: colors.bg.primary,
  },
  secondary: {
    bg: "transparent",
    border: colors.accent.primary,
    text: colors.accent.primary,
  },
  ghost: {
    bg: "transparent",
    border: "transparent",
    text: colors.text.primary,
  },
};

export function Button({
  onPress,
  variant = "primary",
  disabled,
  loading,
  fullWidth,
  children,
}: Props) {
  const palette = surfaces[variant];
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isInactive}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={({ pressed }) => ({
        opacity: isInactive ? 0.4 : pressed ? 0.85 : 1,
        backgroundColor: palette.bg,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: fullWidth ? "stretch" : "flex-start",
      })}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View>
          <Text
            style={{
              color: palette.text,
              fontSize: 15,
              fontWeight: weight.bold,
              letterSpacing: 0.2,
            }}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
