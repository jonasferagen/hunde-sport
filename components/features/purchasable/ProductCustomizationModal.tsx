// components/features/product-variation/ProductVariationsModal.tsx
import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { Purchasable } from "@/types";

import { ProductImage, ProductTitle } from "../product/display";
import { PurchaseButton } from "../product/purchase/PurchaseButton";
import { ProductCustomizationForm } from "./ProductCustomizationForm";

type Props = {
  close: () => void;
  purchasable: Purchasable; // ← now receives purchasable
};

export const ProductCustomizationModal = ({ close, purchasable }: Props) => {
  const _purchasable = React.useMemo(
    () =>
      new Purchasable(
        purchasable.product,
        purchasable.variationSelection,
        purchasable.selectedVariation,
        { a: "b" }
      ),
    [purchasable]
  );

  return (
    <ProductCustomizationModalContent
      close={close}
      purchasable={_purchasable}
    />
  );
};

export const ProductCustomizationModalContent = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
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
          <ProductCustomizationForm />
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
