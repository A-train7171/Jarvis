/**
 * Persistence layer.
 *
 * Replaces the prototype's `window.storage` key/value shim with Capacitor
 * Preferences. Capacitor Preferences works on native (Android/iOS) and falls
 * back to localStorage on the web, so the same API works everywhere. We wrap it
 * defensively so the app still runs if the plugin is unavailable (e.g. SSR or a
 * locked-down web environment).
 */

import { Preferences } from "@capacitor/preferences";

async function getRaw(key: string): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
}

async function setRaw(key: string, value: string): Promise<void> {
  try {
    await Preferences.set({ key, value });
  } catch {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      /* ignore — non-persistent fallback */
    }
  }
}

async function removeRaw(key: string): Promise<void> {
  try {
    await Preferences.remove({ key });
  } catch {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

export const storage = {
  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await getRaw(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  async setJSON<T>(key: string, value: T): Promise<void> {
    await setRaw(key, JSON.stringify(value));
  },
  remove: removeRaw,
};
