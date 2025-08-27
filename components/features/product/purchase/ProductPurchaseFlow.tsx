import React from "react";

import { openModal } from "@/stores/ui/modalStore";
import {
  createPurchasable,
  Purchasable,
  PurchasableProduct,
  VariableProduct,
} from "@/types";

import { ProductVariationsModal } from "../../product-variation/ProductVariationsModal";
import { PurchaseButtonSmart } from "./PurchaseButtonSmart";

export const ProductPurchaseFlow = ({
  product,
}: {
  product: PurchasableProduct;
}) => {
  const purchasable = React.useMemo(
    () => createPurchasable({ product, productVariation: undefined }),
    [product]
  );

  const onRequestVariation = (variableProduct: VariableProduct) =>
    openModal(
      (payload, api) => (
        <ProductVariationsModal
          variableProduct={variableProduct}
          close={() => api.close()}
        />
      ),
      purchasable
    );

  return (
    <PurchaseButtonSmart
      purchasable={purchasable}
      onRequestVariation={onRequestVariation}
    />
  );
};
