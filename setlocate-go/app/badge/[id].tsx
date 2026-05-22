import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card, ProgressBar, Button } from "@/components";
import { colors, weight } from "@/lib/theme";
import { mockBadges } from "@/lib/mockData";

export default function BadgeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const badge = mockBadges.find((b) => b.id === id) ?? mockBadges[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.text.secondary, fontSize: 15 }}>Close</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", gap: 16, paddingVertical: 8 }}>
          <View
            style={{
              width: 144,
              height: 144,
              borderRadius: 72,
              backgroundColor: badge.earned
                ? colors.accent.primary
                : colors.bg.surface,
              borderWidth: 3,
              borderColor: badge.earned ? colors.accent.primary : colors.border.locked,
              alignItems: "center",
              justifyContent: "center",
              opacity: badge.earned ? 1 : 0.75,
            }}
          >
            <Text style={{ fontSize: 64 }}>{badge.icon}</Text>
          </View>

          <Text
            style={{
              color: badge.earned ? colors.accent.primary : colors.text.tertiary,
              fontSize: 11,
              fontWeight: weight.bold,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            {badge.earned ? "Earned" : "Locked"}
          </Text>

          <Text
            style={{
              color: colors.text.primary,
              fontSize: 28,
              fontWeight: weight.bold,
              textAlign: "center",
            }}
          >
            {badge.name}
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 15,
              textAlign: "center",
              maxWidth: 320,
              lineHeight: 22,
            }}
          >
            {badge.description}
          </Text>
        </View>

        <Card>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 11,
              fontWeight: weight.bold,
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            HOW TO EARN IT
          </Text>
          <Text
            style={{ color: colors.text.primary, fontSize: 15, lineHeight: 22 }}
          >
            {badge.requirement}
          </Text>
          {!badge.earned && badge.progress != null ? (
            <View style={{ gap: 8, marginTop: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 11,
                    fontWeight: weight.bold,
                    letterSpacing: 0.8,
                  }}
                >
                  PROGRESS
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 11,
                    fontWeight: weight.bold,
                  }}
                >
                  {badge.progress}%
                </Text>
              </View>
              <ProgressBar value={badge.progress} />
            </View>
          ) : null}
        </Card>

        <Button fullWidth variant="secondary" onPress={() => router.back()}>
          Back to badges
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
