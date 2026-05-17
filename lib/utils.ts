export function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function tierLabel(tier: string) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
