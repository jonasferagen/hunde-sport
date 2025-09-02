// components/product/purchase/PurchaseButtonPriceTag.tsx

import { ProductPrice } from "@/components/features/product/display/ProductPrice";
import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import { type PurchasableProduct } from "@/types";

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

export function PurchaseButtonRight({ children }: any) {
  return (
    <ThemedSurface
      theme="tint"
      h="$6"
      ai="center"
      jc="center"
      px="none"
      mr={-20}
      minWidth={80}
    >
      {children}
    </ThemedSurface>
  );
}
