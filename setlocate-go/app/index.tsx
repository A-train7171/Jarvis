import { View, Text, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Button } from "@/components";
import { colors, weight } from "@/lib/theme";

export default function Landing() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <View style={{ flex: 1, padding: 24, justifyContent: "space-between" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 32 }}>
          <View style={{ alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.accent.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>🎬</Text>
            </View>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 28,
                fontWeight: weight.bold,
                marginTop: 12,
              }}
            >
              SetLocate Go
            </Text>
            <Text
              style={{
                color: colors.accent.primary,
                fontSize: 13,
                fontWeight: weight.bold,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Scout the screen
            </Text>
          </View>

          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 15,
              textAlign: "center",
              lineHeight: 22,
              maxWidth: 320,
            }}
          >
            Walk the streets where your favorite films were made.{"\n"}
            Check in. Earn points. Level up your scout.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Link href="/signup" asChild>
            <Button fullWidth>Start scouting</Button>
          </Link>
          <Link href="/(tabs)/home" asChild>
            <Button variant="ghost" fullWidth>
              I already have an account
            </Button>
          </Link>
          <Link href="/preview" asChild>
            <Button variant="ghost" fullWidth>
              View component preview
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
