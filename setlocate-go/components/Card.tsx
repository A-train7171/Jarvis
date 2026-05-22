import { View, ViewProps } from "react-native";
import { colors } from "@/lib/theme";

type Props = ViewProps & {
  padded?: boolean;
  elevated?: boolean;
};

export function Card({ style, padded = true, elevated = false, children, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: elevated ? colors.bg.surfaceElevated : colors.bg.surface,
          borderRadius: 16,
          padding: padded ? 20 : 0,
          borderWidth: 1,
          borderColor: colors.border.subtle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
