import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Stat,
  LocationListItem,
  Badge,
  BannerCard,
  ProgressBar,
} from "@/components";
import { colors, weight } from "@/lib/theme";

export default function ComponentPreview() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 28,
              fontWeight: weight.bold,
            }}
          >
            SetLocate Go
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 4 }}>
            Component preview — screens land once Section 7 arrives.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Button onPress={() => {}}>Check in</Button>
          <Button variant="secondary" onPress={() => {}}>
            View on map
          </Button>
          <Button variant="ghost" onPress={() => {}}>
            Skip for now
          </Button>
        </View>

        <Card>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Stat label="Spots" value={12} />
            <Stat label="Level" value={4} accent />
            <Stat label="Streak" value="7d" />
          </View>
        </Card>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text.secondary, fontSize: 11, letterSpacing: 0.8 }}>
            LEVEL PROGRESS
          </Text>
          <ProgressBar value={62} />
        </View>

        <View style={{ gap: 12 }}>
          <LocationListItem
            title="Griffith Observatory"
            subtitle="La La Land · Rebel Without a Cause"
            distanceMeters={420}
            points={50}
          />
          <LocationListItem
            title="Bradbury Building"
            subtitle="Blade Runner"
            distanceMeters={1800}
            points={75}
            checkedIn
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Badge name="First Spot" icon="🎬" earned />
          </View>
          <View style={{ flex: 1 }}>
            <Badge name="Noir Nights" icon="🕵️" earned={false} progress={40} />
          </View>
        </View>

        <BannerCard
          title="Director's Cut"
          subtitle="Signature banner for verified set detectives."
        />
        <BannerCard
          title="Golden Hour"
          subtitle="Unlock at level 10."
          locked
          levelRequired={10}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
