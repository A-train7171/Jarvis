import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components";
import { colors, weight } from "@/lib/theme";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const canContinue = name.trim().length >= 2 && email.includes("@");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, padding: 24, gap: 24 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.text.secondary, fontSize: 15 }}>← Back</Text>
          </Pressable>

          <View style={{ gap: 8 }}>
            <Text
              style={{ color: colors.text.primary, fontSize: 28, fontWeight: weight.bold }}
            >
              Join the scouts
            </Text>
            <Text style={{ color: colors.text.secondary, fontSize: 15 }}>
              Create your scout profile to start checking in.
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <FieldLabel>Scout name</FieldLabel>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="What should we call you?"
              placeholderTextColor={colors.text.tertiary}
              style={inputStyle}
              autoCapitalize="words"
            />

            <FieldLabel>Email</FieldLabel>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@scout.film"
              placeholderTextColor={colors.text.tertiary}
              style={inputStyle}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ gap: 8 }}>
            <Button
              fullWidth
              disabled={!canContinue}
              onPress={() => router.push("/avatar")}
            >
              Continue
            </Button>
            <Text
              style={{
                color: colors.text.tertiary,
                fontSize: 11,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              By continuing you agree to the scout's code.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: weight.bold,
        letterSpacing: 0.8,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Text>
  );
}

const inputStyle = {
  backgroundColor: colors.bg.surface,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.border.subtle,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: colors.text.primary,
  fontSize: 15,
};
