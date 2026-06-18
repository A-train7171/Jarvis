import type { Avatar as AvatarData } from "@/types";
import { initials } from "./util";

/** Shareable banner variants, built from app state. */
export type ShareKind = "rankup" | "workout" | "streak" | "nutrition" | "profile";

export interface ShareData {
  kind: ShareKind;
  name: string;
  avatar: AvatarData;
  rank: string;
  activeDays: number;
  streak: number;
  workouts: number;
  workoutName?: string;
  workoutItems?: number;
  cal?: number;
  calGoal?: number;
  protein?: number;
}

export type ShareFormat = "square" | "story";

const C = {
  jet: "#050505",
  card: "#15151A",
  line: "#26262C",
  white: "#FFFFFF",
  light: "#D9D9D9",
  muted: "#8A8A92",
  deep: "#5B18C9",
  primary: "#8B2EFF",
  glow: "#B65CFF",
};

const MONO = "'Montserrat', sans-serif";
const BODY = "'Inter', sans-serif";

interface Copy {
  eyebrow: string;
  headline: string;
  sub: string;
}

function copyFor(d: ShareData): Copy {
  switch (d.kind) {
    case "rankup":
      return { eyebrow: "Rank up", headline: d.rank, sub: `${d.activeDays} active days in` };
    case "workout":
      return {
        eyebrow: "Workout complete",
        headline: d.workoutName || "Session done",
        sub: `${d.workoutItems ?? 0} exercises · ${d.streak} day streak`,
      };
    case "streak":
      return { eyebrow: "On a roll", headline: `${d.streak} day streak`, sub: "Consistency wins" };
    case "nutrition":
      return {
        eyebrow: "Today's fuel",
        headline: `${d.cal ?? 0} kcal`,
        sub: `${d.protein ?? 0}g protein · goal ${d.calGoal ?? 0} kcal`,
      };
    case "profile":
      return {
        eyebrow: d.name || "Athlete",
        headline: d.rank,
        sub: `${d.streak} day streak · ${d.workouts} workouts`,
      };
  }
}

async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load("800 italic 120px 'Montserrat'"),
      document.fonts.load("900 italic 60px 'Montserrat'"),
      document.fonts.load("700 28px 'Inter'"),
      document.fonts.load("500 34px 'Inter'"),
    ]);
    await document.fonts.ready;
  } catch {
    /* fonts may already be ready or unavailable; draw anyway */
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function brandGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, C.deep);
  g.addColorStop(0.55, C.primary);
  g.addColorStop(1, C.glow);
  return g;
}

/** Shrink the font until `text` fits within maxWidth. Returns the px size used. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, base: string, start: number, min: number, maxWidth: number) {
  let size = start;
  do {
    ctx.font = `${base} ${size}px ${MONO}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  } while (size > min);
  return size;
}

async function drawAvatar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, d: ShareData) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (d.avatar.image) {
    try {
      const img = await loadImage(d.avatar.image);
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, cx - r, cy - r, r * 2, r * 2);
    } catch {
      d.avatar.image = null;
    }
  }
  if (!d.avatar.image) {
    ctx.fillStyle = d.avatar.bgColor || C.primary;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = "#fff";
    ctx.font = `700 ${r * 0.8}px ${BODY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials(d.name), cx, cy + 2);
  }
  ctx.restore();
  // ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(182,92,255,0.6)";
  ctx.stroke();
}

/** Render a branded share banner and return a PNG data URL. */
export async function renderShareCard(d: ShareData, format: ShareFormat = "square"): Promise<string> {
  await ensureFonts();

  const W = 1080;
  const H = format === "story" ? 1920 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  // background
  ctx.fillStyle = C.jet;
  ctx.fillRect(0, 0, W, H);
  const glow1 = ctx.createRadialGradient(W * 0.78, H * 0.16, 0, W * 0.78, H * 0.16, W * 0.7);
  glow1.addColorStop(0, "rgba(139,46,255,0.28)");
  glow1.addColorStop(1, "rgba(139,46,255,0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);
  const glow2 = ctx.createRadialGradient(W * 0.2, H * 0.9, 0, W * 0.2, H * 0.9, W * 0.7);
  glow2.addColorStop(0, "rgba(91,24,201,0.25)");
  glow2.addColorStop(1, "rgba(91,24,201,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // card
  const m = 56;
  roundRect(ctx, m, m, W - m * 2, H - m * 2, 52);
  ctx.fillStyle = "rgba(21,21,26,0.72)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = C.line;
  ctx.stroke();

  const padX = m + 76;
  const cardTop = m + 76;
  const cardBottom = H - m - 76;
  const contentW = W - padX * 2;

  // top: avatar + name
  await drawAvatar(ctx, padX + 48, cardTop + 48, 48, d);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = C.white;
  ctx.font = `600 38px ${BODY}`;
  ctx.fillText(d.name || "Pocket Trainer", padX + 112, cardTop + 36);
  ctx.fillStyle = C.muted;
  ctx.font = `500 26px ${BODY}`;
  ctx.fillText("Pocket Trainer athlete", padX + 112, cardTop + 72);

  // centered hero block
  const { eyebrow, headline, sub } = copyFor(d);
  const heroY = H * (format === "story" ? 0.46 : 0.5);

  ctx.textAlign = "left";
  ctx.fillStyle = C.glow;
  ctx.font = `700 30px ${BODY}`;
  ctx.letterSpacing = "4px";
  ctx.fillText(eyebrow.toUpperCase(), padX, heroY - 120);
  ctx.letterSpacing = "0px";

  // headline (gradient, may wrap to 2 lines)
  const upper = headline.toUpperCase();
  const size = fitFont(ctx, upper, "800 italic", 150, 64, contentW);
  ctx.font = `800 italic ${size}px ${MONO}`;
  ctx.fillStyle = brandGradient(ctx, padX, heroY, padX + contentW, heroY);
  const lines = wrap(ctx, upper, contentW);
  const lineH = size * 1.04;
  lines.forEach((ln, i) => ctx.fillText(ln, padX, heroY - 20 + i * lineH));

  ctx.fillStyle = C.light;
  ctx.font = `500 36px ${BODY}`;
  ctx.fillText(sub, padX, heroY - 20 + lines.length * lineH + 28);

  // accent bar
  roundRect(ctx, padX, heroY - 20 + lines.length * lineH + 80, 160, 8, 4);
  ctx.fillStyle = brandGradient(ctx, padX, 0, padX + 160, 0);
  ctx.fill();

  // footer: badge + wordmark + tagline
  const badgeR = 30;
  const badgeX = padX + badgeR;
  const badgeY = cardBottom - badgeR;
  roundRect(ctx, badgeX - badgeR, badgeY - badgeR, badgeR * 2, badgeR * 2, 16);
  ctx.fillStyle = brandGradient(ctx, badgeX - badgeR, badgeY - badgeR, badgeX + badgeR, badgeY + badgeR);
  ctx.fill();
  ctx.fillStyle = "#0A0A0C";
  ctx.font = `900 italic 28px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PT", badgeX, badgeY + 1);

  ctx.textAlign = "left";
  ctx.fillStyle = brandGradient(ctx, badgeX + 50, 0, badgeX + 360, 0);
  ctx.font = `800 italic 34px ${MONO}`;
  ctx.letterSpacing = "1px";
  ctx.fillText("POCKET TRAINER", badgeX + 50, badgeY - 12);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = C.muted;
  ctx.font = `500 24px ${BODY}`;
  ctx.fillText("Your Coach. In Your Pocket.", badgeX + 50, badgeY + 18);

  return canvas.toDataURL("image/png");
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  if (words.length === 1) return [text];
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
