// ProductImage.tsx (using the earlier refactor)
import { Galeria } from "@nandorojo/galeria";
import React from "react";
import { Dimensions } from "react-native";

import { ThemedYStack } from "@/components/ui/themed";
import { ThemedImage } from "@/components/ui/themed/ThemedImage";
import type { Product } from "@/domain/product/Product";
import { buildImageRenderPlan } from "@/lib/image/fit";

type ProductImageProps = {
  product: Product;
  imageWidthPx?: number;
  imageHeightPx?: number; // default 300
} & React.ComponentProps<typeof ThemedYStack>;

const DEFAULT_HEIGHT_PX = 300;

export const ProductImage = ({
  product,
  imageWidthPx,
  imageHeightPx = DEFAULT_HEIGHT_PX,
  ...stackProps
}: ProductImageProps) => {
  const { width: screenWidthPx } = Dimensions.get("window");
  const displayWidthPx = Math.max(1, Math.round(imageWidthPx ?? screenWidthPx));
  const displayHeightPx = Math.max(1, Math.round(imageHeightPx));

  const { uri, contentFit } = buildImageRenderPlan({
    image: product.featuredImage,
    displayWidthPx,
    displayHeightPx,
    defaultFit: "contain", // make contain the default here
  });

  return (
    <ThemedYStack
      w="100%"
      h={displayHeightPx}
      ov="hidden"
      boc="$borderColor"
      br="$3"
      {...stackProps}
    >
      <Galeria urls={[uri]}>
        <Galeria.Image>
          <ThemedImage
            w="100%"
            h="100%"
            uri={uri}
            title={product.name}
            contentFit={contentFit}
          />
        </Galeria.Image>
      </Galeria>
    </ThemedYStack>
  );
};
