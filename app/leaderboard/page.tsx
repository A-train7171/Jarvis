"use client";
import { useState } from "react";
import { weeklyLeaders } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pill } from "@/components/ui/Pill";
import { Trophy, Ticket, Film, Sparkles } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const tabs = ["Weekly", "Monthly", "All-Time"] as const;
type Tab = (typeof tabs)[number];

const prizes = [
  { tier: "Top 1", desc: "$200 streaming gift card + on-set merch pack", tone: "gold" as const, icon: Sparkles },
  { tier: "Top 5", desc: "10 free movie tickets + 3-month MUBI", tone: "primary" as const, icon: Ticket },
  { tier: "Top 25", desc: "1-month MUBI · Letterboxd Pro · Patron pin", tone: "warm" as const, icon: Film },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("Weekly");
  const podium = weeklyLeaders.slice(0, 3);
  const rest = weeklyLeaders.slice(3);

  const ringByRank: Record<number, string> = {
    1: "ring-accent-gold/70",
    2: "ring-ink-secondary/60",
    3: "ring-accent-warm/60",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="mono-meta text-ink-secondary">COMPETITION</div>
          <h1 className="cinematic-tracking text-3xl md:text-4xl font-bold mt-1">
            <em className="not-italic italic text-accent-primary">Leaderboard</em>
          </h1>
          <p className="text-ink-secondary mt-2 italic">Reset every Monday at 00:00 UTC.</p>
        </div>
        <div className="flex gap-1 rounded-full p-1 bg-bg-1 border border-divider">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "mono-meta px-3.5 py-1.5 rounded-full transition-colors",
                t === tab ? "bg-accent-primary text-white" : "text-ink-secondary hover:text-ink-primary"
              )}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Podium */}
          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            {podium.map((p) => (
              <Card key={p.rank} className={cn("p-5 text-center relative", p.rank === 1 && "sm:order-2 sm:scale-[1.04]", p.rank === 2 && "sm:order-1", p.rank === 3 && "sm:order-3")}>
                <div className="mono-meta text-ink-secondary mb-3">RANK {p.rank}</div>
                <div className={cn("mx-auto h-16 w-16 rounded-full bg-bg-2 ring-4 flex items-center justify-center mb-2 cinematic-tracking text-lg font-semibold", ringByRank[p.rank])}>
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-[15px] font-semibold">{p.name}</div>
                <div className="mono-meta text-ink-secondary mt-0.5">{p.country}</div>
                <div className="mt-3 cinematic-tracking text-2xl font-bold tabular-nums">
                  {formatNumber(p.points)}
                </div>
                <div className="mono-meta text-ink-secondary mt-1">{p.scenes} SCENES</div>
                {p.rank === 1 && (
                  <Trophy className="absolute top-3 right-3 text-accent-gold" size={18} />
                )}
              </Card>
            ))}
          </div>

          {/* Mobile prizes summary */}
          <div className="lg:hidden mb-3">
            <Pill className="w-full justify-center">
              <Sparkles size={13} className="text-accent-gold" />
              <span className="mono-meta">$4,200 IN PRIZES · TOP 25 WIN</span>
            </Pill>
          </div>

          {/* Rest of list */}
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_70px_90px] md:grid-cols-[60px_1fr_100px_120px] gap-3 px-4 py-2.5 border-b border-divider mono-meta text-ink-secondary">
              <span>#</span>
              <span>PLAYER</span>
              <span className="text-right">SCENES</span>
              <span className="text-right">POINTS</span>
            </div>
            {rest.map((p) => (
              <div
                key={p.rank}
                className="grid grid-cols-[40px_1fr_70px_90px] md:grid-cols-[60px_1fr_100px_120px] gap-3 px-4 py-3 border-b border-divider/50 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <span className="mono-meta text-ink-secondary">{p.rank}</span>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="h-7 w-7 rounded-full bg-bg-2 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">{p.name}</div>
                    <div className="mono-meta text-ink-secondary">{p.country}</div>
                  </div>
                </div>
                <span className="text-right tabular-nums text-[14px] self-center">{p.scenes}</span>
                <span className="text-right tabular-nums cinematic-tracking font-semibold self-center">{formatNumber(p.points)}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Prizes rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Card className="p-5 grain relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-gold/10 pointer-events-none" />
              <div className="relative">
                <div className="mono-meta text-ink-secondary mb-1">THIS WEEK</div>
                <div className="cinematic-tracking text-xl font-semibold mb-4">
                  Prizes worth <em className="not-italic italic text-accent-gold">$4,200</em>
                </div>
                <div className="space-y-3">
                  {prizes.map(({ tier, desc, tone, icon: Icon }) => (
                    <div key={tier} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Badge tone={tone}>{tier}</Badge>
                      </div>
                      <div className="flex-1 text-[13px] text-ink-secondary leading-snug flex items-start gap-2">
                        <Icon size={14} className="mt-0.5 flex-shrink-0 text-ink-primary" />
                        <span>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mono-meta text-ink-secondary mt-5 italic">
                  REWARDS PAID IN PARTNERSHIP WITH MUBI, LETTERBOXD &amp; ATLAS OBSCURA.
                </div>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
