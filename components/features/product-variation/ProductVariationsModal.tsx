import React from "react";

import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ProductImage } from "@/components/features/product/ui/ProductImage";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { ThemedYStack } from "@/components/ui/themed";
import { ProductProvider, useProductProvider } from "@/contexts";
import type { AttrKey } from "@/domain/product-attributes/Attribute";
import { AttributeSelection } from "@/domain/product-attributes/AttributeSelection";
import type { Term } from "@/domain/product-attributes/Term";
import { openModal } from "@/stores/ui/modalStore";
import { Purchasable } from "@/types";

import { ProductVariationSelect } from "./ProductVariationSelect";

const IMAGE_H = 200;

type Props = {
  purchasable: Purchasable;
  close: () => void;
};

export const ProductVariationsModal = ({ close, purchasable }: Props) => {
  return (
    <ProductProvider product={purchasable.variableProduct}>
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
  const { productVariations } = useProductProvider();
  const variableProduct = purchasable.variableProduct;

  const initialAttributeSelection = AttributeSelection.create(
    purchasable.variableProduct.attributes,
  );
  const [attributeSelection, setAttributeSelection] =
    React.useState<AttributeSelection>(initialAttributeSelection!);

  const resolveProductVariation = React.useMemo(
    () => (attributeSelection: AttributeSelection) => {
      if (!attributeSelection.isComplete()) {
        return undefined;
      }
      const variation = variableProduct.findVariation(attributeSelection);
      return productVariations.get(variation!.key);
    },
    [variableProduct, productVariations],
  );

  const onSelect = (attrKey: AttrKey, term: Term | undefined) => {
    const newSelection = attributeSelection.with(attrKey, term);
    setAttributeSelection(newSelection);
  };

  const newPurchasable = React.useMemo(
    () =>
      Purchasable.create({
        product: variableProduct,
        attributeSelection,
        productVariation: resolveProductVariation(attributeSelection),
      }),
    [variableProduct, attributeSelection, resolveProductVariation],
  );

  return (
    <ModalLayout
      title={variableProduct.name}
      onClose={close}
      footer={
        <ThemedYStack>
          <ThemedYStack mb="$3" />
          <PurchaseButton
            purchasable={newPurchasable}
            onSuccess={close}
            onOpenCustomization={onOpenCustomization}
          />
        </ThemedYStack>
      }
    >
      <ThemedYStack w="100%" h={IMAGE_H} mb="$3">
        <ProductImage product={variableProduct} imageHeightPx={IMAGE_H} />
      </ThemedYStack>
      <ProductVariationSelect
        attributeSelection={attributeSelection}
        onSelect={onSelect}
      />
    </ModalLayout>
  );
};
const onOpenCustomization = async (p: Purchasable) => {
  const { ProductCustomizationModal } = await import(
    "@/components/features/purchasable/ProductCustomizationModal"
  );
  openModal((_, api) => (
    <ProductCustomizationModal purchasable={p} close={() => api.close()} />
  ));
};
