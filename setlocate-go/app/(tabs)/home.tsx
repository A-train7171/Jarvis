import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card, Stat, LocationListItem, ProgressBar } from "@/components";
import { colors, weight } from "@/lib/theme";
import { mockLocations, mockPlayer } from "@/lib/mockData";

export default function Home() {
  const router = useRouter();
  const progress =
    (mockPlayer.points / mockPlayer.pointsToNextLevel) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
              Welcome back,
            </Text>
            <Text
              style={{ color: colors.text.primary, fontSize: 20, fontWeight: weight.bold }}
            >
              {mockPlayer.displayName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: colors.bg.surface,
              borderRadius: 9999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}
          >
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text
              style={{
                color: colors.accent.streak,
                fontSize: 13,
                fontWeight: weight.bold,
              }}
            >
              {mockPlayer.streakDays} day streak
            </Text>
          </View>
        </View>

        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Stat label="Spots" value={mockPlayer.spotsVisited} />
            <Stat label="Level" value={mockPlayer.level} accent />
            <Stat label="Badges" value={mockPlayer.badgesEarned} />
          </View>
          <View style={{ gap: 8, marginTop: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 11,
                  fontWeight: weight.bold,
                  letterSpacing: 0.8,
                }}
              >
                LEVEL PROGRESS
              </Text>
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 11,
                  fontWeight: weight.bold,
                }}
              >
                {mockPlayer.points} / {mockPlayer.pointsToNextLevel}
              </Text>
            </View>
            <ProgressBar value={progress} />
          </View>
        </Card>

        <View style={{ gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Text
              style={{ color: colors.text.primary, fontSize: 18, fontWeight: weight.bold }}
            >
              Nearby spots
            </Text>
            <Text style={{ color: colors.text.tertiary, fontSize: 13 }}>
              within 10 km
            </Text>
          </View>

          {mockLocations.map((location) => (
            <LocationListItem
              key={location.id}
              title={location.title}
              subtitle={`${location.film} · ${location.neighborhood}`}
              distanceMeters={location.distanceMeters}
              points={location.points}
              checkedIn={location.checkedIn}
              onPress={() => router.push(`/checkin/${location.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
