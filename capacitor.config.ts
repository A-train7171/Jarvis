import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.setlocate.go",
  appName: "SetLocate GO",
  webDir: "out",
  backgroundColor: "#0B0F14",
  ios: {
    contentInset: "always",
    scheme: "SetLocateGO",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: false,
      backgroundColor: "#0B0F14",
      androidSplashResourceName: "splash",
      iosSpinnerStyle: "small",
      spinnerColor: "#E63946",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0B0F14",
    },
    Camera: {
      permissions: {
        camera: "SetLocate GO needs your camera to recreate the original scene frame.",
        photos: "SetLocate GO needs photo library access to attach your ShotMatch.",
      },
    },
    Geolocation: {
      permissions: {
        location: "SetLocate GO uses your location to verify you've reached the filming spot.",
      },
    },
  },
};

export default config;
