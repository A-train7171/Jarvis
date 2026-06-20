import { useEffect, useRef, useState } from "react";
import { colors, displayHeading } from "@/theme";
import { Screen } from "@/components/Screen";
import { Button, Card, Disclaimer, Select, Spinner } from "@/components/ui";
import { IconCamera, IconFlip } from "@/components/icons";
import { formCheck, type FormFeedback } from "@/lib/ai";

const EXERCISES = ["Squat", "Deadlift", "Bench Press", "Overhead Press", "Push-Up", "Lunge", "Row"];

export function FormCheck({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [exercise, setExercise] = useState(EXERCISES[0]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }

  async function start(face = facing) {
    setError(null);
    stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: face },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch {
      setError("Camera unavailable. You can upload a photo instead.");
    }
  }

  function flip() {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    if (active) void start(next);
  }

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setShot(canvas.toDataURL("image/jpeg", 0.85));
    stop();
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setShot(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!shot) return;
    setLoading(true);
    setFeedback(null);
    try {
      setFeedback(await formCheck(shot, exercise));
    } finally {
      setLoading(false);
    }
  }

  // clean up camera on unmount
  useEffect(() => stop, []);

  return (
    <Screen title="Form Check" onBack={onBack}>
      <Select label="Exercise" value={exercise} onChange={(e) => setExercise(e.target.value)}>
        {EXERCISES.map((x) => <option key={x}>{x}</option>)}
      </Select>

      <div
        style={{
          position: "relative",
          marginTop: 14,
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
          aspectRatio: "3/4",
          border: `1px solid ${colors.line}`,
        }}
      >
        {shot ? (
          <img src={shot} alt="Captured frame" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: facing === "user" ? "scaleX(-1)" : "none",
              display: active ? "block" : "none",
            }}
          />
        )}
        {!active && !shot && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: colors.muted, gap: 10 }}>
            <IconCamera size={36} />
            <span style={{ fontSize: 13 }}>{error ?? "Start the camera or upload a photo"}</span>
          </div>
        )}
        {active && (
          <button onClick={flip} aria-label="Flip camera" style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", border: `1px solid ${colors.line}`, color: "#fff", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconFlip />
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {shot ? (
          <>
            <Button onClick={analyze} disabled={loading}>
              {loading ? <Spinner /> : "Check my form"}
            </Button>
            <Button variant="ghost" onClick={() => { setShot(null); setFeedback(null); }}>
              Retake
            </Button>
          </>
        ) : active ? (
          <Button onClick={capture}>Capture frame</Button>
        ) : (
          <>
            <Button onClick={() => start()}>Start camera</Button>
            <Button variant="ghost" onClick={() => fileRef.current?.click()}>Upload a photo</Button>
          </>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
      </div>

      {feedback && (
        <Card style={{ marginTop: 16 }}>
          <div style={{ ...displayHeading, fontSize: 15, marginBottom: 8 }}>Coach feedback</div>
          <p style={{ color: colors.light, fontSize: 14, lineHeight: 1.5, margin: "0 0 10px" }}>{feedback.summary}</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: colors.light, fontSize: 13, display: "grid", gap: 4 }}>
            {feedback.cues.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Card>
      )}

      <Disclaimer />
    </Screen>
  );
}
