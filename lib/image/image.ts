// lib/image/image.ts
import type { DimensionValue } from "react-native";

import { getDevicePixelRatio } from "@/lib/image/dpr";

export const placeholderBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAEFJREFUCB1jYGBgYAAAAAQAAVcCkE0AAAAASUVORK5CYII=";

type ParsedDimPx =
  | { type: "px"; value: number }
  | { type: "pct"; value: number }
  | null;

const parseDim = (value: DimensionValue | undefined): ParsedDimPx => {
  if (typeof value === "number" && isFinite(value))
    return { type: "px", value };
  if (typeof value === "string") {
    const s = value.trim();
    if (/^-?\d+(?:\.\d+)?%$/.test(s))
      return { type: "pct", value: parseFloat(s) };
    if (/^-?\d+(?:\.\d+)?$/.test(s))
      return { type: "px", value: parseFloat(s) };
  }
  return null;
};

/**
 * Low-level builder that expects target sizes **already in device pixels**.
 * No DPR math is applied here.
 */
export const buildScaledImageUrlPx = (
  imageUrl: string,
  targetWidthPx?: number,
  targetHeightPx?: number,
): string => {
  if (!imageUrl) return placeholderBase64;
  try {
    const u = new URL(imageUrl);

    const w =
      Number.isFinite(targetWidthPx!) && (targetWidthPx as number) > 0
        ? Math.round(targetWidthPx as number)
        : 0;
    const h =
      Number.isFinite(targetHeightPx!) && (targetHeightPx as number) > 0
        ? Math.round(targetHeightPx as number)
        : 0;

    if (!w && !h) return u.toString();

    const params = new URLSearchParams();
    if (w && h) params.set("resize", `${w},${h}`);
    else if (w) params.set("w", String(w));
    else if (h) params.set("h", String(h));

    params.set("ssl", "1");
    u.search = params.toString();
    return u.toString();
  } catch {
    console.error("Invalid URL:", imageUrl);
    return placeholderBase64;
  }
};

/**
 * Convenience wrapper that accepts RN DimensionValue and applies **global DPR**.
 * Use this in UI code when you only know CSS-like sizes.
 */
export const getScaledImageUrl = (
  imageUrl: string,
  width?: DimensionValue,
  height?: DimensionValue,
): string => {
  if (!imageUrl) return placeholderBase64;

  const w = parseDim(width);
  const h = parseDim(height);

  // Only apply DPR to absolute pixel inputs; percentages are unknown here.
  const dpr = getDevicePixelRatio();
  const targetWidthPx = w?.type === "px" ? Math.round(w.value * dpr) : 0;
  const targetHeightPx = h?.type === "px" ? Math.round(h.value * dpr) : 0;

  return buildScaledImageUrlPx(imageUrl, targetWidthPx, targetHeightPx);
};

export type ImageFit = "cover" | "contain";

export type ChooseImageFitParams = {
  // Derived from StoreImage.getIntrinsicSize() when available
  imageAspect?: number; // image width / height
  // From your layout
  displayWidth: number; // px
  displayHeight?: number; // px
  // Optional quality signal; if you only have a boolean, pass 0.0 for "low"
  qualityRatio?: number; // intrinsicWidth / (displayWidth * dpr)
  // Policy knobs (all optional)
  panoramaThreshold?: number; // default 2.2
  lowQualityThreshold?: number; // default 0.75
  defaultFit?: ImageFit; // default "cover"
  preferWidthOnlyForContain?: boolean; // default true
};

export type ImageFitDecision = {
  fit: ImageFit; // use for <ExpoImage contentFit=... />
  reason: "panorama" | "lowQuality" | "displayPanorama" | "default";
  // Suggested dims to pass to getScaledImageUrl (keep your helper unchanged)
  width: DimensionValue;
  height?: DimensionValue; // omitted when width-only is recommended
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
  const displayAspect = displayHeight
    ? displayWidth / displayHeight
    : undefined;

  // 1) Low quality guard wins (avoid stretching a too-small source)
  if (typeof qualityRatio === "number" && qualityRatio < lowQualityThreshold) {
    return preferWidthOnlyForContain
      ? { fit: "contain", reason: "lowQuality", width: displayWidth }
      : {
          fit: "contain",
          reason: "lowQuality",
          width: displayWidth,
          height: displayHeight ?? displayWidth,
        };
  }

  // 2) Panorama image guard (very wide sources look better contained)
  if (typeof imageAspect === "number" && imageAspect >= panoramaThreshold) {
    return preferWidthOnlyForContain
      ? { fit: "contain", reason: "panorama", width: displayWidth }
      : {
          fit: "contain",
          reason: "panorama",
          width: displayWidth,
          height: displayHeight ?? displayWidth,
        };
  }

  // 3) Panorama display guard (super-wide slots; optional)
  if (typeof displayAspect === "number" && displayAspect >= panoramaThreshold) {
    return preferWidthOnlyForContain
      ? { fit: "contain", reason: "displayPanorama", width: displayWidth }
      : {
          fit: "contain",
          reason: "displayPanorama",
          width: displayWidth,
          height: displayHeight ?? displayWidth,
        };
  }

  // 4) Default: cover, and send both dims if you have them
  return displayHeight
    ? {
        fit: defaultFit,
        reason: "default",
        width: displayWidth,
        height: displayHeight,
      }
    : { fit: defaultFit, reason: "default", width: displayWidth };
}
