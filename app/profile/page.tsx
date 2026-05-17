"use client";
import { useState } from "react";
import { usePlayer } from "@/lib/store";
import { scenes, TIER_META, Tier } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { RarityBadge } from "@/components/scene/RarityBadge";
import { Button } from "@/components/ui/Button";
import { Camera, Flame, MapPin, Globe2 } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const tierFilters: ("all" | Tier)[] = ["all", "background", "featured", "iconic", "landmark", "legendary"];

export default function ProfilePage() {
  const { player, reset } = usePlayer();
  const [filter, setFilter] = useState<(typeof tierFilters)[number]>("all");

  const captured = scenes.filter((s) => player.capturedSceneIds.includes(s.id));
  const filtered = filter === "all" ? captured : captured.filter((s) => s.tier === filter);
  const countries = new Set(captured.map((s) => s.country)).size;
  const totalPoints = captured.reduce((sum, s) => sum + s.points, 0);
  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));

  const stats = [
    { label: "SCENES", value: formatNumber(captured.length), icon: Camera, color: "var(--accent-primary)" },
    { label: "POINTS", value: formatNumber(totalPoints || player.xp), icon: Flame, color: "var(--accent-warm)" },
    { label: "STREAK", value: `${player.streakDays}d`, icon: MapPin, color: "var(--accent-cool)" },
    { label: "COUNTRIES", value: formatNumber(countries), icon: Globe2, color: "var(--accent-gold)" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      {/* Header */}
      <Card className="p-6 md:p-7 grain relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/12 via-transparent to-accent-cool/10" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-bg-2 ring-4 ring-accent-primary/40 flex items-center justify-center cinematic-tracking text-xl font-semibold flex-shrink-0">
            {player.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="mono-meta text-ink-secondary">PROFILE</div>
            <h1 className="cinematic-tracking text-2xl md:text-3xl font-bold mt-0.5 italic not-italic">
              <em className="italic not-italic">@</em><em className="italic">{player.username}</em>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Pill>
                <span className="h-4 w-4 rounded-full bg-accent-primary text-[10px] font-bold text-white flex items-center justify-center">{player.level}</span>
                <span className="mono-meta">LEVEL {player.level}</span>
              </Pill>
              <Pill><Flame size={12} className="text-accent-warm" /><span className="mono-meta">{player.streakDays}-DAY STREAK</span></Pill>
              <Pill><span className="mono-meta">{player.reels} REELS</span></Pill>
            </div>
            <div className="mt-4 max-w-md">
              <div className="flex justify-between mono-meta text-ink-secondary mb-1.5">
                <span>XP TO L{player.level + 1}</span>
                <span>{formatNumber(player.xp)} / {formatNumber(player.xpToNext)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-warm" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>Reset progress</Button>
        </div>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="mono-meta text-ink-secondary">{label}</div>
              <Icon size={14} style={{ color }} />
            </div>
            <div className="cinematic-tracking text-2xl font-bold tabular-nums">{value}</div>
          </Card>
        ))}
      </div>

      {/* Scene Journal */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="mono-meta text-ink-secondary">SCENE JOURNAL</div>
          <h2 className="cinematic-tracking text-xl font-semibold mt-0.5">Your captures</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {tierFilters.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "mono-meta rounded-full px-3 py-1.5 border transition-colors",
              filter === t
                ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                : "border-divider text-ink-secondary hover:text-ink-primary hover:border-ink-secondary"
            )}
          >
            {t === "all" ? "ALL" : TIER_META[t].label.toUpperCase()}
          </button>
        ))}
      </div>

      {captured.length === 0 ? (
        <Card className="p-10 text-center grain relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-2/50 to-transparent" />
          <div className="relative">
            <div className="mono-meta text-ink-secondary mb-2">NO SCENES CAPTURED YET</div>
            <p className="cinematic-tracking text-2xl font-semibold mb-1">
              <em className="not-italic italic">Head to the map</em>
            </p>
            <p className="text-ink-secondary italic mb-5">Every iconic frame is waiting in a real-world coordinate.</p>
            <a href="/map"><Button>Open the map</Button></a>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s, i) => (
            <PolaroidScene key={s.id} scene={s} rotate={(i % 2 === 0 ? -1.4 : 1.6)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PolaroidScene({ scene, rotate }: { scene: typeof scenes[number]; rotate: number }) {
  const meta = TIER_META[scene.tier];
  return (
    <div className="bg-bg-1 rounded-card overflow-hidden p-2 hover:scale-[1.02] transition-transform" style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="relative aspect-[4/5]">
        <div className="absolute inset-0 bg-cover bg-center rounded-sm" style={{ backgroundImage: `url(${scene.imageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-sm" />
        {/* ShotMatch inset */}
        <div className="absolute bottom-2 right-2 h-12 w-16 rounded-sm border-2 border-white shadow-lg bg-cover bg-center" style={{ backgroundImage: `url(${scene.imageUrl})`, filter: "saturate(0.6) contrast(1.05)" }} />
        <div className="absolute top-2 left-2"><RarityBadge tier={scene.tier} /></div>
      </div>
      <div className="px-1 pt-2 pb-1">
        <div className="cinematic-tracking text-[13px] font-semibold truncate">
          <em className="not-italic italic" style={{ color: meta.color }}>{scene.filmTitle}</em>
        </div>
        <div className="mono-meta text-ink-secondary truncate">{scene.city.toUpperCase()}</div>
      </div>
    </div>
  );
}
