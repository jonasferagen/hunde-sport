import type { DimensionValue } from "react-native";

import type { StoreImage } from "@/domain/StoreImage";

export type ImageRenderPlan = {
  uri: string;
  contentFit: ImageFit;
  reason: ImageFitDecision["reason"];
};

export type BuildImageRenderPlanParams = {
  image: StoreImage;
  displayWidthPx: number;
  displayHeightPx?: number;
  defaultFit?: ImageFit;
  panoramaThreshold?: number;
  lowQualityThreshold?: number;
  preferWidthOnlyForContain?: boolean;
};

type ImageFit = "cover" | "contain";

export type ChooseImageFitParams = {
  // Derived from StoreImage.getIntrinsicSize() when available
  imageAspect?: number; // image width / height
  displayWidth: number; // px
  displayHeight?: number; // px
  // Optional quality signal; if you only have a boolean, pass 0.0 for "low"
  qualityRatio?: number; // intrinsicWidth / (displayWidth * dpr)
  // Policy knobs (all optional)
  panoramaThreshold?: number; // default 2.2
  lowQualityThreshold: number; // default 0.75
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
