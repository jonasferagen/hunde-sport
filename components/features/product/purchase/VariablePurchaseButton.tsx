// PurchaseButton.tsx (view-only)
import React from "react";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { openModal } from "@/stores/ui/modalStore";

import { ProductVariationsModal } from "../../product-variation/ProductVariationsModal";
import { PriceTag, STATUS } from "./ButtonHelpers";

type PurchaseButtonBaseProps = {
  variableProduct: VariableProduct;
};

export const VariablePurchaseButton = React.memo(
  function VariablePurchaseButton({
    variableProduct,
  }: PurchaseButtonBaseProps) {
    const onPress = () =>
      openModal(
        (payload, api) => (
          <ProductVariationsModal
            variableProduct={variableProduct}
            close={() => api.close()}
          />
        ),
        variableProduct
      );

    const { availability } = variableProduct;
    const { isPurchasable } = availability;
    const disabled = !isPurchasable;

    const { theme, icon, label } = isPurchasable
      ? STATUS.list
      : STATUS.unavailable;

    const after = PriceTag({
      productPrices: variableProduct.prices,
      productAvailability: variableProduct.availability,
    });

    return (
      <CallToActionButton
        onPress={onPress}
        before={icon}
        theme={theme}
        label={label}
        after={after}
        loading={false}
        disabled={disabled}
      />
    );
  }
);
