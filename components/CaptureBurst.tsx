"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check } from "lucide-react";

export function CaptureBurst({
  show,
  xp,
  onDone,
}: {
  show: boolean;
  xp: number;
  onDone: () => void;
}) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="burst"
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="relative flex flex-col items-center gap-4"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-success"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success text-bg-base shadow-glow">
                <Check size={56} strokeWidth={3.5} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-ink-secondary">
                Scene Captured
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-2xl font-bold text-accent">
                <Zap size={20} fill="currentColor" /> +{xp.toLocaleString()} XP
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
