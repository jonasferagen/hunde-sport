// TileFixed.tsx (refined)
import type { ImageProps } from "expo-image";
import React from "react";
import type { YStackProps } from "tamagui";

import {
  ThemedImage,
  ThemedLinearGradient,
  ThemedText,
  ThemedYStack,
} from "@/components/ui/themed";
import { ThemedSurface } from "@/components/ui/themed/ThemedSurface";
import type { StoreImage } from "@/domain/StoreImage";

type FixedTileProps = YStackProps & {
  title: string;
  image: StoreImage;
  w: number;
  h: number;
  onPress?: () => void;
  showGradient?: boolean;
  titleLines?: number;
  imagePriority?: ImageProps["priority"];
  interactive?: boolean;
};

export const FixedTile = React.memo(function FixedTile({
  title,
  image,
  w,
  h,
  interactive,
  onPress,
  imagePriority,
  showGradient = true,
  titleLines = 1,
  children,
  ...props
}: FixedTileProps) {
  const uri = React.useMemo(() => image.getScaledUri(w, h), [image, w, h]);
  return (
    <ThemedSurface
      w={w}
      h={h}
      f={1}
      interactive={true}
      onPress={onPress}
      {...props}
    >
      <ThemedImage
        priority={imagePriority}
        uri={uri}
        title={title}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={uri}
        w="100%"
        h="100%"
        br="$3"
      />

      {/* overlays shouldn't block taps */}
      {showGradient && (
        <ThemedYStack
          fullscreen
          t="auto"
          p="$2.5"
          pointerEvents="none"
          ai="center"
          jc="center"
          h={50}
        >
          <ThemedLinearGradient
            fullscreen
            start={[0, 0.2]}
            end={[0, 0.9]}
            opacity={0.8}
            pointerEvents="none"
          />
          <ThemedText bold col="$color" numberOfLines={2} lh={16} ta="center">
            {title}
          </ThemedText>
        </ThemedYStack>
      )}
      {children}
    </ThemedSurface>
  );
});
