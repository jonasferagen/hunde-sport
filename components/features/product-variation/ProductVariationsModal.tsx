import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView } from "tamagui";

import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import { useProductVariations } from "@/hooks/data/Product";
import { useVariableProductStore } from "@/stores/useProductVariationStore";
import {
  createPurchasable,
  Purchasable,
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
import { ProductVariationStatus } from "./ProductVariationStatus";
type Props = { close: () => void; variableProduct: VariableProduct };
const IMAGE_H = 200;

export const ProductVariationsModal = ({ close, variableProduct }: Props) => {
  const init = useVariableProductStore((s) => s.init);
  const setVariations = useVariableProductStore((s) => s.setVariations);
  // Fallback to store if no explicit selection is passed
  const storeSelection = useVariableProductStore((s) => s.selection);
  const productVariation = useVariableProductStore((s) =>
    s.getSelectedVariation()
  );
  const reset = useVariableProductStore((s) => s.reset);
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  const _purchasable = createPurchasable({
    product: variableProduct as PurchasableProduct,
  });

  const [purchasable, setPurchasable] =
    React.useState<Purchasable>(_purchasable);

  // Init on product change; hard reset on unmount
  React.useEffect(() => {
    init(variableProduct);
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variableProduct.id, init, reset]);

  // Supply variations when ready
  React.useEffect(() => {
    if (!isLoading && productVariations.length)
      setVariations(productVariations);
  }, [isLoading, productVariations, setVariations]);

  React.useEffect(() => {
    const purchasable = createPurchasable({
      product: variableProduct as PurchasableProduct,
      productVariation: productVariation,
    });
    setPurchasable(purchasable);
  }, [storeSelection, variableProduct, productVariation, setPurchasable]);

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
          <ProductVariationSelect />
        </ScrollView>
      </ThemedYStack>

      {/* Footer (natural height) */}
      <ThemedYStack>
        <ThemedXStack split>
          <ProductVariationStatus storeSelection={storeSelection} />
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
