import React from "react";

import { ProductImage } from "@/components/features/product/display/ProductImage";
import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { ProductProvider, useProductContext } from "@/contexts/ProductContext";
import type { AttrKey } from "@/domain/product/Attribute";
import { AttributeSelection } from "@/domain/product/AttributeSelection";
import type { Term } from "@/domain/product/Term";
import { intersectSets } from "@/lib/util";
import { ProductVariation, Purchasable } from "@/types";

import { ProductVariationSelect } from "./ProductVariationSelect";

const IMAGE_H = 200;

type Props = {
  purchasable: Purchasable;
  close: () => void;
  onDone?: (selection: any, resolved?: ProductVariation) => void; // unchanged
};

export const ProductVariationsModal = ({ close, purchasable }: Props) => {
  return (
    <ProductProvider product={purchasable.product}>
      <ProductVariationsModalContent close={close} purchasable={purchasable} />
    </ProductProvider>
  );
};

export const ProductVariationsModalContent = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
  const { productVariations } = useProductContext();

  const variableProduct = purchasable.variableProduct;
  const initialProductVariation = purchasable.productVariation;

  const initialAttributeSelection = AttributeSelection.create(
    purchasable.variableProduct.attributes
  );
  const [attributeSelection, setAttributeSelection] =
    React.useState<AttributeSelection>(initialAttributeSelection!);

  const [productVariation, setProductVariation] = React.useState<
    ProductVariation | undefined
  >(initialProductVariation);

  const onSelect = (attrKey: AttrKey, term: Term | undefined) => {
    const newSelection = attributeSelection.with(attrKey, term);
    setAttributeSelection(newSelection);

    if (attributeSelection.isComplete()) {
      setProductVariation(undefined);
    }
    const sets = [];
    for (const term of attributeSelection.getTerms()) {
      const v = variableProduct.getVariationsByTerm(term!.key);
      sets.push(v);
    }
    const I = intersectSets(...sets);

    if (I.size === 0) {
      console.error("No matching variation found for terms");
      return;
    }
    const variation = Array.from(I)[0]; // Always set to first
    const productVariation = productVariations.get(variation!.key);
    setProductVariation(productVariation);
  };

  const newPurchasable = React.useMemo(
    () =>
      Purchasable.create({
        product: variableProduct,
        attributeSelection,
        productVariation,
      }),
    [variableProduct, attributeSelection, productVariation]
  );

  return (
    <ModalLayout
      title={variableProduct.name}
      onClose={close}
      footer={
        <ThemedYStack>
          <ThemedYStack mb="$3" />
          <PurchaseButton purchasable={newPurchasable} onSuccess={close} />
        </ThemedYStack>
      }
    >
      <ThemedYStack w="100%" h={IMAGE_H} mb="$3">
        <ProductImage product={variableProduct} img_height={IMAGE_H} />
      </ThemedYStack>
      <ProductVariationSelect
        attributeSelection={attributeSelection}
        onSelect={onSelect}
      />
    </ModalLayout>
  );
};
