import { TIER_META, Tier } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";

export function RarityBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier];
  const tone = tier === "background"
    ? "neutral"
    : tier === "featured"
    ? "warm"
    : tier === "iconic"
    ? "primary"
    : tier === "landmark"
    ? "cool"
    : "gold";
  return <Badge tone={tone}>{meta.label}</Badge>;
}
