// components/product/purchase/PurchaseButtonPriceTag.tsx

import { ProductPrice } from "@/components/features/product/ui/ProductPrice";
import { ThemedSurface } from "@/components/ui/themed/ThemedSurface";
import type { Purchasable } from "@/types";

export function PurchaseButtonPriceTag({
  purchasable,
}: {
  purchasable: Purchasable;
}) {
  return (
    <ThemedSurface
      theme="shade"
      h="$6"
      ai="center"
      jc="center"
      px="none"
      mr={-20}
      minWidth={100}
    >
      <ProductPrice purchasable={purchasable} />
    </ThemedSurface>
  );
}
