import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Badge } from "@/components";
import { colors, weight } from "@/lib/theme";
import { mockBadges } from "@/lib/mockData";

export default function Badges() {
  const router = useRouter();
  const earned = mockBadges.filter((b) => b.earned).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
        <View style={{ gap: 4 }}>
          <Text
            style={{ color: colors.text.primary, fontSize: 20, fontWeight: weight.bold }}
          >
            Badges
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
            {earned} of {mockBadges.length} earned
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {mockBadges.map((badge) => (
            <Pressable
              key={badge.id}
              onPress={() => router.push(`/badge/${badge.id}`)}
              style={({ pressed }) => ({
                width: "47%",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Badge
                name={badge.name}
                icon={badge.icon}
                earned={badge.earned}
                progress={badge.progress}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
