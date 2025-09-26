// TileSquare.tsx
import type { LinearGradientPoint } from "expo-linear-gradient";
import React, { useMemo } from "react";
import type { YStackProps } from "tamagui";

import {
  ThemedImage,
  ThemedLinearGradient,
  ThemedText,
  ThemedYStack,
} from "@/components/ui/themed";
import { ThemedSurface } from "@/components/ui/themed/ThemedSurface";
import type { StoreImage } from "@/domain/StoreImage";

type SquareTileProps = YStackProps & {
  title: string;
  image: StoreImage;
  /** Approx pixel width to request from CDN; avoids onLayout. */
  approxW?: number; // e.g. pass columnWidthPx if you have it
  showGradient?: boolean;
  titleLines?: number;
  onPress: () => void;
};

const GRADIENT_START: LinearGradientPoint = [0, 0.2];
const GRADIENT_END: LinearGradientPoint = [0, 0.9];

export const SquareTile = React.memo(function SquareTile({
  title,
  image,
  approxW = 200, // safe default; CDN can upscale/downscale
  children,
  onPress,
  showGradient = true,
  titleLines = 1,
  ...props
}: SquareTileProps) {
  // Ask your scaler for a square; skip measuring

  const uri = useMemo(
    () => image.getScaledUri(approxW, approxW),
    [image, approxW],
  );

  return (
    <ThemedSurface interactive={true} f={1} bw={1} onPress={onPress} {...props}>
      <ThemedYStack fullscreen>
        <ThemedImage uri={uri} title={title} contentFit="cover" />
        {children}
        {showGradient && (
          <ThemedYStack fullscreen t="auto" p="$2.5" jc="flex-end">
            <ThemedLinearGradient
              fullscreen
              start={GRADIENT_START}
              end={GRADIENT_END}
              opacity={0.8}
            />
            <ThemedText
              fow="bold"
              col="black"
              ta="center"
              ellipsizeMode="tail"
              fos="$2"
              numberOfLines={titleLines}
            >
              {title}
            </ThemedText>
          </ThemedYStack>
        )}
      </ThemedYStack>
    </ThemedSurface>
  );
});
