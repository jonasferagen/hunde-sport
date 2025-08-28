// PurchaseButton.tsx (view-only)
import React from "react";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { useAddToCartSimpleAction } from "@/hooks/useAddToCart";

import { ACTIONS, PriceTag, STATUS } from "./ButtonHelpers";

type PurchaseButtonBaseProps = {
  simpleProduct: SimpleProduct;
};

export const SimplePurchaseButton = React.memo(function SimplePurchaseButton({
  simpleProduct,
}: PurchaseButtonBaseProps) {
  const { isLoading, onPress } = useAddToCartSimpleAction({
    simpleProduct,
  });

  const { availability } = simpleProduct;
  const { isPurchasable } = availability;
  const disabled = !isPurchasable;

  const { theme, icon, label } = isPurchasable
    ? ACTIONS.buy
    : STATUS.unavailable;

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
