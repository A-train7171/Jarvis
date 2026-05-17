import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card bg-bg-1 border border-white/5 hover:border-white/10 transition-colors",
        className
      )}
      {...rest}
    />
  )
);
Card.displayName = "Card";
