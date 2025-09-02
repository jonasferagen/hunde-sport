import { PurchaseButton } from "@/components/features/product/purchase/PurchaseButton";
import { ThemedYStack } from "@/components/ui";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { VariableProductProvider } from "@/contexts/VariableProductContext";
import {
  useVariationSelection,
  VariationSelectionProvider,
} from "@/contexts/VariationSelectionContext";
import { useProductVariations } from "@/hooks/data/Product";
import { ProductVariation, Purchasable, VariableProduct } from "@/types";

import { ProductImage } from "@/components/features/product/display/ProductImage";
import { ProductVariationSelect } from "./ProductVariationSelect";

type Props = {
  purchasable: Purchasable;
  close: () => void;
  onDone?: (selection: any, resolved?: ProductVariation) => void; // unchanged
};

export const ProductVariationsModal = ({ close, purchasable }: Props) => {
  const variableProduct = purchasable.product as VariableProduct;
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  return (
    <VariableProductProvider
      variableProduct={variableProduct}
      productVariations={productVariations}
      isLoading={isLoading}
    >
      <VariationSelectionProvider
        initialSelection={purchasable.variationSelection}
      >
        <ProductVariationsModalContent close={close} />
      </VariationSelectionProvider>
    </VariableProductProvider>
  );
};

export const ProductVariationsModalContent = ({
  close,
}: {
  close: () => void;
}) => {
  const { purchasable } = useVariationSelection();
  const variableProduct = purchasable.product;
  const IMAGE_H = 200;

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

      <ProductVariationSelect />
    </ModalLayout>
  );
};
