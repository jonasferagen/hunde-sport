import React from "react";

import { ProductImage } from "@/components/features/product/display/ProductImage";
import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { ProductProvider, useProductContext } from "@/contexts/ProductContext";
import type { Variation } from "@/domain/product";
import type { AttrKey } from "@/domain/product/Attribute";
import { AttributeSelection } from "@/domain/product/AttributeSelection";
import type { Term } from "@/domain/product/Term";
import { ProductVariation, Purchasable, VariableProduct } from "@/types";

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
  const { product, productVariations } = useProductContext();

  const variableProduct = product as VariableProduct;

  const initialAttributeSelection = AttributeSelection.create(
    purchasable.variableProduct.attributes
  );

  const [attributeSelection, setAttributeSelection] =
    React.useState<AttributeSelection>(initialAttributeSelection!);

  const onSelect = (attrKey: AttrKey, term: Term | undefined) => {
    const newSelection = attributeSelection.with(attrKey, term);
    setAttributeSelection(newSelection);
  };

  const resolveProductVariation = React.useMemo(
    () => (variation: Variation) => {
      return productVariations.get(variation.key);
    },
    [productVariations]
  );

  const newPurchasable = React.useMemo(
    () =>
      Purchasable.create({
        product: variableProduct,
        attributeSelection,
        resolveProductVariation,
      }),
    [variableProduct, attributeSelection, resolveProductVariation]
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
