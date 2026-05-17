import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Pill = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 h-8 text-[12px] font-medium glass",
        className
      )}
      {...rest}
    />
  )
);
Pill.displayName = "Pill";
