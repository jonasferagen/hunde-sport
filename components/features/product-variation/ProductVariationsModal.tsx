import React from "react";

import { ProductImage } from "@/components/features/product/display/ProductImage";
import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import {
  useVariableProduct,
  VariableProductProvider,
} from "@/contexts/VariableProductContext";
import { AttributeSelection, Term } from "@/domain/product/helpers/types";
import { useProductVariations } from "@/hooks/data/Product";
import { Purchasable, VariableProductVariant } from "@/types";

import { ProductVariationSelect } from "./ProductVariationSelect";

const IMAGE_H = 200;

type Props = {
  purchasable: Purchasable;
  close: () => void;
  onDone?: (selection: any, resolved?: VariableProductVariant) => void; // unchanged
};

export const ProductVariationsModal = ({ close, purchasable }: Props) => {
  const variableProduct = purchasable.variableProduct;

  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  return (
    <VariableProductProvider
      variableProduct={variableProduct}
      productVariations={productVariations}
      isLoading={isLoading}
    >
      <ProductVariationsModalContent close={close} />
    </VariableProductProvider>
  );
};

export const ProductVariationsModalContent = ({
  close,
}: {
  close: () => void;
}) => {
  const { variableProduct, productVariations } = useVariableProduct();

  const { attributes } = variableProduct;
  const initialAttributeSelection = AttributeSelection.create(attributes);
  const [attributeSelection, setAttributeSelection] =
    React.useState<AttributeSelection>(initialAttributeSelection);

  const map = new Map<string, VariableProductVariant>();
  const pvMap = productVariations.forEach((pv) => {
    const id = String(pv.id);
    map.set(id, pv);
  });

  const onSelect = (attrKey: string, term: Term | undefined) => {
    const newSelection = attributeSelection.with(attrKey, term);

    setAttributeSelection(newSelection);
  };

  const purchasable = React.useMemo(() => {
    return new Purchasable({
      product: variableProduct,
      attributeSelection,
    });
  }, [variableProduct, attributeSelection]);

  return (
    <ModalLayout
      title={variableProduct.name}
      onClose={close}
      footer={
        <ThemedYStack>
          <ThemedYStack mb="$3" />
          <PurchaseButton purchasable={purchasable} onSuccess={close} />
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
