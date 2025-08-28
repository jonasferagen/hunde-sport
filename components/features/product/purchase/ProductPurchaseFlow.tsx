import React from "react";

import { PurchasableProduct, SimpleProduct, VariableProduct } from "@/types";

import { SimplePurchaseButton } from "./SimplePurchaseButton";
import { VariablePurchaseButton } from "./VariablePurchaseButton";

export const ProductPurchaseFlow = ({
  product,
}: {
  product: PurchasableProduct;
}) => {
  if (product.isSimple) {
    return <SimplePurchaseButton simpleProduct={product as SimpleProduct} />;
  }

  if (product.isVariable) {
    return (
      <VariablePurchaseButton variableProduct={product as VariableProduct} />
    );
  }

  throw new Error("Invalid product");
};
