// PurchaseButton.tsx (view-only)

import React from "react";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { Purchasable } from "@/domain/Purchasable";
import { useAddToCartPurchasable } from "@/hooks/useAddToCart";

import { PriceTag, resolveStatus } from "./ButtonHelpers";

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

  const { theme, icon, label, disabled } = resolveStatus(
    purchasable.variableProduct.availability,
    purchasable
  );

  const after = PriceTag({
    productPrices: purchasable.variableProduct.prices,
    productAvailability: purchasable.variableProduct.availability,
  });

  return (
    <CallToActionButton
      onPress={onPress}
      before={icon}
      theme={theme}
      label={flabel}
      after={after}
      loading={isLoading}
      disabled={disabled}
    />
  );
});
