// components/product/purchase/PurchaseButtonPriceTag.tsx

import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import { PurchasableProduct } from "@/types";

import { ProductPrice } from "../display";

type Props = {
  product: PurchasableProduct;
};

export function PurchaseButtonPriceTag({ product }: Props) {
  return (
    <ThemedSurface
      theme="shade"
      h="$6"
      ai="center"
      jc="center"
      px="none"
      mr={-20}
      minWidth={80}
    >
      <ProductPrice
        productPrices={product.prices}
        productAvailability={product.availability}
      />
    </ThemedSurface>
  );
}
