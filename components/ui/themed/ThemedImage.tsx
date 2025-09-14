// ThemedImage.tsx
import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from "expo-image";
import { memo, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { type YStackProps } from "tamagui";

type Fit = NonNullable<ExpoImageProps["contentFit"]>;

export interface ThemedImageProps extends YStackProps {
  title?: string;
  uri: string;
  /** 'cover' is typical for tiles */
  contentFit?: Fit;
  /** Let the *parent* control aspect via wrapper; only use if no explicit height */
  aspectRatio?: number;
  /** Optional: show a spinner overlay while decoding */
  showSpinner?: boolean;
  /** Optional: small fade for UX (0 = off for max perf) */
  transitionMs?: number; // default 0
  /** Image cache policy */
  cachePolicy?: ExpoImageProps["cachePolicy"];
  /** Download priority */
  priority?: ExpoImageProps["priority"];
  /** Recycling key to help reuse underlying textures (defaults to uri) */
  recyclingKey?: string;
  /** Border radius applied directly to bitmap (faster than overflow: hidden) */
  borderRadiusPx?: number;
  /** Background color for image, should probably be white or transparent */
  bg?: string;
}

/** Ultra-light image for lists/tiles. */
export const ThemedImage = memo(function ThemedImage({
  title,
  uri,
  contentFit = "contain",
  aspectRatio,
  showSpinner = false,
  transitionMs = 0, // keep 0 in lists for perf
  cachePolicy = "memory-disk",
  priority = "normal",
  recyclingKey,
  borderRadiusPx,
  bg = "white",
  w = "100%",
  h = "100%",
}: ThemedImageProps) {
  const [loading, setLoading] = useState(showSpinner);

  // Build a stable style once; avoid mixing aspectRatio with explicit height.
  const style = useMemo(() => {
    const s: any = [styles.fill];
    if (borderRadiusPx) s.push({ borderRadius: borderRadiusPx });
    if (aspectRatio && (h === undefined || h === "auto")) {
      s.push({ aspectRatio });
    }
    return s;
  }, [aspectRatio, borderRadiusPx, h]);

  return (
    <View
      style={[
        { width: w as any, height: h as any, backgroundColor: bg },
        style,
      ]}
    >
      <ExpoImage
        source={uri ? { uri } : undefined}
        accessibilityLabel={title}
        style={style}
        contentFit={contentFit}
        transition={transitionMs}
        cachePolicy={cachePolicy}
        recyclingKey={recyclingKey ?? uri}
        priority={priority}
        // Use a tiny placeholder instead of Moti fade/state when you can:
        placeholder={transitionMs === 0 && !showSpinner ? undefined : undefined}
        onLoadStart={showSpinner ? () => setLoading(true) : undefined}
        onLoadEnd={showSpinner ? () => setLoading(false) : undefined}
      />
      {showSpinner && loading && (
        <View style={styles.spinner}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
