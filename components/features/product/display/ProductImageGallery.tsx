import { Galeria } from "@nandorojo/galeria";
import { useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { ScrollView, XStack, YStack, YStackProps } from "tamagui";

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
  const { width: screenWidth } = Dimensions.get("window");
  const images = product.images;

  const [gallery, setGallery] = useState({ visible: false, initialIndex: 0 });
  const openGallery = (index: number) =>
    setGallery({ visible: true, initialIndex: index });

  const [containerW, setContainerW] = useState(0);

  // gutters
  const GAP = "$2";
  const gapPx = spacePx(GAP);
  const half = Math.round(gapPx / 2);

  // % width per column
  const colPct = `${100 / numColumns}%`;

  // pixel size to request for thumbnails (container width / cols minus padding)
  const thumbPx = useMemo(() => {
    const w = containerW || screenWidth; // fallback avoids 0 on first render
    return Math.max(1, Math.floor(w / numColumns) - half * 2);
  }, [containerW, screenWidth, numColumns, half]);

  const galleryUrls = useMemo(
    () => images.map((img) => getScaledImageUrl(img.src, thumbPx, thumbPx)),
    [images, thumbPx]
  );

  return (
    <YStack f={1} {...stackProps}>
      <Galeria urls={galleryUrls}>
        <ScrollView>
          <XStack
            fw="wrap"
            m={-half} // equal outer trim on all sides
            onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
          >
            {images.map((image, index) => (
              <YStack key={index} w={colPct} p={half}>
                {/* Inner square: borders/radius here so padding doesn't affect math */}
                <YStack
                  w="100%"
                  aspectRatio={1}
                  br="$2"
                  ov="hidden"
                  onPress={() => openGallery(index)}
                >
                  <Galeria.Image index={index}>
                    <ThemedImage
                      uri={galleryUrls[index]}
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
