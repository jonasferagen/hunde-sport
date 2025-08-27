import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import {
  createPurchasable,
  PurchasableProduct,
  VariableProduct,
} from "@/types";

import {
  ProductImage,
  ProductPriceSimple,
  ProductTitle,
} from "../product/display";
import { PurchaseButtonSmart } from "../product/purchase/PurchaseButtonSmart";
import { ProductVariationSelect } from "./ProductVariationSelect";

type Props = { close: () => void; variableProduct: VariableProduct };

export const ProductVariationsModal = ({ close, variableProduct }: Props) => {
  const IMAGE_H = 200;

  const purchasable = React.useMemo(
    () =>
      createPurchasable({
        product: variableProduct as PurchasableProduct,
        productVariation: undefined, // wire from store if desired
      }),
    [variableProduct]
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
          // optional polish:
          //showsVerticalScrollIndicator={false}
          // alwaysBounceVertical={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <ProductVariationSelect variableProduct={variableProduct} />
        </ScrollView>
      </ThemedYStack>

      {/* Footer (natural height) */}
      <ThemedYStack>
        <ThemedXStack split>
          <ProductPriceSimple
            productPrices={variableProduct.prices}
            productAvailability={variableProduct.availability}
          />
        </ThemedXStack>
        <PurchaseButtonSmart
          purchasable={purchasable}
          onSuccess={close}
          inModal
        />
        <ThemedYStack mb="$3" />
      </ThemedYStack>
    </ThemedYStack>
  );
};
