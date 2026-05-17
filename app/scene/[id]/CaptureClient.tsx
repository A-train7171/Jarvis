"use client";

import { useState } from "react";
import { Zap, Check } from "lucide-react";
import { usePlayer } from "@/lib/store";
import { getSceneById } from "@/lib/mockData";
import { CaptureBurst } from "@/components/CaptureBurst";

export function CaptureClient({ sceneId }: { sceneId: string }) {
  const scene = getSceneById(sceneId);
  const captured = usePlayer((s) => s.capturedIds.includes(sceneId));
  const capture = usePlayer((s) => s.capture);
  const [burst, setBurst] = useState(false);

  if (!scene) return null;

  if (captured) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
        <Check size={16} strokeWidth={3} /> Already in your collection
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (capture(scene)) setBurst(true);
        }}
        className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-hover"
      >
        <Zap size={16} /> Capture this scene · +{scene.xp} XP
      </button>
      <CaptureBurst show={burst} xp={scene.xp} onDone={() => setBurst(false)} />
    </>
  );
}
