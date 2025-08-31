// components/features/product-variation/ProductVariationsModal.tsx
import { X } from "@tamagui/lucide-icons";
import { ScrollView } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { VariableProductProvider } from "@/contexts/VariableProductContext";
import {
  useVariationSelection,
  VariationSelectionProvider,
} from "@/contexts/VariationSelectionContext";
import { useProductVariations } from "@/hooks/data/Product";
import { Purchasable, VariableProduct } from "@/types";

import { ProductImage, ProductTitle } from "../product/display";
import { PurchaseButton } from "../product/purchase/PurchaseButton";
import { ProductVariationSelect } from "./ProductVariationSelect";

type Props = {
  close: () => void;
  purchasable: Purchasable; // ← now receives purchasable
};

export const ProductVariationsModal = ({ close, purchasable }: Props) => {
  const variableProduct = purchasable.product as VariableProduct; // modal is only opened for variable products
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  console.log(variableProduct.extensions);

  return (
    <VariableProductProvider
      variableProduct={variableProduct}
      productVariations={productVariations}
      isLoading={isLoading}
    >
      <VariationSelectionProvider
        initialSelection={purchasable.variationSelection} // ← seed selection if present
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
  const variableProduct = purchasable.product; // variable here

  const IMAGE_H = 200;
  return (
    <ThemedYStack f={1} mih={0} gap="$3">
      {/* Header */}
      <ThemedXStack split>
        <ProductTitle product={variableProduct} fs={1} />
        <ThemedText>{variableProduct.id}</ThemedText>
        <ThemedButton circular onPress={close}>
          <X />
        </ThemedButton>
      </ThemedXStack>

      {/* Image */}
      <ThemedYStack w="100%" h={IMAGE_H}>
        <ProductImage product={variableProduct} img_height={IMAGE_H} />
      </ThemedYStack>

      {/* Variations */}
      <ThemedYStack f={1} mih={0}>
        <ScrollView
          f={1}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <ProductVariationSelect />
        </ScrollView>
      </ThemedYStack>

      {/* Footer */}
      <ThemedYStack>
        <ThemedYStack mb="$3" />
        <PurchaseButton purchasable={purchasable} onSuccess={close} />
      </ThemedYStack>
    </ThemedYStack>
  );
};
