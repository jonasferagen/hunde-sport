// TileSquare.tsx
import React, { useMemo } from "react";
import { PixelRatio } from "react-native";
import type { YStackProps } from "tamagui";

import { ThemedImage, ThemedLinearGradient, ThemedText, ThemedYStack } from "@/components/ui/themed";
import { ThemedSurface } from "@/components/ui/themed/ThemedSurface";
import type { StoreImage } from "@/domain/StoreImage";
import { getScaledImageUrl } from "@/lib/image/image";

type TileSquareProps = YStackProps & {
  title: string;
  image: StoreImage;
  /** Approx pixel width to request from CDN; avoids onLayout. */
  approxW?: number; // e.g. pass columnWidthPx if you have it
  showGradient?: boolean;
  titleLines?: number;
  onPress: () => void;
};

export const TileSquare = React.memo(function TileSquare({
  title,
  image,
  approxW = 200, // safe default; CDN can upscale/downscale
  children,
  onPress,
  showGradient = true,
  titleLines = 2,
  ...props
}: TileSquareProps) {
  // Ask your scaler for a square; skip measuring

  const dpr = Math.min(PixelRatio.get(), 2);
  const approxPx = Math.round(approxW * dpr);

  const uri = useMemo(() => getScaledImageUrl(image.src, approxPx, approxPx), [image.src, approxPx]);

  return (
    <ThemedSurface interactive={true} f={1} bw={1} onPress={onPress} {...props}>
      <ThemedYStack fullscreen>
        <ThemedImage uri={uri} title={title} contentFit="cover" />
        {children}
        {showGradient && (
          <ThemedYStack fullscreen t="auto" p="$2.5" jc="flex-end">
            <ThemedLinearGradient fullscreen start={[0, 0.2]} end={[0, 0.9]} opacity={0.8} />
            <ThemedText fow="bold" col="black" numberOfLines={titleLines} ellipse ta="center">
              {title}
            </ThemedText>
          </ThemedYStack>
        )}
      </ThemedYStack>
    </ThemedSurface>
  );
});
