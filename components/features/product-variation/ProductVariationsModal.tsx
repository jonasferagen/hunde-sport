// ProductVariationsModal.tsx

import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import { createPurchasable, Purchasable } from "@/domain/Product/Purchasable";
import { VariableProduct } from "@/domain/Product/VariableProduct";

import {
  ProductImage,
  ProductPriceSimple,
  ProductTitle,
} from "../product/display";
import { PurchasableButton } from "../product/purchase/PurchasableButton";
import { PurchaseButtonSmart } from "../product/purchase/PurchaseButtonSmart";
import { ProductVariationSelect } from "./ProductVariationSelect";
import { ProductVariationStatus } from "./ProductVariationStatus";

const IMAGE_H = 200;
type Props = { close: () => void; variableProduct: VariableProduct };

export const ProductVariationsModal = ({ close, variableProduct }: Props) => {
  const [purchasable, setPurchasable] = React.useState<Purchasable>(
    createPurchasable({ product: variableProduct })
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
            onSelect={(payload) =>
              setPurchasable(
                createPurchasable({
                  product: variableProduct,
                  productVariation: payload.selectedVariation,
                  selection: payload.selection,
                })
              )
            }
          />
        </ScrollView>
      </ThemedYStack>

      {/* Footer (natural height) */}
      <ThemedYStack>
        {/* Selection summary (very lightweight) */}
        <ProductVariationStatus purchasable={purchasable} />
        {<PurchasableButton purchasable={purchasable} onSuccess={close} />}
        <ThemedYStack mb="$3" />
      </ThemedYStack>
    </ThemedYStack>
  );
};

/* 
        <ThemedXStack split>
          {/* If a variation is resolved, show its price & availability; otherwise fall back to parent 
          <ProductPriceSimple
            productPrices={purchasable.activeProduct.prices}
            productAvailability={purchasable.activeProduct.availability}
          />
        </ThemedXStack> */
