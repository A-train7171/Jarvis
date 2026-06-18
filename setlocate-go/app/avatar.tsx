import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components";
import { colors, weight } from "@/lib/theme";
import { avatarOptions } from "@/lib/mockData";

export default function AvatarPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState(avatarOptions[0]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <View style={{ flex: 1, padding: 24, gap: 24 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.text.secondary, fontSize: 15 }}>← Back</Text>
        </Pressable>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: weight.bold }}>
            Pick your avatar
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 15 }}>
            You can swap it out later. More unlock as you level up.
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
          }}
        >
          <View
            style={{
              width: 128,
              height: 128,
              borderRadius: 64,
              backgroundColor: colors.accent.primary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 4,
              borderColor: colors.bg.primary,
            }}
          >
            <Text style={{ fontSize: 64 }}>{selected}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            {avatarOptions.map((option) => {
              const isActive = option === selected;
              return (
                <Pressable
                  key={option}
                  onPress={() => setSelected(option)}
                  style={({ pressed }) => ({
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: isActive
                      ? colors.accent.primary
                      : colors.bg.surface,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: isActive ? colors.accent.primary : colors.border.subtle,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ fontSize: 32 }}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ gap: 8 }}>
          <Button fullWidth onPress={() => router.replace("/(tabs)/home")}>
            Looks good
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
