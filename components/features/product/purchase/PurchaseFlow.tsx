// components/product/purchase/PurchaseFlow.tsx
import React from "react";

import { Purchasable } from "@/domain/Purchasable";
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
    [product]
  );

  return <PurchaseButton purchasable={purchasable} />;
}
