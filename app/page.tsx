import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { MapPin, QrCode, Trophy, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Find scenes near you",
    body: "Every filming location on SetLocate becomes a collectible Scene on the live map.",
  },
  {
    icon: QrCode,
    title: "Verify with GPS + QR",
    body: "Walk in, scan, ShotMatch the original frame. Tamper-proof captures, frictionless flow.",
  },
  {
    icon: Trophy,
    title: "Compete weekly",
    body: "Climb the global leaderboard for movie tickets, streaming credit, and rare on-set merch.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden grain vignette">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=70)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/30 via-bg-base/70 to-bg-base" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-20 md:pt-32 pb-24 md:pb-40">
          <Pill className="mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
            <span className="mono-meta">A SETLOCATE GAME EXTENSION</span>
          </Pill>
          <h1 className="cinematic-tracking text-5xl md:text-7xl font-bold leading-[1.02] max-w-3xl">
            <em className="not-italic bg-gradient-to-r from-accent-primary via-accent-warm to-accent-gold bg-clip-text text-transparent italic">
              SetLocate
            </em>{" "}
            <span className="text-ink-primary">GO</span>
          </h1>
          <p className="mono-meta text-ink-secondary mt-4">FROM SCREEN TO STREET.</p>
          <p className="mt-6 max-w-xl text-lg text-ink-secondary leading-relaxed">
            Visit real filming locations. Verify with GPS. Recreate the frame.
            Compete with cinephiles, screen tourists, and explorers worldwide for weekly prizes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/map">
              <Button size="lg">
                Start exploring
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline">View leaderboard</Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-[12px] text-ink-secondary">
            <div><span className="mono-meta text-ink-primary">2,184</span> scenes mapped</div>
            <div className="h-3 w-px bg-divider" />
            <div><span className="mono-meta text-ink-primary">62</span> countries</div>
            <div className="h-3 w-px bg-divider" />
            <div><span className="mono-meta text-ink-primary">$4,200</span> in weekly prizes</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 -mt-12 md:-mt-20 relative z-10 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary mb-4">
                <Icon size={18} />
              </div>
              <h3 className="cinematic-tracking text-lg font-semibold mb-1.5">{title}</h3>
              <p className="text-[14px] text-ink-secondary leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>

        {/* Tier preview strip */}
        <div className="mt-16">
          <div className="mono-meta text-ink-secondary mb-4">SCENE RARITY TIERS</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "Background", color: "#F5F7FA", pts: 50 },
              { name: "Featured", color: "#F4A261", pts: 150 },
              { name: "Iconic", color: "#E63946", pts: 400 },
              { name: "Landmark", color: "#4CC9F0", pts: 1000 },
              { name: "Legendary", color: "#FFD166", pts: 2500 },
            ].map((t) => (
              <Card key={t.name} className="p-4 flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ background: t.color, boxShadow: `0 0 0 3px ${t.color}33, 0 0 12px ${t.color}77` }}
                />
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">{t.name}</div>
                  <div className="mono-meta text-ink-secondary">+{t.pts} PTS</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-16 relative overflow-hidden rounded-card border border-divider p-8 md:p-12 grain">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/15 via-transparent to-accent-cool/10" />
          <div className="relative max-w-2xl">
            <h2 className="cinematic-tracking text-3xl md:text-4xl font-semibold">
              Every filming location is a piece of cultural geography.
            </h2>
            <p className="mt-3 text-ink-secondary text-lg italic">
              SetLocate GO turns that geography into a global playground.
            </p>
            <div className="mt-6">
              <Link href="/map">
                <Button size="lg">Open the map</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
