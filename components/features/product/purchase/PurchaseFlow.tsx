// components/product/purchase/PurchaseFlow.tsx
import React from "react";

import { Purchasable } from "@/domain/Purchasable";
import { openModal } from "@/stores/ui/modalStore";
import { type PurchasableProduct } from "@/types";

import { PurchaseButton } from "./PurchaseButton";

type Props = {
  product: PurchasableProduct;
};

export function PurchaseFlow({ product }: Props) {
  // UI-driven state (not domain):

  // Always construct the domain object from current UI state
  const purchasable = React.useMemo(
    () => Purchasable.create({ product }),
    [product],
  );

  return (
    <PurchaseButton
      purchasable={purchasable}
      onOpenCustomization={onOpenCustomization}
      onOpenVariations={onOpenVariations}
    />
  );
}

const onOpenCustomization = async (p: Purchasable) => {
  const { ProductCustomizationModal } = await import(
    "@/components/features/purchasable/ui/ProductCustomizationModal"
  );
  openModal((_, api) => (
    <ProductCustomizationModal purchasable={p} close={() => api.close()} />
  ));
};

const onOpenVariations = async (p: Purchasable) => {
  const { ProductVariationsModal } = await import(
    "@/components/features/product-variation/ProductVariationsModal"
  );
  openModal((_, api) => (
    <ProductVariationsModal purchasable={p} close={() => api.close()} />
  ));
};
