import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card, Stat, BannerCard, ProgressBar, Button } from "@/components";
import { colors, weight } from "@/lib/theme";
import { mockPlayer, mockBanners } from "@/lib/mockData";

export default function Profile() {
  const router = useRouter();
  const progress = (mockPlayer.points / mockPlayer.pointsToNextLevel) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
        <View style={{ alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.accent.primary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: colors.bg.primary,
            }}
          >
            <Text style={{ fontSize: 48 }}>{mockPlayer.avatar}</Text>
          </View>
          <View style={{ alignItems: "center", gap: 2 }}>
            <Text
              style={{ color: colors.text.primary, fontSize: 20, fontWeight: weight.bold }}
            >
              {mockPlayer.displayName}
            </Text>
            <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
              {mockPlayer.handle} · Level {mockPlayer.level}
            </Text>
          </View>
        </View>

        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Stat label="Spots" value={mockPlayer.spotsVisited} />
            <Stat label="Points" value={mockPlayer.points} accent />
            <Stat label="Streak" value={`${mockPlayer.streakDays}d`} />
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
                NEXT LEVEL
              </Text>
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 11,
                  fontWeight: weight.bold,
                }}
              >
                {mockPlayer.pointsToNextLevel - mockPlayer.points} pts to go
              </Text>
            </View>
            <ProgressBar value={progress} />
          </View>
        </Card>

        <View style={{ gap: 12 }}>
          <Text
            style={{ color: colors.text.primary, fontSize: 18, fontWeight: weight.bold }}
          >
            Banners
          </Text>
          {mockBanners.map((banner) => (
            <BannerCard
              key={banner.id}
              title={banner.title}
              subtitle={banner.subtitle}
              locked={banner.locked}
              levelRequired={banner.levelRequired}
            />
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <Button variant="secondary" fullWidth onPress={() => router.replace("/")}>
            Sign out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
