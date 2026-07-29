"use client";

import { useEffect, useState } from "react";
import { usePT } from "./store";

/** True once the persisted Zustand store has rehydrated on the client. */
export function useHydrated(): boolean {
  const hydrated = usePT((s) => s.hydrated);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    // If persist finished before mount, hydrated flag may already be set.
    if (usePT.persist.hasHydrated()) usePT.setState({ hydrated: true });
  }, []);
  return ready && hydrated;
}
