import Link from "next/link";
import type { Scene } from "@/types";
import { RarityBadge } from "./RarityBadge";
import { MapPin, Zap, Check } from "lucide-react";

export function SceneCard({
  scene,
  captured,
}: {
  scene: Scene;
  captured?: boolean;
}) {
  return (
    <Link
      href={`/scene/${scene.id}`}
      className="group relative block overflow-hidden rounded-lg border border-line bg-bg-elevated transition-all hover:border-accent/40 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scene.imageUrl}
          alt={scene.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent" />
        <div className="absolute left-2 top-2">
          <RarityBadge rarity={scene.rarity} />
        </div>
        {captured && (
          <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-bg-base">
            <Check size={10} strokeWidth={3} /> Captured
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-semibold text-ink-primary">
          {scene.title}
        </div>
        <div className="mt-0.5 truncate text-xs text-ink-secondary">
          {scene.movie} · {scene.year}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} /> {scene.city}
          </span>
          <span className="inline-flex items-center gap-1 text-accent">
            <Zap size={11} /> {scene.xp} XP
          </span>
        </div>
      </div>
    </Link>
  );
}
