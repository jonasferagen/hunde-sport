// lib/image/image.ts

const placeholderBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAEFJREFUCB1jYGBgYAAAAAQAAVcCkE0AAAAASUVORK5CYII=";

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
