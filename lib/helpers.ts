import { tokens } from "@tamagui/config/v4";
import { DimensionValue } from "react-native";
import { getVariableValue } from "tamagui";

import appConfig from "@/tamagui/tamagui.config";

const placeholderBase64 =
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
  height?: DimensionValue,
  fit: "cover" | "contain" | "fill" | "inside" | "outside" = "cover"
): string => {
  const w = width != null ? parseDim(width) : null;
  const h = height != null ? parseDim(height) : null;

  const numWidth = w?.type === "px" ? w.value : 0;
  const numHeight = h?.type === "px" ? h.value : 0;

  if (!url) {
    return placeholderBase64;
  }

  // If we don't have any numeric pixel dimension, return the original URL (no resize)
  if (!numWidth && !numHeight) {
    try {
      // Still validate URL format
      const urlObject = new URL(url);
      return urlObject.toString();
    } catch (error) {
      console.error("Invalid URL:", url);
      return placeholderBase64;
    }
  }

  try {
    const urlObject = new URL(url);
    const params = new URLSearchParams();

    if (numWidth && numHeight) {
      params.set("resize", `${numWidth},${numHeight}`);
    } else if (numWidth) {
      params.set("w", String(numWidth));
    } else if (numHeight) {
      params.set("h", String(numHeight));
    }

    params.set("fit", fit);
    params.set("ssl", "1");

    urlObject.search = params.toString();
    return urlObject.toString();
  } catch (error) {
    console.error("Invalid URL:", url);
    return placeholderBase64;
  }
};

export const getAspectRatio = (
  width: DimensionValue | undefined,
  height: DimensionValue | undefined
): number => {
  const w = parseDim(width);
  const h = parseDim(height);

  if (!w || !h) return 1;
  if (h.value === 0) return 1;

  // Only compute when comparable units
  if (w.type === h.type) {
    return w.value / h.value;
  }

  // Mixed units (px vs %) — ambiguous; fallback
  return 1;
};

export function spacePx(token: string | number) {
  const key =
    typeof token === "string" && token.startsWith("$")
      ? token.slice(1)
      : String(token);

  const candidate =
    // try "$2", then "2", then 2
    (tokens.space as any)[`$${key}`] ??
    (tokens.space as any)[key] ??
    (tokens.space as any)[Number(key)];

  return Math.round(Number(getVariableValue(candidate ?? 0)));
}

export function resolveThemeToken(
  themeName: string,
  token: string = "background"
): string {
  const themeObj: any = (appConfig as any).themes?.["light_" + themeName];

  if (!themeObj) {
    if (__DEV__)
      console.warn(`[resolveThemeToken] theme not found: ${themeName}`);
    return "";
  }
  const v = themeObj[token];
  return String(getVariableValue(v));
}
