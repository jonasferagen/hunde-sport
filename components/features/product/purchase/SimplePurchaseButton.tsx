// PurchaseButton.tsx (view-only)
import React from "react";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { useAddToCartSimple } from "@/hooks/useAddToCart";

import { PriceTag, resolveStatus } from "./ButtonHelpers";

type PurchaseButtonBaseProps = {
  simpleProduct: SimpleProduct;
};

export const SimplePurchaseButton = React.memo(function SimplePurchaseButton({
  simpleProduct,
}: PurchaseButtonBaseProps) {
  const { isLoading, onPress } = useAddToCartSimple(simpleProduct, {
    onSuccess: () => close?.(),
  });

  const { theme, icon, label, disabled } = resolveStatus(
    simpleProduct.availability
  );

  const after = PriceTag({
    productPrices: simpleProduct.prices,
    productAvailability: simpleProduct.availability,
  });

  return (
    <CallToActionButton
      onPress={onPress}
      before={icon}
      theme={theme}
      label={label}
      after={after}
      loading={isLoading}
      disabled={disabled}
    />
  );
});
