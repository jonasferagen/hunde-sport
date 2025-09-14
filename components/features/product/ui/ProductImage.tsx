import { Galeria } from "@nandorojo/galeria";
import React from "react";
import { Dimensions } from "react-native";
import type { YStackProps } from "tamagui";

import { ThemedYStack } from "@/components/ui/themed";
import { ThemedImage } from "@/components/ui/themed/ThemedImage";
import type { Product } from "@/domain/product/Product";

type ProductImageProps = YStackProps & {
  product: Product;
  /** Display height in px (caps the visible area). */
  imageHeightPx?: number;
  /** Display width in px; defaults to screen width. */
  imageWidthPx?: number;
  /** Client-side fit policy only (doesn't affect server scaling). */
  contentFit?: "cover" | "contain";
};

const DEFAULT_HEIGHT_PX = 300;

export const ProductImage = ({
  product,
  imageHeightPx = DEFAULT_HEIGHT_PX,
  imageWidthPx,
  contentFit = "cover",
  ...stackProps
}: ProductImageProps) => {
  const { width: screenWidthPx } = Dimensions.get("window");
  const displayWidthPx = Math.max(1, Math.round(imageWidthPx ?? screenWidthPx));

  const scaledUri = product.featuredImage.getScaledUri(displayWidthPx, 0);

  return (
    <ThemedYStack
      w="100%"
      h={imageHeightPx}
      ov="hidden"
      boc="$borderColor"
      br="$3"
      {...stackProps}
    >
      <Galeria urls={[scaledUri]}>
        <Galeria.Image>
          <ThemedImage
            w="100%"
            h="100%"
            uri={scaledUri}
            title={product.name}
            contentFit={contentFit}
          />
        </Galeria.Image>
      </Galeria>
    </ThemedYStack>
  );
};
