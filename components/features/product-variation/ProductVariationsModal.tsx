// ProductVariationsModal.tsx
import { X } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView, Sheet } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { spacePx } from "@/lib/helpers";
import { useModalStore } from "@/stores/ui/modalStore";
/*
import {
  //selectSelectedVariation,
  useVariableProductStore,
} from "@/stores/useProductVariationStore"; */
import {
  createPurchasable,
  PurchasableProduct,
  VariableProduct,
} from "@/types";

import {
  // ProductAvailabilityStatus,
  ProductImage,
  ProductPriceSimple,
  ProductTitle,
} from "../product/display";
import { PurchaseButtonSmart } from "../product/purchase/PurchaseButtonSmart";
//import { ProductSelectionStatus } from "./ProductVariationLabel";
import { ProductVariationSelect } from "./ProductVariationSelect";

const gapPx = spacePx("$3");

export const ProductVariationsModal = ({
  close,
  variableProduct,
}: {
  close: () => void;
  variableProduct: VariableProduct;
}) => {
  return <Inner close={close} variableProduct={variableProduct} />;
};
type InnerProps = {
  close: () => void;
  variableProduct: VariableProduct; // incoming base
  onPurchasableUpdated?: (p: VariableProduct) => void; // NEW (optional)
};

export const Inner = React.memo(function Inner({
  close,
  variableProduct,
}: InnerProps) {
  const hasOpened = useModalStore((s) => s.status === "open");
  // 1) Track selected variation locally

  /*
  const getSelectedVariation = useVariableProductStore(
    (s) => s.getSelectedVariation
  );
  */
  //const productVariation = getSelectedVariation();
  const productVariation = undefined;
  // 2) Derive the working purchasable from (product, variation)
  const purchasable = React.useMemo(
    () =>
      createPurchasable({
        product: variableProduct as PurchasableProduct,
        productVariation,
      }),
    [variableProduct, productVariation]
  );
  /*
  const selectedVariation = useVariableProductStore(selectSelectedVariation);
  const selection = useVariableProductStore((s) => s.selection);
  React.useEffect(() => {
    console.log(selection);
    console.log(selectedVariation?.id);
  }, [selection, selectedVariation]);

  */
  const [bodyH, setBodyH] = React.useState(0);
  const [headerH, setHeaderH] = React.useState(0);
  const [footerH, setFooterH] = React.useState(0);

  // avoid setState loops from tiny layout jitter
  const setRounded = (set: (n: number) => void) => (e: any) => {
    const h = Math.round(e.nativeEvent.layout.height);
    set((prev) => (prev === h ? prev : h));
  };

  const onBodyLayout = setRounded(setBodyH);
  const onHeaderLayout = setRounded(setHeaderH);
  const onFooterLayout = setRounded(setFooterH);

  const IMAGE_H = 150;
  const gaps = 3 * gapPx;

  const layoutReady = bodyH > 0 && headerH > 0 && footerH > 0;
  const availableForOptions = React.useMemo(
    () => Math.max(0, bodyH - (headerH + footerH + IMAGE_H + gaps)),
    [bodyH, headerH, footerH]
  );

  return (
    <ThemedYStack
      f={1}
      mih={0}
      onLayout={onBodyLayout}
      gap="$3"
      collapsable={false}
    >
      {/* header */}
      <ThemedXStack split onLayout={onHeaderLayout}>
        <ProductTitle product={variableProduct} fs={1} />
        <ThemedButton circular onPress={close}>
          <X />
        </ThemedButton>
      </ThemedXStack>

      {/* image */}
      <ThemedYStack w="100%" h={IMAGE_H} boc="green" bw={1}>
        {hasOpened && (
          <ProductImage product={variableProduct} img_height={IMAGE_H} />
        )}
      </ThemedYStack>

      {/* variations */}
      <ScrollView
        // Do NOT control scrollEnabled; don't use onContentSizeChange
        keyboardShouldPersistTaps="handled"
        style={layoutReady ? { maxHeight: availableForOptions } : undefined}
        // Optional: prevents unmounting children while scrolling on Android
        removeClippedSubviews={false}
      >
        {hasOpened && layoutReady && (
          <ProductVariationSelect
            key={variableProduct.id} // stable key
            variableProduct={variableProduct}
            h={availableForOptions}
          />
        )}
      </ScrollView>

      {/* status & price */}
      <ThemedYStack onLayout={onFooterLayout}>
        <ThemedXStack split>
          <ProductPriceSimple
            productPrices={variableProduct.prices}
            productAvailability={variableProduct.availability}
          />
        </ThemedXStack>
        <PurchaseButtonSmart
          purchasable={createPurchasable({
            product: variableProduct as PurchasableProduct,
            productVariation: undefined, // wire from store if you want
          })}
          onSuccess={close}
          inModal
        />
        <ThemedYStack mb="$3" />
      </ThemedYStack>
    </ThemedYStack>
  );
});
