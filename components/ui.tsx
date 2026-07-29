import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn, clamp } from "@/lib/utils";

// ── Card ────────────────────────────────────────────────────────────────────

export function Card({
  className,
  glow,
  as: As = "div",
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean; as?: React.ElementType }) {
  return (
    <As
      className={cn(
        "rounded-card border border-line bg-bg-card p-5",
        glow && "shadow-glow-sm",
        className
      )}
      {...rest}
    />
  );
}

// ── Button ──────────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-purple-gradient text-white shadow-glow-sm hover:brightness-110 active:brightness-95",
  secondary:
    "border border-line bg-bg-surface/60 text-ink-primary hover:border-purple/60 hover:text-white",
  ghost: "text-ink-secondary hover:bg-bg-surface hover:text-white",
  danger: "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
};
const SIZE: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-13 px-6 text-base gap-2 rounded-2xl py-3.5",
};

interface ButtonBase {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonBase & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-45",
        VARIANT[variant],
        SIZE[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 15 : 17} strokeWidth={2.2} />}
      {children}
      {IconRight && <IconRight size={size === "sm" ? 15 : 17} strokeWidth={2.2} />}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  className,
  children,
}: ButtonBase & { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-all duration-150",
        VARIANT[variant],
        SIZE[size],
        fullWidth && "w-full",
        className
      )}
    >
      {Icon && <Icon size={size === "sm" ? 15 : 17} strokeWidth={2.2} />}
      {children}
      {IconRight && <IconRight size={size === "sm" ? 15 : 17} strokeWidth={2.2} />}
    </Link>
  );
}

export function IconButton({
  icon: Icon,
  label,
  className,
  ...rest
}: { icon: LucideIcon; label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg-surface/50 text-ink-secondary transition-colors hover:border-purple/50 hover:text-white",
        className
      )}
      {...rest}
    >
      <Icon size={18} strokeWidth={2} />
    </button>
  );
}

// ── Inputs ──────────────────────────────────────────────────────────────────

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-line bg-bg-surface/50 px-4 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-colors focus:border-purple focus:bg-bg-surface",
        className
      )}
      {...rest}
    />
  );
});

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-secondary">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-muted">{hint}</span>}
    </label>
  );
}

// ── Chips / badges ──────────────────────────────────────────────────────────

export function Chip({
  active,
  className,
  ...rest
}: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? "border-purple/60 bg-purple/15 text-white"
          : "border-line bg-bg-surface/40 text-ink-secondary hover:text-white",
        className
      )}
      {...rest}
    />
  );
}

export function Badge({
  children,
  tone = "purple",
  className,
}: {
  children: React.ReactNode;
  tone?: "purple" | "muted" | "success" | "warn";
  className?: string;
}) {
  const tones = {
    purple: "border-purple/40 bg-purple/12 text-purple-glow",
    muted: "border-line bg-bg-surface/60 text-ink-muted",
    success: "border-success/40 bg-success/10 text-success",
    warn: "border-warn/40 bg-warn/10 text-warn",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ── Progress ────────────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  className,
  color = "var(--purple)",
  track = "var(--bg-surface)",
}: {
  value: number; // 0–1
  className?: string;
  color?: string;
  track?: string;
}) {
  const pct = clamp(value, 0, 1) * 100;
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full", className)}
      style={{ background: track }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 128,
  stroke = 12,
  color = "var(--purple)",
  track = "rgba(255,255,255,0.07)",
  children,
  className,
}: {
  value: number; // 0–1
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = clamp(value, 0, 1) * c;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
}

// ── Stat tile ───────────────────────────────────────────────────────────────

export function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-bg-card p-4", className)}>
      <div className="flex items-center gap-1.5 text-ink-muted">
        {Icon && <Icon size={14} className="text-purple" />}
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="stat-number mt-2 text-2xl text-ink-primary">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}

// ── Section header ──────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-secondary">
        {title}
      </h2>
      {action}
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-bg-card/40 px-6 py-12 text-center">
      <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple/10 text-purple">
        <Icon size={22} />
      </span>
      <h3 className="text-base font-semibold text-ink-primary">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Disclaimer strip ────────────────────────────────────────────────────────

export function SafetyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-line bg-bg-surface/30 px-4 py-3 text-[12px] leading-relaxed text-ink-muted">
      {children}
    </p>
  );
}
