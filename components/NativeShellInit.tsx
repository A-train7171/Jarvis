"use client";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Mount once at the root. Configures the native status bar and hides the
 * splash screen after first paint. Safe no-op on the web.
 */
export function NativeShellInit() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#0B0F14" });
      } catch { /* status bar plugin missing */ }
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        if (!cancelled) await SplashScreen.hide({ fadeOutDuration: 240 });
      } catch { /* splash plugin missing */ }
    })();
    return () => { cancelled = true; };
  }, []);
  return null;
}
