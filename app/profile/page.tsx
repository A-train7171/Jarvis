"use client";

import { useEffect, useState } from "react";
import { usePlayer, levelFromXp } from "@/lib/store";
import { scenes } from "@/lib/mockData";
import { Zap, MapPin, Trophy, RotateCcw, Globe2, type LucideIcon } from "lucide-react";
import type { Rarity } from "@/types";

const rarityOrder: Rarity[] = ["common", "rare", "epic", "legendary"];

export default function ProfilePage() {
  const xp = usePlayer((s) => s.xp);
  const capturedIds = usePlayer((s) => s.capturedIds);
  const reset = usePlayer((s) => s.reset);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { level, next, progress } = levelFromXp(xp);
  const captured = scenes.filter((s) => capturedIds.includes(s.id));

  const byRarity = rarityOrder.map((r) => ({
    rarity: r,
    have: captured.filter((s) => s.rarity === r).length,
    total: scenes.filter((s) => s.rarity === r).length,
  }));

  const countries = new Set(captured.map((s) => s.country)).size;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-6">
      <section className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
        <div className="relative p-6 sm:p-8">
          <div
            aria-hidden
            className="absolute inset-0 -z-0"
            style={{
              background:
                "radial-gradient(400px 200px at 90% 0%, rgba(255,77,46,0.18), transparent 60%)",
            }}
          />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-bg-surface text-2xl">
              <Trophy className="text-accent" size={24} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">
                Location Scout
              </div>
              <div className="mt-0.5 text-xl font-semibold">Guest Explorer</div>
              <div className="font-mono text-xs text-ink-secondary">
                LVL {mounted ? level : "—"} · {mounted ? xp.toLocaleString() : "—"} XP
              </div>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-muted">
              <span>Progress to LVL {mounted ? level + 1 : "—"}</span>
              <span className="font-mono text-ink-secondary">
                {mounted ? Math.round(progress * next) : 0} / {mounted ? next : 0}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg-base">
              <div
                className="h-full bg-accent transition-all duration-700"
                style={{ width: `${(mounted ? progress : 0) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-line">
          <Stat
            icon={Zap}
            label="Total XP"
            value={mounted ? xp.toLocaleString() : "—"}
          />
          <Stat
            icon={MapPin}
            label="Captures"
            value={mounted ? `${captured.length}` : "—"}
          />
          <Stat
            icon={Globe2}
            label="Countries"
            value={mounted ? `${countries}` : "—"}
            last
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-ink-muted">
          Rarity breakdown
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {byRarity.map((row) => {
            const pct =
              row.total === 0 ? 0 : Math.round((row.have / row.total) * 100);
            return (
              <div
                key={row.rarity}
                className="rounded-md border border-line bg-bg-elevated p-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: `var(--rarity-${row.rarity})` }}
                  >
                    {row.rarity}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-ink-secondary">
                    {mounted ? row.have : 0} / {row.total}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-bg-base">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${mounted ? pct : 0}%`,
                      background: `var(--rarity-${row.rarity})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-md border border-line bg-bg-elevated p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Reset progress</div>
            <div className="text-xs text-ink-muted">
              Wipes captures and XP from this device.
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset all progress?")) reset();
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-ink-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  last,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-1 py-5 " +
        (last ? "" : "border-r border-line")
      }
    >
      <Icon size={14} className="text-accent" />
      <div className="font-mono text-lg tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-ink-muted">
        {label}
      </div>
    </div>
  );
}
