// PurchaseButton.tsx (view-only)

import React from "react";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { Purchasable } from "@/domain/Product/Purchasable";
import { useAddToCartPurchasable } from "@/hooks/useAddToCart";

import { ACTIONS, PriceTag, STATUS } from "./ButtonHelpers";

type PurchaseButtonBaseProps = {
  purchasable: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
};

export const PurchasableButton = React.memo(function PurchasableButton({
  purchasable,
  onSuccess,
  onError,
}: PurchaseButtonBaseProps) {
  const { isLoading, onPress } = useAddToCartPurchasable(purchasable, {
    onSuccess,
  });
  const { availability } = purchasable;
  const { isPurchasable } = availability;
  const disabled = !isPurchasable;

  const { theme, icon, label } = isPurchasable
    ? ACTIONS.buy
    : STATUS.unavailable;

  const after = PriceTag({
    productPrices: purchasable.variableProduct.prices,
    productAvailability: purchasable.variableProduct.availability,
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
