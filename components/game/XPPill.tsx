"use client";
import { usePlayer } from "@/lib/store";
import { Flame, Film } from "lucide-react";
import { Pill } from "@/components/ui/Pill";

export function XPPill() {
  const { player } = usePlayer();
  const pct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));
  return (
    <div className="flex items-center gap-2">
      <Pill className="!h-9 !pl-2 !pr-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-[10px] font-bold text-white">
          {player.level}
        </span>
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-accent-primary" style={{ width: `${pct}%` }} />
        </div>
        <span className="mono-meta text-ink-secondary">L{player.level}</span>
      </Pill>
      <Pill className="!h-9">
        <Flame size={13} className="text-accent-warm" />
        <span className="mono-meta">{player.streakDays}D</span>
      </Pill>
      <Pill className="!h-9">
        <Film size={13} className="text-accent-cool" />
        <span className="mono-meta">{player.reels}</span>
      </Pill>
    </div>
  );
}
