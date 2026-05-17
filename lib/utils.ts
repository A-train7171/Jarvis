export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatCoord(lng: number, lat: number): string {
  const lngStr = `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? "E" : "W"}`;
  const latStr = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}`;
  return `${latStr}  ${lngStr}`;
}

export function rarityLabel(r: string): string {
  return r.charAt(0).toUpperCase() + r.slice(1);
}
