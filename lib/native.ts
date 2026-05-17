"use client";
/**
 * Native bridge — uses Capacitor plugins when running inside iOS/Android,
 * gracefully falls back to web APIs (or stubs) when running in a browser.
 *
 * Every export is safe to call from anywhere; nothing throws if a platform
 * doesn't support a given capability.
 */
import { Capacitor } from "@capacitor/core";

export const isNative = () => typeof window !== "undefined" && Capacitor?.isNativePlatform?.();
export const platform = () => (typeof window === "undefined" ? "web" : Capacitor?.getPlatform?.() ?? "web");

export async function getPosition(): Promise<{ lat: number; lng: number } | null> {
  try {
    if (isNative()) {
      const { Geolocation } = await import("@capacitor/geolocation");
      const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      return { lat: p.coords.latitude, lng: p.coords.longitude };
    }
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      return await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });
    }
  } catch { /* fall through */ }
  return null;
}

export async function takePhoto(): Promise<string | null> {
  try {
    if (isNative()) {
      const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        correctOrientation: true,
      });
      return photo.dataUrl ?? null;
    }
  } catch { /* fall through to file input */ }
  return null;
}

export async function shareResult(opts: { title: string; text: string; url?: string }) {
  try {
    if (isNative()) {
      const { Share } = await import("@capacitor/share");
      await Share.share(opts);
      return true;
    }
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share(opts);
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${opts.title}\n${opts.text}\n${opts.url ?? ""}`.trim());
      return "copied" as const;
    }
  } catch { /* swallow */ }
  return false;
}

type Impact = "light" | "medium" | "heavy";
export async function haptic(style: Impact = "light") {
  try {
    if (isNative()) {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      const map: Record<Impact, "Light" | "Medium" | "Heavy"> = { light: "Light", medium: "Medium", heavy: "Heavy" };
      await Haptics.impact({ style: ImpactStyle[map[style]] });
      return;
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(style === "heavy" ? 30 : style === "medium" ? 18 : 8);
    }
  } catch { /* ignore */ }
}

export async function notify() {
  try {
    if (isNative()) {
      const { Haptics, NotificationType } = await import("@capacitor/haptics");
      await Haptics.notification({ type: NotificationType.Success });
      return;
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([12, 40, 24]);
    }
  } catch { /* ignore */ }
}

// Haversine, km
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
