// lib/image/fit.ts

import type {
  BuildImageRenderPlanParams,
  ChooseImageFitParams,
  ImageFitDecision,
  ImageRenderPlan,
} from "@/lib/image/types";


/** Your pure policy function (place the full body you have here) */
function chooseImageFit({
  imageAspect,
  displayWidth,
  displayHeight,
  qualityRatio,
  panoramaThreshold = 1.8,
  lowQualityThreshold = 0.75,
  defaultFit = "contain",
  preferWidthOnlyForContain = true,
}: ChooseImageFitParams): ImageFitDecision {
  const displayAspect =
    typeof displayHeight === "number"
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

  // 4) Default: use requested fit, send both dims when available
  return typeof displayHeight === "number"
    ? {
        fit: defaultFit,
        reason: "default",
        width: displayWidth,
        height: displayHeight,
      }
    : { fit: defaultFit, reason: "default", width: displayWidth };
}

/**
 * Adapter for components: make a concrete render plan from a StoreImage + display box.
 * - Uses cached intrinsic size if present (won't trigger async fetch).
 * - DPR taken from the global provider (no double-application).
 * - Returns a URI *and* the `contentFit` to pass to your <ThemedImage />.
 */

export function buildImageRenderPlan({
  image,
  displayWidthPx,
  displayHeightPx,
  defaultFit = "cover",
  panoramaThreshold,
  lowQualityThreshold = 0.75,
  preferWidthOnlyForContain,
}: BuildImageRenderPlanParams): ImageRenderPlan {
  // Optional quality signal (only if we already know intrinsic size)
  //const dpr = getDevicePixelRatio();
  // We only use cached size to keep this sync. If unknown, leave undefined.
  const aspect = image.aspectRatio;

  // The class doesn't expose cached width directly; use a heuristic:
  // when aspect is known and either width/height was cached, the width is not surfaced.
  // If you later expose a `getCachedIntrinsicWidth()` we can improve this.
  // For now, omit quality if intrinsic width is unknown.
  let qualityRatio: number | undefined = undefined;
  // If you decide to expose cached width in StoreImage later:
  // qualityRatio = image.getCachedIntrinsicWidth?.() ? image.getCachedIntrinsicWidth()! / (displayWidthPx * dpr) : undefined;

  const decision = chooseImageFit({
    imageAspect: aspect,
    displayWidth: displayWidthPx,
    displayHeight: displayHeightPx,
    qualityRatio,
    defaultFit,
    panoramaThreshold,
    lowQualityThreshold,
    preferWidthOnlyForContain,
  });

  // Map decision to actual scaled URI.
  // Width-only: pass height=0 so StoreImage generates ?w=...
  // Box (cover-like on server): pass both if you *intentionally* want cropping (using Jetpack resize).
  // With our current scaler (width-only preferred), we pass 0 when decision.height is omitted.
  // lib/image/fit.ts
  const wantWidthPx = displayWidthPx;
  const wantHeightPx =
    decision.height != null
      ? (displayHeightPx ?? 0)
      : (undefined as unknown as number);
  // or overload getScaledUri to accept `displayHeightPx?: number`
  const uri = image.getScaledUri(wantWidthPx, wantHeightPx);

  return {
    uri,
    contentFit: decision.fit,
    reason: decision.reason,
  };
}
