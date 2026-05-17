"use client";
import { Scene } from "@/lib/mockData";

export function ShotMatchFrame({ scene, userImage }: { scene: Scene; userImage?: string | null }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-accent-primary/40 grain">
      {userImage ? (
        <img src={userImage} alt="Your shot" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-bg-2 flex items-center justify-center">
          <div className="mono-meta text-ink-secondary">VIEWFINDER</div>
        </div>
      )}
      {/* Original still as semi-transparent overlay */}
      <img
        src={scene.imageUrl}
        alt="Original frame"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
      />
      {/* Reticle */}
      <div className="pointer-events-none absolute inset-4 border border-white/20 rounded-sm" />
      <div className="pointer-events-none absolute top-4 left-4 mono-meta text-accent-primary">
        REC ● {scene.id.toUpperCase()}
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 mono-meta text-ink-secondary">
        {scene.lat.toFixed(4)}, {scene.lng.toFixed(4)}
      </div>
    </div>
  );
}
