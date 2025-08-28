// ProductVariationsModal.tsx

import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { createPurchasable } from "@/domain/Product/Purchasable";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { PurchasableProduct } from "@/types";

import {
  ProductImage,
  ProductPriceSimple,
  ProductTitle,
} from "../product/display";
import { PurchaseButtonSmart } from "../product/purchase/PurchaseButtonSmart";
import { ProductVariationSelect } from "./ProductVariationSelect";
import { ProductVariationStatus } from "./ProductVariationStatus";

const IMAGE_H = 200;
type Props = { close: () => void; variableProduct: VariableProduct };

export const ProductVariationsModal = ({ close, variableProduct }: Props) => {
  // selection + resolution coming back from the selector
  const [selection, setSelection] = React.useState<Map<string, string | null>>(
    new Map()
  );
  const [isComplete, setIsComplete] = React.useState(false);
  const [selectedVariation, setSelectedVariation] = React.useState<
    ProductVariation | undefined
  >(undefined);

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
            onSelect={({ selection, isComplete, selectedVariation }) => {
              setSelection(selection);
              setIsComplete(isComplete);
              setSelectedVariation(selectedVariation);
            }}
          />
        </ScrollView>
      </ThemedYStack>

      {/* Footer (natural height) */}
      <ThemedYStack>
        {/* Selection summary (very lightweight) */}
        <ProductVariationStatus
          variableProduct={variableProduct}
          selection={selection}
          isComplete={isComplete}
        />

        <ThemedXStack split>
          {/* If a variation is resolved, show its price & availability; otherwise fall back to parent */}
          <ProductPriceSimple
            productPrices={(selectedVariation ?? variableProduct).prices}
            productAvailability={
              (selectedVariation ?? variableProduct).availability
            }
          />
        </ThemedXStack>
        {
          <PurchaseButtonSmart
            disabled={!isComplete || !selectedVariation}
            purchasable={
              isComplete && selectedVariation
                ? createPurchasable({
                    product: variableProduct as PurchasableProduct,
                    productVariation: selectedVariation,
                  })
                : undefined
            }
            onSuccess={close}
            inModal
          />
        }
        <ThemedYStack mb="$3" />
      </ThemedYStack>
    </ThemedYStack>
  );
};
