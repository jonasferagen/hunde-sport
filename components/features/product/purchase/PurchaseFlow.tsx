// components/product/purchase/PurchaseFlow.tsx
import React from "react";

import { CustomField } from "@/domain/extensions/CustomField";
import type { ProductVariation } from "@/domain/product/ProductVariation";
import type { VariationSelection } from "@/domain/product/VariationSelection";
import { Purchasable, PurchasableData } from "@/domain/purchasable/Purchasable";

import { PurchaseButton } from "./PurchaseButton";

type Props = PurchasableData & {
  onSuccess?: () => void; // optional observer
};

export function PurchaseFlow({
  product,
  variationSelection: initialSelection,
  selectedVariation: initialSelectedVar,
  customFields: initialCustomFields,
  onSuccess,
}: Props) {
  // UI-driven state (not domain):
  const [selection, setSelection] = React.useState<
    VariationSelection | undefined
  >(initialSelection);
  const [selectedVar, setSelectedVar] = React.useState<
    ProductVariation | undefined
  >(initialSelectedVar);
  const [customFields, setCustomFields] = React.useState<
    CustomField[] | undefined
  >(initialCustomFields);

  // Always construct the domain object from current UI state
  const purchasable = React.useMemo(
    () => new Purchasable(product, selection, selectedVar, customFields),
    [product, selection, selectedVar, customFields]
  );

  return <PurchaseButton purchasable={purchasable} onSuccess={onSuccess} />;
}
