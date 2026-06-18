import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration. The native Android/iOS projects are generated in
 * Milestone 3 (`npx cap add android`). The web build output is `dist`.
 */
const config: CapacitorConfig = {
  appId: "io.pockettrainer.app",
  appName: "Pocket Trainer",
  webDir: "dist",
  backgroundColor: "#050505",
  android: {
    backgroundColor: "#050505",
  },
};

export default config;
