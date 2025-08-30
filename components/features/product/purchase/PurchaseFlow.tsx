// components/product/purchase/PurchaseFlow.tsx

import { Purchasable } from "@/domain/purchasable/Purchasable";
import type { PurchasableProduct } from "@/types";

import { PurchaseButton } from "./PurchaseButton";

type Props = {
  product: PurchasableProduct;
};

export function PurchaseFlow({ product }: Props) {
  // no selection / variation yet
  const purchasable = new Purchasable(product);

  return <PurchaseButton purchasable={purchasable} />;
}
