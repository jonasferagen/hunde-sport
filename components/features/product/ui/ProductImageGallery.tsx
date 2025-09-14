import { Galeria } from "@nandorojo/galeria";
import React, { useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import type { YStackProps } from "tamagui";
import { ScrollView, XStack, YStack } from "tamagui";

import { ThemedImage } from "@/components/ui/themed/ThemedImage";
import type { Product } from "@/domain/product/Product";
import type { StoreImage } from "@/domain/StoreImage";
import { spacePx } from "@/lib/theme";

interface ProductImageGalleryProps extends YStackProps {
  product: Product;
  numColumns?: number;
}

export const ProductImageGallery = ({
  product,
  numColumns = 4,
  ...stackProps
}: ProductImageGalleryProps) => {
  const images: StoreImage[] = product.images;

  // gutters
  const GAP_TOKEN = "$2";
  const gapPx = spacePx(GAP_TOKEN);
  const halfGapPx = Math.round(gapPx / 2);
  const columnWidthPercent = `${100 / numColumns}%`;

  // layout
  const { width: screenWidthPx, height: screenHeightPx } =
    useWindowDimensions();
  const [containerWidthPx, setContainerWidthPx] = useState(0);

  // thumbnail size (grid)
  const thumbSizePx = useMemo(() => {
    const widthPx = containerWidthPx || screenWidthPx;
    return Math.max(1, Math.floor(widthPx / numColumns) - halfGapPx * 2);
  }, [containerWidthPx, screenWidthPx, numColumns, halfGapPx]);

  // 1) URIs for the expanded viewer (request at least screen size in device pixels)
  const fullImageUris = useMemo(
    () =>
      images.map((storeImage) =>
        storeImage.getScaledUri(
          Math.ceil(screenWidthPx),
          Math.ceil(screenHeightPx),
        ),
      ),
    [images, screenWidthPx, screenHeightPx],
  );

  // 2) URIs for grid thumbnails (square)
  const thumbImageUris = useMemo(
    () =>
      images.map((storeImage) =>
        storeImage.getScaledUri(thumbSizePx, thumbSizePx),
      ),
    [images, thumbSizePx],
  );

  return (
    <YStack f={1} {...stackProps}>
      {/* IMPORTANT: pass full-res here */}
      <Galeria urls={fullImageUris}>
        <ScrollView>
          <XStack
            fw="wrap"
            m={-halfGapPx}
            onLayout={(e) => setContainerWidthPx(e.nativeEvent.layout.width)}
          >
            {images.map((_storeImage: StoreImage, imageIndex: number) => (
              <YStack key={imageIndex} w={columnWidthPercent} p={halfGapPx}>
                <YStack w="100%" aspectRatio={1} br="$2" ov="hidden">
                  <Galeria.Image index={imageIndex}>
                    <ThemedImage
                      uri={thumbImageUris[imageIndex]!}
                      title={product.name}
                      aspectRatio={1}
                      contentFit="cover"
                      w="100%"
                      h="100%"
                    />
                  </Galeria.Image>
                </YStack>
              </YStack>
            ))}
          </XStack>
        </ScrollView>
      </Galeria>
    </YStack>
  );
};
