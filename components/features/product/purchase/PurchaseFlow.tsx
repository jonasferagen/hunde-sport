// components/product/purchase/PurchaseFlow.tsx
import React from "react";

import { ProductVariationsModal } from "@/components/features/product-variation/ProductVariationsModal";
import { ProductCustomizationModal } from "@/components/features/purchasable/ProductCustomizationModal";
import type { ProductVariation } from "@/domain/product/ProductVariation";
import type { VariationSelection } from "@/domain/product/VariationSelection";
import { Purchasable } from "@/domain/purchasable/Purchasable";
import { openModal } from "@/stores/ui/modalStore";
import type { PurchasableProduct } from "@/types";

import { PurchaseButton } from "./PurchaseButton";

type Props = {
  product: PurchasableProduct;
};

export function PurchaseFlow({ product }: Props) {
  // UI-driven state (not domain):
  const [selection, setSelection] = React.useState<
    VariationSelection | undefined
  >(undefined);
  const [selectedVar, setSelectedVar] = React.useState<
    ProductVariation | undefined
  >(undefined);
  const [customValues, setCustomValues] = React.useState<
    Record<string, string>
  >({});

  // Always construct the domain object from current UI state
  const purchasable = React.useMemo(
    () => new Purchasable(product, selection, selectedVar, customValues),
    [product, selection, selectedVar, customValues]
  );

  const onOpenVariations = React.useCallback(() => {
    openModal((_, api) => (
      <ProductVariationsModal
        purchasable={purchasable}
        close={() => api.close()}
        // NEW: let the modal return the new selection + resolved variation
        onDone={(
          nextSelection: VariationSelection,
          resolved?: ProductVariation
        ) => {
          setSelection(nextSelection);
          setSelectedVar(resolved);
          api.close();
        }}
      />
    ));
  }, [purchasable]);

  const onOpenCustomize = React.useCallback(() => {
    openModal((_, api) => (
      <ProductCustomizationModal
        purchasable={purchasable}
        initialValues={customValues}
        close={() => api.close()}
        // NEW: let the modal return the updated custom values
        onDone={(values: Record<string, string>) => {
          setCustomValues(values);
          api.close();
        }}
      />
    ));
  }, [purchasable, customValues]);

  return (
    <PurchaseButton
      purchasable={purchasable}
      onOpenVariations={onOpenVariations}
      onOpenCustomize={onOpenCustomize}
    />
  );
}
