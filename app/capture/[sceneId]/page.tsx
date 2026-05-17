"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { getScene, TIER_META } from "@/lib/mockData";
import { usePlayer } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PointsCounter } from "@/components/game/PointsCounter";
import { RarityBadge } from "@/components/scene/RarityBadge";
import { ShotMatchFrame } from "@/components/scene/ShotMatchFrame";
import { ArrowLeft, Camera, MapPin, Check, QrCode, Share2, ExternalLink } from "lucide-react";

type Phase = "approach" | "verify" | "shotmatch" | "complete";

export default function CapturePage() {
  const params = useParams<{ sceneId: string }>();
  const router = useRouter();
  const scene = getScene(params.sceneId);
  const [phase, setPhase] = useState<Phase>("approach");
  const [distance, setDistance] = useState(240);
  const [qrOpen, setQrOpen] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addCapture = usePlayer((s) => s.addCapture);
  const meta = scene ? TIER_META[scene.tier] : null;

  const captured = useMemo(() => {
    if (!scene) return false;
    return usePlayer.getState().player.capturedSceneIds.includes(scene.id);
  }, [scene]);

  useEffect(() => {
    if (phase !== "complete" || !scene) return;
    addCapture(scene.id, scene.points);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.4 },
      colors: ["#E63946", "#F4A261", "#FFD166", "#4CC9F0", "#3DDC97"],
    });
  }, [phase, scene, addCapture]);

  if (!scene || !meta) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mono-meta text-ink-secondary mb-2">SCENE NOT FOUND</div>
        <h2 className="text-2xl font-semibold mb-6">That scene isn&apos;t on the map.</h2>
        <Link href="/map"><Button>Back to map</Button></Link>
      </div>
    );
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUserImage(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-6">
      <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-ink-secondary hover:text-ink-primary">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="mono-meta text-ink-secondary">SCENE {scene.id.slice(0,3).toUpperCase()} · {scene.year}</div>
          <h1 className="cinematic-tracking text-3xl md:text-4xl font-bold mt-1">
            <em className="not-italic italic" style={{ color: meta.color }}>{scene.filmTitle}</em>
          </h1>
          <p className="text-ink-secondary mt-1">{scene.sceneDescription}</p>
        </div>
        <RarityBadge tier={scene.tier} />
      </div>

      <div className="flex flex-wrap gap-2 mt-3 mb-6">
        <Pill><MapPin size={12} style={{ color: meta.color }} /><span className="mono-meta">{scene.city.toUpperCase()}</span></Pill>
        <Pill><span className="mono-meta">+{scene.points} PTS</span></Pill>
        <Pill><span className="mono-meta">{scene.lat.toFixed(4)}, {scene.lng.toFixed(4)}</span></Pill>
      </div>

      <AnimatePresence mode="wait">
        {phase === "approach" && (
          <motion.div key="approach" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="p-6 relative overflow-hidden">
              <div className="aspect-video relative rounded-md overflow-hidden mb-5">
                <div className="absolute inset-0 bg-bg-2" style={{
                  backgroundImage: `radial-gradient(circle at center, ${meta.color}22, transparent 60%), repeating-linear-gradient(0deg, rgba(42,51,64,0.5) 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, rgba(42,51,64,0.5) 0 1px, transparent 1px 60px)`,
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full animate-ring-expand" style={{ background: `${meta.color}33` }} />
                    <span className="relative block h-5 w-5 rounded-full" style={{ background: meta.color, boxShadow: `0 0 0 4px ${meta.color}33, 0 0 16px ${meta.color}` }} />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 mono-meta text-ink-secondary">100M RADIUS</div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="mono-meta text-ink-secondary">CURRENT DISTANCE</div>
                  <div className="cinematic-tracking text-3xl font-bold mt-0.5">{distance}<span className="text-base text-ink-secondary ml-1">m</span></div>
                </div>
                <Badge tone={distance <= 25 ? "success" : "warm"}>
                  {distance <= 25 ? "IN RANGE" : "GET CLOSER"}
                </Badge>
              </div>

              <p className="text-[13px] text-ink-secondary mb-4 italic">Get within <span className="not-italic text-ink-primary">25m</span> to unlock the verification step.</p>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setDistance((d) => Math.max(0, d - 70))} variant="ghost">Walk closer</Button>
                <Button onClick={() => { setDistance(12); setPhase("verify"); }}>
                  Simulate arrival
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {phase === "verify" && (
          <motion.div key="verify" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="p-6">
              <div className="text-center mb-6 relative">
                <div className="inline-block relative">
                  <span className="absolute inset-0 rounded-full animate-ring-expand" style={{ background: "rgba(230,57,70,0.4)" }} />
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary text-white">
                    <Check size={20} />
                  </span>
                </div>
                <div className="mono-meta text-success mt-3">SCENE UNLOCKED</div>
                <h3 className="cinematic-tracking text-xl font-semibold mt-1">Verify you&apos;re really here</h3>
              </div>

              <div className="grid gap-3 md:grid-cols-2 mb-4">
                <Card className="p-4 border-success/30 bg-success/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={16} className="text-success" />
                    <div className="mono-meta text-success">GPS VERIFIED</div>
                  </div>
                  <p className="text-[13px] text-ink-secondary">Location matches scene coordinates within tolerance.</p>
                </Card>
                <button onClick={() => setQrOpen(true)} className="text-left">
                  <Card className="p-4 hover:border-accent-primary/40 transition-colors h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode size={16} className="text-accent-primary" />
                      <div className="mono-meta">SCAN ON-SITE QR</div>
                    </div>
                    <p className="text-[13px] text-ink-secondary">Optional. Boosts trust score for leaderboard.</p>
                  </Card>
                </button>
              </div>

              <Button className="w-full" onClick={() => setPhase("shotmatch")}>
                Continue to ShotMatch
              </Button>
            </Card>

            <Modal open={qrOpen} onClose={() => setQrOpen(false)}>
              <div className="text-center">
                <div className="mono-meta text-ink-secondary mb-2">QR SCANNER</div>
                <h3 className="text-lg font-semibold mb-4">Point your camera at the scene plaque</h3>
                <div className="aspect-square w-full max-w-[260px] mx-auto rounded-card border-2 border-dashed border-accent-primary/40 bg-bg-2 flex items-center justify-center mb-4">
                  <div className="grid grid-cols-8 gap-px p-4 opacity-30">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span key={i} className="aspect-square" style={{ background: Math.random() > 0.5 ? "#F5F7FA" : "transparent" }} />
                    ))}
                  </div>
                </div>
                <Button onClick={() => setQrOpen(false)} variant="outline">Close</Button>
              </div>
            </Modal>
          </motion.div>
        )}

        {phase === "shotmatch" && (
          <motion.div key="shotmatch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="p-6">
              <div className="mono-meta text-ink-secondary mb-1">STEP 3 OF 3</div>
              <h3 className="cinematic-tracking text-xl font-semibold mb-1">ShotMatch the frame</h3>
              <p className="text-[13px] text-ink-secondary italic mb-5">Recreate the original composition. The closer the match, the bigger the bonus.</p>

              <div className="mb-5">
                <ShotMatchFrame scene={scene} userImage={userImage} />
              </div>

              <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={onPickImage} className="hidden" />

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => inputRef.current?.click()} variant="ghost">
                  <Camera size={16} /> {userImage ? "Retake" : "Take photo"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUserImage(scene.imageUrl)}
                >
                  Use demo shot
                </Button>
                <Button onClick={() => setPhase("complete")} disabled={!userImage}>
                  Submit capture
                </Button>
              </div>
              <p className="mono-meta text-ink-secondary mt-3 italic">
                NO CAMERA? USE THE DEMO SHOT TO COMPLETE THE FLOW.
              </p>
            </Card>
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
            <Card className="p-8 text-center grain relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/10 via-transparent to-transparent" />
              <div className="relative">
                <div className="mono-meta text-success mb-2">CAPTURE VERIFIED</div>
                <PointsCounter to={scene.points} />
                <div className="mono-meta text-ink-secondary mt-2">POINTS · +{Math.round(scene.points / 10)} REELS</div>

                <h3 className="cinematic-tracking text-2xl font-bold mt-6">
                  <em className="not-italic italic" style={{ color: meta.color }}>{scene.filmTitle}</em>{" "}
                  is now in your reel.
                </h3>
                <p className="text-ink-secondary mt-2">
                  {scene.city}, {scene.country} — joined {scene.captureCount.toLocaleString()} other explorers.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                  <Button>
                    <Share2 size={15} /> Share
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/map")}>
                    <MapPin size={15} /> Find next scene
                  </Button>
                  <Button variant="ghost">
                    <ExternalLink size={15} /> Open in SetLocate
                  </Button>
                </div>

                {captured && (
                  <div className="mono-meta text-ink-secondary mt-6 italic">YOU&apos;VE CAPTURED THIS SCENE BEFORE — NO DOUBLE POINTS.</div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
