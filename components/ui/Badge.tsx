import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "primary" | "warm" | "cool" | "gold" | "success";
}) {
  const tones = {
    neutral: "bg-white/8 text-ink-primary",
    primary: "bg-accent-primary/15 text-accent-primary border border-accent-primary/30",
    warm: "bg-accent-warm/15 text-accent-warm border border-accent-warm/30",
    cool: "bg-accent-cool/15 text-accent-cool border border-accent-cool/30",
    gold: "bg-accent-gold/15 text-accent-gold border border-accent-gold/30",
    success: "bg-success/15 text-success border border-success/30",
  } as const;
  return (
    <span
      className={cn(
        "mono-meta inline-flex items-center rounded-full px-2.5 py-1",
        tones[tone],
        className
      )}
      {...rest}
    />
  );
}
