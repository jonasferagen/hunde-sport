// components/product/purchase/PurchaseButtonPriceTag.tsx

import { ProductPrice } from "@/components/features/product/display/ProductPrice";
import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
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
      minWidth={80}
    >
      <ProductPrice purchasable={purchasable} />
    </ThemedSurface>
  );
}
/*
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
*/
