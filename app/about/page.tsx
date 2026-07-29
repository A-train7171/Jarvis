"use client";

import { Heart, ShieldCheck, GraduationCap, Users, Sparkles, HandHeart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

const PILLARS = [
  { icon: Sparkles, title: "Personalization", body: "Guidance that adapts to your goal, level, and pace — never one-size-fits-all." },
  { icon: GraduationCap, title: "Education", body: "We explain the why, so you build knowledge you keep for life." },
  { icon: Heart, title: "Consistency", body: "Small, repeatable wins beat heroic bursts. We help you show up." },
  { icon: Users, title: "Accountability", body: "A coach in your pocket and a community that cheers effort, not ego." },
];

const SAFETY = [
  "Provides general fitness information and education only.",
  "Is not a replacement for doctors, dietitians, or medical professionals.",
  "Never encourages starvation, extreme restriction, or dangerous weight loss.",
  "Never tells you to train through sharp or serious pain.",
  "Never gives medical diagnoses.",
];

export default function AboutPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader title="About" />

      <Card glow className="flex flex-col items-center py-8 text-center">
        <LogoMark size={64} tile />
        <h2 className="mt-4 display-italic text-2xl text-ink-primary">Pocket Trainer</h2>
        <p className="text-sm text-purple-glow">Your Coach. In Your Pocket.</p>
        <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-secondary">
          An AI-powered personal fitness operating system — your trainer, nutrition coach,
          planner, form analyst, and accountability partner, all in one simple experience.
        </p>
      </Card>

      <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-ink-secondary">
        What we believe
      </h3>
      <p className="mb-4 rounded-card border border-line bg-purple-soft p-5 text-[15px] font-medium leading-relaxed text-ink-primary">
        Fitness success comes from consistency, personalization, education, and accountability.
        Pocket Trainer shouldn&apos;t overwhelm you — it should guide you.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">
              <Icon size={18} />
            </span>
            <div className="mt-3 text-sm font-semibold text-ink-primary">{title}</div>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{body}</p>
          </Card>
        ))}
      </div>

      <h3 className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink-secondary">
        <ShieldCheck size={16} className="text-success" /> Health &amp; safety
      </h3>
      <Card>
        <p className="text-[13px] text-ink-secondary">Pocket Trainer:</p>
        <ul className="mt-3 space-y-2.5">
          {SAFETY.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-[13px] text-ink-secondary">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-success" />
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-line bg-bg-surface/30 p-3 text-[12px] leading-relaxed text-ink-muted">
          <HandHeart size={15} className="mt-0.5 shrink-0 text-purple" />
          If food, exercise, or body image ever feels distressing, please reach out to a qualified
          professional. Asking for help is a strength.
        </div>
      </Card>

      <p className="mt-6 text-center text-[11px] text-ink-muted">Made to help you feel: “I can do this.”</p>
    </div>
  );
}
