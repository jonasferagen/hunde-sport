import type { DimensionValue } from "react-native";

import { currentDpr } from "@/lib/image/dpr";

export const placeholderBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAEFJREFUCB1jYGBgYAAAAAQAAVcCkE0AAAAASUVORK5CYII=";

// Internal: parse DimensionValue into comparable units
// Not exported; used by image helpers below
const parseDim = (
  v: DimensionValue | undefined
): { type: "px" | "pct"; value: number } | null => {
  if (typeof v === "number" && isFinite(v)) return { type: "px", value: v };
  if (typeof v === "string") {
    const s = v.trim();
    if (/^-?\d+(?:\.\d+)?%$/.test(s))
      return { type: "pct", value: parseFloat(s) };
    if (/^-?\d+(?:\.\d+)?$/.test(s))
      return { type: "px", value: parseFloat(s) };
  }
  return null;
};


export const getScaledImageUrl = (
  url: string,
  width?: DimensionValue,
  height?: DimensionValue
): string => {
  if (!url) return placeholderBase64;

  const w = width != null ? parseDim(width) : null;
  const h = height != null ? parseDim(height) : null;

  const numW = w?.type === "px" ? Math.round(w.value) : 0;
  const numH = h?.type === "px" ? Math.round(h.value) : 0;

  try {
    const u = new URL(url);
    if (!numW && !numH) return u.toString();

    const dpr = currentDpr();
    const targetW = numW ? Math.round(numW * dpr) : 0;
    const targetH = numH ? Math.round(numH * dpr) : 0;

    const params = new URLSearchParams();
    if (targetW && targetH) params.set("resize", `${targetW},${targetH}`);
    else if (targetW) params.set("w", String(targetW));
    else if (targetH) params.set("h", String(targetH));

    params.set("ssl", "1");
    u.search = params.toString();
    return u.toString();
  } catch {
    console.error("Invalid URL:", url);
    return placeholderBase64;
  }
};


export type ImageFit = "cover" | "contain";

export type ChooseImageFitParams = {
  // Derived from StoreImage.getIntrinsicSize() when available
  imageAspect?: number;         // image width / height
  // From your layout
  displayWidth: number;         // px
  displayHeight?: number;       // px
  // Optional quality signal; if you only have a boolean, pass 0.0 for "low"
  qualityRatio?: number;        // intrinsicWidth / (displayWidth * dpr)
  // Policy knobs (all optional)
  panoramaThreshold?: number;   // default 2.2
  lowQualityThreshold?: number; // default 0.75
  defaultFit?: ImageFit;        // default "cover"
  preferWidthOnlyForContain?: boolean; // default true
};

export type ImageFitDecision = {
  fit: ImageFit;                // use for <ExpoImage contentFit=... />
  reason: "panorama" | "lowQuality" | "displayPanorama" | "default";
  // Suggested dims to pass to getScaledImageUrl (keep your helper unchanged)
  width: DimensionValue;
  height?: DimensionValue;      // omitted when width-only is recommended
};

/**
 * Decide renderer fit + how to call getScaledImageUrl for best results.
 * Keep URL scaling *semantic-free* (no fit=cover/contain in the query).
 */
export function chooseImageFit({
  imageAspect,
  displayWidth,
  displayHeight,
  qualityRatio,
  panoramaThreshold = 2.2,
  lowQualityThreshold = 0.75,
  defaultFit = "cover",
  preferWidthOnlyForContain = true,
}: ChooseImageFitParams): ImageFitDecision {
  const displayAspect = displayHeight ? displayWidth / displayHeight : undefined;

  // 1) Low quality guard wins (avoid stretching a too-small source)
  if (typeof qualityRatio === "number" && qualityRatio < lowQualityThreshold) {
    return preferWidthOnlyForContain
      ? { fit: "contain", reason: "lowQuality", width: displayWidth }
      : { fit: "contain", reason: "lowQuality", width: displayWidth, height: displayHeight ?? displayWidth };
  }

  // 2) Panorama image guard (very wide sources look better contained)
  if (typeof imageAspect === "number" && imageAspect >= panoramaThreshold) {
    return preferWidthOnlyForContain
      ? { fit: "contain", reason: "panorama", width: displayWidth }
      : { fit: "contain", reason: "panorama", width: displayWidth, height: displayHeight ?? displayWidth };
  }

  // 3) Panorama display guard (super-wide slots; optional)
  if (typeof displayAspect === "number" && displayAspect >= panoramaThreshold) {
    return preferWidthOnlyForContain
      ? { fit: "contain", reason: "displayPanorama", width: displayWidth }
      : { fit: "contain", reason: "displayPanorama", width: displayWidth, height: displayHeight ?? displayWidth };
  }

  // 4) Default: cover, and send both dims if you have them
  return displayHeight
    ? { fit: defaultFit, reason: "default", width: displayWidth, height: displayHeight }
    : { fit: defaultFit, reason: "default", width: displayWidth };
}
