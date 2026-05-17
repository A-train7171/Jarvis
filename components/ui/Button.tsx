"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary/60 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-[#d62f3c] shadow-[0_8px_24px_-12px_rgba(230,57,70,0.65)]",
  ghost:
    "bg-white/5 text-ink-primary hover:bg-white/10 border border-white/8",
  outline:
    "bg-transparent text-ink-primary border border-divider hover:border-ink-secondary hover:bg-white/[0.03]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  )
);
Button.displayName = "Button";
