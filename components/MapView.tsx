"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { scenes } from "@/lib/mockData";
import { usePlayer } from "@/lib/store";
import { MapPinOff } from "lucide-react";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function MapView({ onSelect }: { onSelect: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const capturedIds = usePlayer((s) => s.capturedIds);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 28],
      zoom: 1.6,
      attributionControl: true,
      projection: "globe",
    });

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(15, 15, 20)",
        "high-color": "rgb(7, 7, 10)",
        "horizon-blend": 0.04,
        "space-color": "rgb(3, 3, 6)",
        "star-intensity": 0.4,
      });
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // (re)render markers when capture state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    scenes.forEach((scene) => {
      const el = document.createElement("div");
      el.className = `scene-marker${
        capturedIds.includes(scene.id) ? " captured" : ""
      }`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect(scene.id);
        map.flyTo({
          center: scene.coordinates,
          zoom: Math.max(map.getZoom(), 5),
          duration: 1200,
          essential: true,
        });
      });
      const marker = new mapboxgl.Marker(el)
        .setLngLat(scene.coordinates)
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [capturedIds, onSelect]);

  if (!TOKEN) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-bg-elevated p-8 text-center text-ink-secondary">
        <MapPinOff size={32} className="text-ink-muted" />
        <div className="text-sm font-semibold text-ink-primary">
          Mapbox token not configured
        </div>
        <p className="max-w-sm text-xs text-ink-muted">
          Set <code className="font-mono text-accent">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
          in <code className="font-mono">.env.local</code> to render the world map. The
          rest of the app works without it — try the{" "}
          <a href="/collection" className="text-accent underline">
            collection
          </a>{" "}
          page.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
