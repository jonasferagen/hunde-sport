// components/product/purchase/PurchaseButton.tsx
import React from "react";

import { ProductVariationsModal } from "@/components/features/product-variation/ProductVariationsModal";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import type { Purchasable } from "@/domain/Purchasable";
import { useAddToCart } from "@/hooks/useAddToCart";
import { openModal } from "@/stores/ui/modalStore";

import { resolvePriceTag, resolveStatus } from "./ButtonHelpers";

type Props = {
  purchasable: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
};

export const PurchaseButton = React.memo(function PurchaseButton({
  purchasable,
  onSuccess,
  onError,
}: Props) {
  const product = purchasable.product;

  // SIMPLE → add directly
  if (product.isSimple) {
    const { isLoading, onPress } = useAddToCart(purchasable, {
      onSuccess,
      onError,
    });
    const ui = resolveStatus(product);
    const after = resolvePriceTag(product);
    return (
      <CallToActionButton
        onPress={onPress}
        before={ui.icon}
        theme={ui.theme}
        label={ui.label}
        after={after}
        loading={isLoading}
        disabled={ui.disabled}
      />
    );
  }

  // VARIABLE + NO selection context yet → open modal
  if (product.isVariable && !purchasable.variationSelection) {
    const onPress = () =>
      openModal(
        (_, api) => (
          <ProductVariationsModal
            purchasable={purchasable}
            close={() => api.close()}
          />
        ),
        purchasable
      );
    const ui = resolveStatus(product); // STATUS.list
    const after = resolvePriceTag(product);
    return (
      <CallToActionButton
        onPress={onPress}
        before={ui.icon}
        theme={ui.theme}
        label={ui.label}
        after={after}
        loading={false}
        disabled={ui.disabled}
      />
    );
  }

  // VARIABLE + selection context exists
  if (product.isVariable && purchasable.variationSelection) {
    // If a concrete variation is resolved → add to cart
    if (purchasable.selectedVariation) {
      const { isLoading, onPress } = useAddToCart(purchasable, {
        onSuccess,
        onError,
      });
      const ui = resolveStatus(product, purchasable);
      const after = resolvePriceTag(product);
      return (
        <CallToActionButton
          onPress={onPress}
          before={ui.icon}
          theme={ui.theme}
          label={ui.label}
          after={after}
          loading={isLoading}
          disabled={ui.disabled}
        />
      );
    }

    // Selection exists but not resolved → guidance (disabled)
    const ui = resolveStatus(product, purchasable);
    const after = resolvePriceTag(product);
    return (
      <CallToActionButton
        onPress={() => {}}
        before={ui.icon}
        theme={ui.theme}
        label={ui.label}
        after={after}
        loading={false}
        disabled={ui.disabled}
      />
    );
  }

  return null;
});
