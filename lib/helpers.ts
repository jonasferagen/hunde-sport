import { tokens } from "@tamagui/config/v4";
import type { DimensionValue } from "react-native";
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

    // Always rewrite the query to avoid inheriting Jetpack’s existing fit=X,Y
    const params = new URLSearchParams();

    if (numW && numH) {
      params.set("resize", `${numW},${numH}`);
    } else if (numW) {
      params.set("w", String(numW));
    } else if (numH) {
      params.set("h", String(numH));
    } else {
      // no numeric dims provided → just return a validated URL
      return u.toString();
    }

    // Jetpack likes ssl=1; keep it, but DO NOT set `fit=cover/contain`
    params.set("ssl", "1");

    u.search = params.toString();
    return u.toString();
  } catch {
    console.error("Invalid URL:", url);
    return placeholderBase64;
  }
};


