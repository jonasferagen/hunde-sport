

// lib/image/dpr.ts
export type DprProvider = () => number;

let devicePixelRatioProvider: DprProvider = () => 1; // safe default for tests/Node

export function configureDprProvider(provider: DprProvider): void {
  devicePixelRatioProvider = provider;
}

/** Returns a positive DPR number; falls back to 1 if provider misbehaves. */
export function currentDpr(): number {
  const dpr = Number(devicePixelRatioProvider());
  return Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
}

