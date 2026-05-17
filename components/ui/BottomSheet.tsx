"use client";
import { motion, AnimatePresence, PanInfo, useMotionValue, animate } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

type Snap = 0.25 | 0.6 | 0.95;

export function BottomSheet({
  open,
  onSnapChange,
  snap = 0.25,
  children,
  className,
}: {
  open: boolean;
  onSnapChange?: (s: Snap) => void;
  snap?: Snap;
  children: ReactNode;
  className?: string;
}) {
  const y = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.innerHeight;
    const target = h * (1 - snap);
    animate(y, target, { type: "spring", stiffness: 320, damping: 32 });
  }, [snap, y]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (typeof window === "undefined") return;
    const h = window.innerHeight;
    const yVal = y.get();
    const ratio = 1 - yVal / h;
    let next: Snap = 0.25;
    if (ratio > 0.75) next = 0.95;
    else if (ratio > 0.4) next = 0.6;
    if (info.velocity.y > 600) next = 0.25;
    if (info.velocity.y < -600) next = 0.95;
    onSnapChange?.(next);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: typeof window !== "undefined" ? window.innerHeight * 0.8 : 600 }}
          dragElastic={0.04}
          onDragEnd={onDragEnd}
          style={{ y }}
          className={cn(
            "fixed inset-x-0 top-0 z-40 h-screen rounded-t-[22px] glass shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.6)]",
            className
          )}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1.5 w-10 rounded-full bg-white/15" />
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
