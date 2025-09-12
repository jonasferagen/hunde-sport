import React from "react";
import type { StackProps } from "tamagui";

import { PurchaseFlow } from "@/components/features/product/purchase/PurchaseFlow";
import { ThemedImage } from "@/components/ui/themed-components";
import { ThemedLinearGradient } from "@/components/ui/themed-components/ThemedLinearGradient";
import {
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui/themed-components/ThemedStacks";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { getScaledImageUrl } from "@/lib/image";
import type { PurchasableProduct } from "@/types";

import { ProductDescription } from "./ProductDescription";
import { ProductTitle } from "./ProductTitle";

interface ProductCardProps extends StackProps {
  product: PurchasableProduct;
}

const IMAGE_SIZE = 80;
export const ProductCard = React.memo(function ProductCard({
  product,
  ...props
}: ProductCardProps) {
  const { to } = useCanonicalNavigation();
  return (
    <ThemedYStack container box {...props}>
      <ThemedLinearGradient />
      <ThemedXStack
        onPress={() => {
          to("product", product);
        }}
      >
        <ProductCardImage product={product} />
        <ProductCardDescription product={product} />
      </ThemedXStack>
      <PurchaseFlow product={product} />
    </ThemedYStack>
  );
});

const ProductCardImage = ({ product }: { product: PurchasableProduct }) => {
  const uri = getScaledImageUrl(
    product.featuredImage.src,
    IMAGE_SIZE,
    IMAGE_SIZE
  );
  return (
    <ThemedYStack
      w={IMAGE_SIZE}
      h={IMAGE_SIZE}
      bw={1}
      boc="$borderColor"
      br="$3"
      ov="hidden"
    >
      <ThemedImage
        uri={uri}
        title={product.name}
        w={IMAGE_SIZE}
        h={IMAGE_SIZE}
      />
    </ThemedYStack>
  );
};

const ProductCardDescription = ({
  product,
  ...stackProps
}: StackProps & { product: PurchasableProduct }) => {
  return (
    <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
      <ThemedXStack gap="$2" ai="flex-start" jc="space-between">
        <ProductTitle size="$5" fs={1} product={product} />
      </ThemedXStack>
      <ProductDescription product={product} numberOfLines={2} fow="normal" />
    </ThemedYStack>
  );
};
