// @/bootstrap/index.ts
import { Image } from "react-native";

import { StoreImage } from "@/domain/StoreImage";
// (optional) if you add a DPR provider for your scaler:
// import { configureDprProvider } from "@/lib/image/runtime";

StoreImage.configureImageSizeProvider(
  (uri) =>
    new Promise((resolve, reject) =>
      Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject)
    )
);

// Optional: centralize DPR so tests or web shims can override easily
// configureDprProvider(() => PixelRatio.get());
