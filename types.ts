export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Scene {
  id: string;
  title: string;
  movie: string;
  year: number;
  director: string;
  coordinates: [number, number];
  city: string;
  country: string;
  imageUrl: string;
  description: string;
  rarity: Rarity;
  xp: number;
  captureRadiusMeters: number;
}

export interface PlayerState {
  xp: number;
  level: number;
  capturedIds: string[];
}
