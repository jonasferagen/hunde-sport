// ProductVariationsModal.tsx

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
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

import { ProductImage, ProductTitle } from "../product/display";
import { PurchaseButton } from "../product/purchase/PurchaseButton";
import { ProductVariationSelect } from "./ProductVariationSelect";
import { ProductVariationStatus } from "./ProductVariationStatus";

type Props = { close: () => void; variableProduct: VariableProduct };

export const ProductVariationsModal = ({ close, variableProduct }: Props) => {
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  return (
    <VariableProductProvider
      variableProduct={variableProduct}
      productVariations={productVariations}
      isLoading={isLoading}
    >
      <VariationSelectionProvider>
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
  const { variableProduct } = purchasable;

  console.warn(
    purchasable.selectedVariation?.id,
    purchasable.isValid,
    purchasable.missing
  );

  const IMAGE_H = 200;
  return (
    <ThemedYStack f={1} mih={0} gap="$3">
      {/* Header (fixed) */}
      <ThemedXStack split>
        <ProductTitle product={variableProduct} fs={1} />
        <ThemedText>{variableProduct.id}</ThemedText>
        <ThemedButton circular onPress={close}>
          <X />
        </ThemedButton>
      </ThemedXStack>

      {/* Image (fixed height) */}
      <ThemedYStack w="100%" h={IMAGE_H}>
        <ProductImage product={variableProduct} img_height={IMAGE_H} />
      </ThemedYStack>

      {/* Variations (fills remaining space) */}
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

      {/* Footer (natural height) */}
      <ThemedYStack>
        {/* Selection summary (very lightweight) */}
        <ProductVariationStatus purchasable={purchasable} />
        <ThemedText>{purchasable.message}</ThemedText>
        <PurchaseButton
          product={variableProduct}
          purchasable={purchasable}
          onSuccess={close}
        />
        <ThemedYStack mb="$3" />
      </ThemedYStack>
    </ThemedYStack>
  );
};
