import { useEffect, useRef } from "react";

const COLORS = ["#8B2EFF", "#B65CFF", "#5B18C9", "#3FD18B", "#FFB020", "#FF5C8A", "#3FC7FF", "#FFE14D"];

type Shape = "rect" | "tri" | "squiggle";
export type ConfettiIntensity = "normal" | "big";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: Shape;
  delay: number;
  started: boolean;
  life: number;
}

const CONFIG: Record<ConfettiIntensity, { count: number; duration: number; minSize: number; maxSize: number; waves: number }> = {
  normal: { count: 140, duration: 2600, minSize: 6, maxSize: 13, waves: 1 },
  big: { count: 300, duration: 4400, minSize: 8, maxSize: 20, waves: 2 },
};

/**
 * Full-screen confetti burst. Plays once for the configured duration then
 * stops. `intensity: "big"` rains more, larger confetti in two waves for a
 * bigger moment (level-ups). Honors prefers-reduced-motion (renders nothing).
 */
export function Confetti({ intensity = "normal" }: { intensity?: ConfettiIntensity }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = CONFIG[intensity];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (canvas.width = canvas.offsetWidth * dpr);
    const H = (canvas.height = canvas.offsetHeight * dpr);

    const particles: Particle[] = Array.from({ length: cfg.count }, (_, i) => {
      const wave = cfg.waves > 1 ? i % cfg.waves : 0;
      const r = Math.random();
      const origin = r < 0.34 ? "mid" : r < 0.67 ? "left" : "right";
      const originX = origin === "mid" ? W / 2 : origin === "left" ? 0 : W;
      const dir = origin === "mid" ? (Math.random() - 0.5) * 2 : origin === "left" ? 1 : -1;
      const spread = intensity === "big" ? 4.5 : 3.5;
      return {
        x: originX,
        y: -Math.random() * H * 0.15,
        vx: dir * (1 + Math.random() * spread) * dpr,
        // a little upward pop before gravity pulls them down (more on "big")
        vy: ((intensity === "big" ? -2.5 : 0.5) + Math.random() * 3) * dpr,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.32,
        size: (cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize)) * dpr,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: (["rect", "tri", "squiggle"] as Shape[])[(Math.random() * 3) | 0],
        delay: wave * (cfg.duration * 0.18),
        started: false,
        life: 1,
      };
    });

    const gravity = 0.12 * dpr;
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        if (t < p.delay) continue;
        p.started = true;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const fadeStart = p.delay + (cfg.duration - p.delay) * 0.6;
        if (t > fadeStart) p.life = Math.max(0, 1 - (t - fadeStart) / ((cfg.duration - fadeStart) || 1));

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "tri") {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.lineWidth = p.size / 3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.quadraticCurveTo(0, -p.size / 2, p.size / 2, 0);
          ctx.stroke();
        }
        ctx.restore();
      }
      if (t < cfg.duration) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
