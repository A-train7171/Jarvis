import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card, LocationListItem } from "@/components";
import { colors, weight } from "@/lib/theme";
import { mockLocations } from "@/lib/mockData";

export default function Map() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 280,
            backgroundColor: colors.bg.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.subtle,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 40 }}>🗺️</Text>
          <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
            Map view wires up to react-native-maps
          </Text>
          <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>
            (placeholder — needs Google Maps API key)
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 4,
            }}
          >
            <Text
              style={{ color: colors.text.primary, fontSize: 18, fontWeight: weight.bold }}
            >
              On this map
            </Text>
            <Text style={{ color: colors.text.tertiary, fontSize: 13 }}>
              {mockLocations.length} spots
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
