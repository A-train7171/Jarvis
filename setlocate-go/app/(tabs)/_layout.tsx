import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { colors, weight } from "@/lib/theme";

type IconProps = { focused: boolean; glyph: string };

function TabIcon({ focused, glyph }: IconProps) {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        opacity: focused ? 1 : 0.55,
      }}
    >
      <Text style={{ fontSize: 22 }}>{glyph}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.surface,
          borderTopColor: colors.border.subtle,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: weight.bold, letterSpacing: 0.6 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="🎯" />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "MAP",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="🗺️" />,
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: "BADGES",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="🏆" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="👤" />,
        }}
      />
    </Tabs>
  );
}
