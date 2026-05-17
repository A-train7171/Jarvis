"use client";

import { Logo } from "./Logo";
import { usePlayer, levelFromXp } from "@/lib/store";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const xp = usePlayer((s) => s.xp);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { level } = levelFromXp(xp);

  return (
    <header className="sticky top-0 z-30 border-b border-line glass">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-2 rounded-full border border-line bg-bg-elevated/60 px-3 py-1 text-xs">
          <Zap size={13} className="text-accent" />
          <span className="font-mono tabular-nums text-ink-primary">
            {mounted ? xp.toLocaleString() : "—"} XP
          </span>
          <span className="text-ink-muted">·</span>
          <span className="text-ink-secondary">LVL {mounted ? level : "—"}</span>
        </div>
      </div>
    </header>
  );
}
