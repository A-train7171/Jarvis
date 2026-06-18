import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { colors, displayHeading, gradient, radius } from "@/theme";

export function Card({
  children,
  style,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const interactive = !!onClick;
  return (
    <div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick!();
              }
            }
          : undefined
      }
      style={{
        background: colors.charcoal2,
        border: `1px solid ${colors.line}`,
        borderRadius: radius.card,
        padding: 16,
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h2 style={{ ...displayHeading, fontSize: 18, margin: "0 0 12px", ...style }}>{children}</h2>
  );
}

type BtnVariant = "primary" | "ghost" | "danger";
export function Button({
  children,
  variant = "primary",
  style,
  ...rest
}: { children: ReactNode; variant?: BtnVariant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base: CSSProperties = {
    border: "none",
    borderRadius: radius.pill,
    padding: "13px 18px",
    fontWeight: 700,
    fontSize: 15,
    color: colors.white,
    width: "100%",
    transition: "transform .1s ease, opacity .1s ease",
  };
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: { background: gradient, boxShadow: "0 6px 18px rgba(139,46,255,0.35)" },
    ghost: { background: "transparent", border: `1px solid ${colors.line}`, color: colors.light },
    danger: { background: "transparent", border: `1px solid ${colors.bad}`, color: colors.bad },
  };
  return (
    <button
      {...rest}
      style={{ ...base, ...variants[variant], ...(rest.disabled ? { opacity: 0.5 } : {}), ...style }}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  active,
  onClick,
  style,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        border: `1px solid ${active ? colors.primary : colors.line}`,
        background: active ? "rgba(139,46,255,0.16)" : "transparent",
        color: active ? colors.white : colors.muted,
        borderRadius: radius.pill,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const fieldStyle: CSSProperties = {
  background: colors.charcoal,
  border: `1px solid ${colors.line}`,
  borderRadius: radius.sm,
  padding: "12px 14px",
  color: colors.white,
  fontSize: 15,
  width: "100%",
};

export function Field({
  label,
  hint,
  ...rest
}: { label?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: "block" }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input {...rest} style={{ ...fieldStyle, ...(rest.style as CSSProperties) }} />
      {hint && <div style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{hint}</div>}
    </label>
  );
}

export function Select({
  label,
  children,
  ...rest
}: { label?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label style={{ display: "block" }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select {...rest} style={{ ...fieldStyle, ...(rest.style as CSSProperties) }}>
        {children}
      </select>
    </label>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        color: colors.muted,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: 6,
      }}
    >
      {children}
    </span>
  );
}

/** Macro/calorie progress bar. */
export function ProgressBar({
  value,
  max,
  label,
  color = colors.primary,
  over,
}: {
  value: number;
  max: number;
  label?: string;
  color?: string;
  over?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const isOver = over ?? value > max;
  return (
    <div>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: colors.light,
            marginBottom: 5,
          }}
        >
          <span>{label}</span>
          <span style={{ color: isOver ? colors.warn : colors.muted }}>
            {Math.round(value)} / {Math.round(max)}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemax={Math.round(max)}
        style={{ height: 8, background: colors.charcoal, borderRadius: 999, overflow: "hidden" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: isOver ? colors.warn : color,
            borderRadius: 999,
            transition: "width .35s ease",
          }}
        />
      </div>
    </div>
  );
}

/** "general info, not medical advice" note for health/nutrition surfaces. */
export function Disclaimer({ style }: { style?: CSSProperties }) {
  return (
    <p
      style={{
        color: colors.muted,
        fontSize: 11.5,
        lineHeight: 1.5,
        margin: "12px 0 0",
        ...style,
      }}
    >
      General information, not medical advice. Talk to a qualified professional before making big
      changes to your training or diet.
    </p>
  );
}

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2px solid ${colors.line}`,
        borderTopColor: colors.primary,
        borderRadius: "50%",
        animation: "pt-spin 0.7s linear infinite",
      }}
    />
  );
}

export function EmptyState({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", color: colors.muted }}>
      {icon && <div style={{ fontSize: 30, marginBottom: 8 }}>{icon}</div>}
      <div style={{ color: colors.light, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      {body && <div style={{ fontSize: 13 }}>{body}</div>}
    </div>
  );
}
