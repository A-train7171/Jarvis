import { useEffect, useRef } from "react";

const COLORS = ["#8B2EFF", "#B65CFF", "#5B18C9", "#3FD18B", "#FFB020", "#FF5C8A", "#3FC7FF", "#FFE14D"];

type Shape = "rect" | "tri" | "squiggle";

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
  life: number;
}

/**
 * Lightweight confetti burst on a full-screen overlay canvas. Plays once for
 * ~`duration` ms then stops. Honors prefers-reduced-motion (renders nothing).
 */
export function Confetti({ duration = 2600, count = 140 }: { duration?: number; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (canvas.width = canvas.offsetWidth * dpr);
    const H = (canvas.height = canvas.offsetHeight * dpr);

    // Spawn from two top corners + center, fanning inward and down.
    const particles: Particle[] = Array.from({ length: count }, () => {
      const fromLeft = Math.random() < 0.5;
      const originX = Math.random() < 0.34 ? W / 2 : fromLeft ? 0 : W;
      return {
        x: originX,
        y: -Math.random() * H * 0.2,
        vx: (originX === W / 2 ? (Math.random() - 0.5) * 2 : fromLeft ? 1 : -1) * (1 + Math.random() * 3.5) * dpr,
        vy: (2 + Math.random() * 3) * dpr,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        size: (6 + Math.random() * 7) * dpr,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: (["rect", "tri", "squiggle"] as Shape[])[(Math.random() * 3) | 0],
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
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (t > duration * 0.6) p.life = Math.max(0, 1 - (t - duration * 0.6) / (duration * 0.4));

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
      if (t < duration) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [duration, count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
