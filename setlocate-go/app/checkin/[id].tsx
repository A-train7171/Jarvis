import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Button, Card } from "@/components";
import { colors, weight } from "@/lib/theme";
import { mockLocations } from "@/lib/mockData";

export default function CheckIn() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const location = mockLocations.find((l) => l.id === id) ?? mockLocations[0];
  const [checkedIn, setCheckedIn] = useState(location.checkedIn);

  const handleCheckIn = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCheckedIn(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.text.secondary, fontSize: 15 }}>Close</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", gap: 16, paddingVertical: 8 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: checkedIn ? colors.accent.primary : colors.bg.surface,
              borderWidth: 2,
              borderColor: checkedIn ? colors.accent.primary : colors.border.subtle,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 40 }}>{checkedIn ? "✓" : "📍"}</Text>
          </View>
          <Text
            style={{
              color: colors.accent.primary,
              fontSize: 11,
              fontWeight: weight.bold,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            {checkedIn ? "Checked in" : "You're nearby"}
          </Text>
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 28,
                fontWeight: weight.bold,
                textAlign: "center",
              }}
            >
              {location.title}
            </Text>
            <Text style={{ color: colors.text.secondary, fontSize: 15 }}>
              {location.film} · {location.neighborhood}
            </Text>
          </View>
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
            THE SCENE
          </Text>
          <Text
            style={{ color: colors.text.primary, fontSize: 15, lineHeight: 22 }}
          >
            {location.scene}
          </Text>
        </Card>

        <Card elevated>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 11,
                  fontWeight: weight.bold,
                  letterSpacing: 0.8,
                }}
              >
                REWARD
              </Text>
              <Text
                style={{
                  color: colors.accent.primary,
                  fontSize: 28,
                  fontWeight: weight.bold,
                }}
              >
                +{location.points} pts
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.bg.surface,
                borderRadius: 9999,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: 13,
                  fontWeight: weight.bold,
                }}
              >
                {location.distanceMeters} m away
              </Text>
            </View>
          </View>
        </Card>

        <View style={{ gap: 8, marginTop: 8 }}>
          {checkedIn ? (
            <Button fullWidth onPress={() => router.back()}>
              Back to map
            </Button>
          ) : (
            <Button fullWidth onPress={handleCheckIn}>
              Check in
            </Button>
          )}
          <Button variant="ghost" fullWidth onPress={() => router.back()}>
            Not yet
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
