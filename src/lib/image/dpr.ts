// lib/image/dpr.ts
let devicePixelRatioProviderFn: () => number = () => 1;

export function configureDprProvider(providerFn: () => number): void {
  devicePixelRatioProviderFn = providerFn;
}

export function getDevicePixelRatio(): number {
  try {
    const dpr = Number(devicePixelRatioProviderFn());
    return Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
  } catch {
    return 1;
  }
}
