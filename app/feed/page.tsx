"use client";

import { Heart, Trophy, Flame, Users } from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { PageHeader } from "@/components/PageHeader";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const hydrated = useHydrated();
  const feed = usePT((s) => s.feed);
  const toggleKudos = usePT((s) => s.toggleKudos);
  const streak = usePT((s) => s.streak);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Community" subtitle="Consistency, shared. No comparison — just company." />

      {/* Your streak banner */}
      <Card glow className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warn/15 text-warn">
            <Flame size={20} />
          </span>
          <div>
            <div className="text-sm font-semibold text-ink-primary">You&apos;re on a roll</div>
            <div className="text-[12px] text-ink-muted">{hydrated ? streak : 0}-day streak · keep the chain alive</div>
          </div>
        </div>
        <Badge tone="warn"><Trophy size={11} /> Top 12%</Badge>
      </Card>

      <div className="space-y-3">
        {hydrated &&
          feed.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-gradient text-sm font-bold text-white">
                  {p.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5 text-sm">
                    <span className="font-semibold text-ink-primary">{p.author}</span>
                    <span className="text-ink-muted">{p.action}</span>
                  </div>
                  <div className="text-[11px] text-ink-muted">{p.timeAgo} ago</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">{p.detail}</p>
                  <button
                    onClick={() => toggleKudos(p.id)}
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-colors",
                      p.liked ? "border-purple/50 bg-purple/12 text-purple-glow" : "border-line text-ink-muted hover:text-white"
                    )}
                  >
                    <Heart size={13} className={cn(p.liked && "fill-current")} /> {p.kudos}
                  </button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-muted">
        <Users size={12} /> A supportive space — celebrate effort, not just outcomes.
      </p>
    </div>
  );
}
