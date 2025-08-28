// ProductVariationsModal.tsx

import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import {
  createPurchasable,
  VariationSelection,
} from "@/domain/Product/Purchasable";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { ProductVariation } from "@/types";

import { ProductImage, ProductTitle } from "../product/display";
import { PurchasableButton } from "../product/purchase/PurchasableButton";
import { ProductVariationSelect } from "./ProductVariationSelect";
import { ProductVariationStatus } from "./ProductVariationStatus";

const IMAGE_H = 200;
type Props = { close: () => void; variableProduct: VariableProduct };

export const ProductVariationsModal = ({ close, variableProduct }: Props) => {
  const [selection, setSelection] = React.useState<
    VariationSelection | undefined
  >(undefined);
  const [selectedVariation, setSelectedVariation] = React.useState<
    ProductVariation | undefined
  >(undefined);

  const purchasable = React.useMemo(
    () =>
      createPurchasable({
        variableProduct,
        productVariation: selectedVariation,
        selection,
      }),
    [variableProduct, selectedVariation, selection]
  );

  return (
    <ThemedYStack f={1} mih={0} gap="$3">
      {/* Header (fixed) */}
      <ThemedXStack split>
        <ProductTitle product={variableProduct} fs={1} />
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
          <ProductVariationSelect
            variableProduct={variableProduct}
            onSelect={({ selection, selectedVariation }) => {
              setSelection(selection);
              setSelectedVariation(selectedVariation);
            }}
          />
        </ScrollView>
      </ThemedYStack>

      {/* Footer (natural height) */}
      <ThemedYStack>
        {/* Selection summary (very lightweight) */}
        <ProductVariationStatus purchasable={purchasable} />
        <ThemedText>{purchasable.message}</ThemedText>
        {<PurchasableButton purchasable={purchasable} onSuccess={close} />}
        <ThemedYStack mb="$3" />
      </ThemedYStack>
    </ThemedYStack>
  );
};
