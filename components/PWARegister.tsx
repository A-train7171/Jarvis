"use client";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export function PWARegister() {
  useEffect(() => {
    // Inside Capacitor we don't need a service worker — the app is bundled natively.
    if (Capacitor.isNativePlatform()) return;
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
