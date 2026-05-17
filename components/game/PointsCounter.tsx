"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

export function PointsCounter({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    function tick(t: number) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return (
    <motion.span
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="cinematic-tracking text-5xl font-bold text-accent-primary tabular-nums"
    >
      +{formatNumber(val)}
    </motion.span>
  );
}
