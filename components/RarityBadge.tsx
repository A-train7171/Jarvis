import type { Rarity } from "@/types";
import { rarityLabel } from "@/lib/utils";

const ring: Record<Rarity, string> = {
  common: "border-rarity-common/40 bg-rarity-common/10 text-rarity-common",
  rare: "border-rarity-rare/40 bg-rarity-rare/10 text-rarity-rare",
  epic: "border-rarity-epic/40 bg-rarity-epic/10 text-rarity-epic",
  legendary:
    "border-rarity-legendary/40 bg-rarity-legendary/10 text-rarity-legendary",
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest ${ring[rarity]}`}
    >
      {rarityLabel(rarity)}
    </span>
  );
}
