"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Scene, TIER_META } from "@/lib/mockData";
import { ScenePopover } from "@/components/scene/ScenePopover";
import { createRoot, Root } from "react-dom/client";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Props = {
  scenes: Scene[];
  onSelect?: (s: Scene) => void;
  center?: [number, number];
  zoom?: number;
};

export function SceneMap({ scenes, onSelect, center = [0, 25], zoom = 1.6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRootRef = useRef<Root | null>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    if (!TOKEN) {
      setFallback(true);
      return;
    }
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => setReady(true));
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const markers: mapboxgl.Marker[] = [];
    scenes.forEach((s) => {
      const meta = TIER_META[s.tier];
      const el = document.createElement("button");
      el.className = "group relative";
      el.style.background = "transparent";
      el.style.border = "0";
      el.style.cursor = "pointer";

      const dot = document.createElement("span");
      dot.style.display = "block";
      dot.style.width = s.tier === "legendary" ? "18px" : "14px";
      dot.style.height = s.tier === "legendary" ? "18px" : "14px";
      dot.style.borderRadius = "999px";
      dot.style.background = meta.color;
      dot.style.boxShadow = `0 0 0 3px ${meta.color}33, 0 0 12px ${meta.color}66`;
      dot.style.transition = "transform 180ms cubic-bezier(0.3,1.5,0.5,1)";
      if (s.tier === "legendary") {
        dot.style.animation = "scenePulse 2.2s ease-out infinite";
      }
      el.appendChild(dot);

      el.addEventListener("mouseenter", () => { dot.style.transform = "scale(1.25)"; });
      el.addEventListener("mouseleave", () => { dot.style.transform = "scale(1)"; });

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect?.(s);
        const container = document.createElement("div");
        if (popupRootRef.current) {
          popupRootRef.current.unmount();
          popupRootRef.current = null;
        }
        popupRootRef.current = createRoot(container);
        popupRootRef.current.render(<ScenePopover scene={s} />);
        new mapboxgl.Popup({ offset: 16, closeButton: false, closeOnClick: true, maxWidth: "320px" })
          .setLngLat([s.lng, s.lat])
          .setDOMContent(container)
          .addTo(map);
      });

      const marker = new mapboxgl.Marker({ element: el }).setLngLat([s.lng, s.lat]).addTo(map);
      markers.push(marker);
    });

    // Keyframes once
    const styleId = "scene-pulse-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `@keyframes scenePulse { 0%,100% { box-shadow: 0 0 0 0 #FFD16699, 0 0 16px #FFD16677; } 50% { box-shadow: 0 0 0 14px #FFD16600, 0 0 24px #FFD166aa; } }`;
      document.head.appendChild(style);
    }

    return () => { markers.forEach((m) => m.remove()); };
  }, [scenes, ready, onSelect]);

  if (fallback) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-bg-1">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, rgba(76,201,240,0.18), transparent 40%), radial-gradient(circle at 70% 60%, rgba(230,57,70,0.16), transparent 35%), repeating-linear-gradient(0deg, rgba(42,51,64,0.5) 0px, rgba(42,51,64,0.5) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(42,51,64,0.5) 0px, rgba(42,51,64,0.5) 1px, transparent 1px, transparent 60px)",
        }} />
        <div className="relative h-full w-full">
          {scenes.map((s) => {
            const meta = TIER_META[s.tier];
            const x = ((s.lng + 180) / 360) * 100;
            const y = ((90 - s.lat) / 180) * 100;
            return (
              <button
                key={s.id}
                onClick={() => onSelect?.(s)}
                aria-label={s.filmTitle}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: s.tier === "legendary" ? 16 : 12,
                  height: s.tier === "legendary" ? 16 : 12,
                  background: meta.color,
                  boxShadow: `0 0 0 3px ${meta.color}33, 0 0 12px ${meta.color}80`,
                  animation: s.tier === "legendary" ? "scenePulse 2.2s ease-out infinite" : undefined,
                }}
              />
            );
          })}
        </div>
        <div className="absolute bottom-3 left-3 mono-meta text-ink-secondary glass rounded-md px-2 py-1.5">
          FALLBACK MAP · ADD NEXT_PUBLIC_MAPBOX_TOKEN FOR LIVE TILES
        </div>
      </div>
    );
  }

  return <div ref={ref} className="h-full w-full" />;
}
