"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ScanLine,
  Video,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { EXERCISES } from "@/lib/data";
import type { Exercise, FormAnalysis, FormCheckpoint } from "@/types";
import { Card, Button, Chip, ProgressRing, SafetyNote, SectionHeader, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const STATUS_META = {
  good: { icon: CheckCircle2, color: "var(--success)", label: "Good" },
  watch: { icon: AlertTriangle, color: "var(--warn)", label: "Watch" },
  fix: { icon: XCircle, color: "var(--danger)", label: "Fix" },
} as const;

/** Build a checkpoint-based analysis from an exercise's coaching cues + common faults. */
function analyze(ex: Exercise): FormAnalysis {
  const flaggedFault = ex.faults[Math.floor(Math.random() * ex.faults.length)];
  const checkpoints: FormCheckpoint[] = ex.cues.slice(0, 3).map((cue) => ({
    label: cue.split(" ").slice(0, 3).join(" ").replace(/[,.]/g, ""),
    status: "good",
    detail: cue,
  }));
  checkpoints.push({
    label: "Under fatigue",
    status: Math.random() > 0.5 ? "watch" : "fix",
    detail: `Keep an eye on: ${flaggedFault.toLowerCase()}.`,
  });
  const score = 74 + Math.floor(Math.random() * 18);
  return {
    id: `an_${Date.now()}`,
    exerciseName: ex.name,
    dateISO: new Date().toISOString().slice(0, 10),
    score,
    summary: `Solid ${ex.name.toLowerCase()} overall. Your key checkpoints held up — the main thing to monitor is ${flaggedFault.toLowerCase()} as you tire.`,
    checkpoints,
  };
}

export default function FormPage() {
  const hydrated = useHydrated();
  const analyses = usePT((s) => s.analyses);
  const addAnalysis = usePT((s) => s.addAnalysis);
  const [selected, setSelected] = useState<Exercise>(EXERCISES[0]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<FormAnalysis | null>(null);

  function run() {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      const a = analyze(selected);
      addAnalysis(a);
      setResult(a);
      setRunning(false);
    }, 1400);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="display-italic text-3xl text-ink-primary">Form</h1>
        <p className="mt-1 text-[13px] text-ink-secondary">Your AI form analyst. Lift smarter, safer.</p>
      </div>

      {/* Analyzer */}
      <Card glow>
        <div className="flex items-center gap-2">
          <Badge tone="purple"><Sparkles size={11} /> AI analysis</Badge>
        </div>
        <p className="mt-3 text-sm text-ink-secondary">
          Pick a lift and run a checkpoint breakdown. Record from the side for the most useful read.
        </p>

        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-bg-surface/40 py-3 text-sm text-ink-secondary transition-colors hover:border-purple/50 hover:text-white">
            <Video size={16} /> Record
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-bg-surface/40 py-3 text-sm text-ink-secondary transition-colors hover:border-purple/50 hover:text-white">
            <Upload size={16} /> Upload
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-muted">Choose a lift</div>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {EXERCISES.filter((e) => e.faults.length).slice(0, 10).map((ex) => (
              <Chip key={ex.id} active={selected.id === ex.id} onClick={() => { setSelected(ex); setResult(null); }}>
                {ex.name}
              </Chip>
            ))}
          </div>
        </div>

        <Button fullWidth icon={ScanLine} className="mt-4" onClick={run} disabled={running}>
          {running ? "Analyzing form…" : `Run form check · ${selected.name}`}
        </Button>
      </Card>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AnalysisCard analysis={result} highlight />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cues reference for the selected lift */}
      <Card>
        <SectionHeader title={`${selected.name} — coaching cues`} className="mb-2" />
        <ul className="space-y-1.5">
          {selected.cues.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-ink-secondary">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" /> {c}
            </li>
          ))}
        </ul>
      </Card>

      {/* History */}
      <div>
        <SectionHeader title="Past analyses" />
        <div className="space-y-3">
          {hydrated &&
            analyses.map((a) => <AnalysisCard key={a.id} analysis={a} />)}
        </div>
      </div>

      <SafetyNote>
        Form analysis is educational feedback, not a medical assessment. If a movement causes
        sharp or persistent pain, stop and check with a coach or physiotherapist.
      </SafetyNote>
    </div>
  );
}

function AnalysisCard({ analysis, highlight }: { analysis: FormAnalysis; highlight?: boolean }) {
  const [open, setOpen] = useState(!!highlight);
  const scoreColor =
    analysis.score >= 85 ? "var(--success)" : analysis.score >= 75 ? "var(--purple)" : "var(--warn)";
  return (
    <Card glow={highlight} className={cn(highlight && "border-purple/40")}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-4 text-left">
        <ProgressRing value={analysis.score / 100} size={72} stroke={8} color={scoreColor}>
          <span className="stat-number text-lg text-ink-primary">{analysis.score}</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-ink-primary">{analysis.exerciseName}</h3>
            {highlight && <Badge tone="success">New</Badge>}
          </div>
          <div className="text-[11px] text-ink-muted">
            {new Date(analysis.dateISO).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] text-ink-secondary">{analysis.summary}</p>
        </div>
        <ChevronRight size={18} className={cn("shrink-0 text-ink-muted transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {analysis.checkpoints.map((cp) => {
            const meta = STATUS_META[cp.status];
            const Icon = meta.icon;
            return (
              <li key={cp.label} className="flex items-start gap-2.5">
                <Icon size={17} style={{ color: meta.color }} className="mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium capitalize text-ink-primary">{cp.label}</div>
                  <div className="text-[12px] text-ink-muted">{cp.detail}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
