import { Galeria } from "@nandorojo/galeria";
import { useMemo, useState } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import type { YStackProps } from "tamagui";
import { ScrollView, XStack, YStack } from "tamagui";

import { ThemedImage } from "@/components/ui/themed-components/ThemedImage";
import { Product } from "@/domain/product/Product";
import { getScaledImageUrl, spacePx } from "@/lib/helpers";

interface ProductImageGalleryProps extends YStackProps {
  product: Product;
  numColumns?: number;
}

export const ProductImageGallery = ({
  product,
  numColumns = 4,
  ...stackProps
}: ProductImageGalleryProps) => {
  const images = product.images;

  // gutters
  const GAP = "$2";
  const gapPx = spacePx(GAP);
  const half = Math.round(gapPx / 2);
  const colPct = `${100 / numColumns}%`;

  // layout
  const { width: screenW, height: screenH } = useWindowDimensions();
  const [containerW, setContainerW] = useState(0);

  // thumbnail size (grid)
  const thumbPx = useMemo(() => {
    const w = containerW || screenW;
    return Math.max(1, Math.floor(w / numColumns) - half * 2);
  }, [containerW, screenW, numColumns, half]);

  // device pixel ratio for full-screen requests
  const dpr = PixelRatio.get();

  // 1) URLs used by the **expanded** viewer (full-res)
  const fullUrls = useMemo(
    () =>
      images.map((img) =>
        // request at least the screen size in device pixels
        // (you can clamp to some max if your CDN supports it)
        getScaledImageUrl(
          img.src,
          Math.ceil(screenW * dpr),
          Math.ceil(screenH * dpr)
        )
      ),
    [images, screenW, screenH, dpr]
  );

  // 2) URLs used for the **thumbnails** in the grid
  const thumbUrls = useMemo(
    () => images.map((img) => getScaledImageUrl(img.src, thumbPx, thumbPx)),
    [images, thumbPx]
  );

  return (
    <YStack f={1} {...stackProps}>
      {/* IMPORTANT: pass full-res here */}
      <Galeria urls={fullUrls}>
        <ScrollView>
          <XStack
            fw="wrap"
            m={-half}
            onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
          >
            {images.map((_image, index) => (
              <YStack key={index} w={colPct} p={half}>
                <YStack w="100%" aspectRatio={1} br="$2" ov="hidden">
                  <Galeria.Image index={index}>
                    {/* Render low-res/thumb here */}
                    <ThemedImage
                      uri={thumbUrls[index]!}
                      title={product.name}
                      aspectRatio={1}
                      objectFit="cover"
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
