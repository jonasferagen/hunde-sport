// ProductVariationsModal.tsx
import { X } from "@tamagui/lucide-icons";
import React from "react";
import { Sheet } from "tamagui";

import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import { spacePx } from "@/lib/helpers";
import { useModalStore } from "@/stores/ui/modalStore";
import { createPurchasable, Purchasable, VariableProduct } from "@/types";

import { useVariableProductStore } from "@/stores/useProductVariationStore";
import {
  ProductAvailabilityStatus,
  ProductImage,
  ProductPriceSimple,
  ProductTitle,
} from "../product/display";
import { ProductSelectionStatus } from "./ProductVariationLabel";
import { ProductVariationSelect } from "./ProductVariationSelect";
import { PurchaseButtonSmart } from "../product/purchase/PurchaseButtonSmart";

const gapPx = spacePx("$3");

export const ProductVariationsModal = ({
  close,
  purchasable,
}: {
  close: () => void;
  purchasable: Purchasable;
}) => {
  return <Inner close={close} purchasable={purchasable} />;
};
type InnerProps = {
  close: () => void;
  purchasable: Purchasable; // incoming base
  onPurchasableUpdated?: (p: Purchasable) => void; // NEW (optional)
};

export const Inner = React.memo(function Inner({
  close,
  purchasable: basePurchasable,
  onPurchasableUpdated,
}: InnerProps) {
  const hasOpened = useModalStore((s) => s.status === "open");
  // 1) Track selected variation locally

  const productVariation = useVariableProductStore((s) => s.selectedVariation);

  // 2) Derive the working purchasable from (product, variation)
  const purchasable = React.useMemo(
    () =>
      createPurchasable({
        product: basePurchasable.product,
        productVariation: productVariation,
      }),
    [basePurchasable.product, productVariation]
  );

  // 3) Notify parent when the derived purchasable changes
  React.useEffect(() => {
    onPurchasableUpdated?.(purchasable);
  }, [purchasable, onPurchasableUpdated]);

  const [bodyH, setBodyH] = React.useState(0);
  const [headerH, setHeaderH] = React.useState(0);
  const [footerH, setFooterH] = React.useState(0);
  const [contentH, setContentH] = React.useState(0);

  const onBodyLayout = (e: any) =>
    setBodyH(Math.round(e.nativeEvent.layout.height));
  const onHeaderLayout = (e: any) =>
    setHeaderH(Math.round(e.nativeEvent.layout.height));
  const onFooterLayout = (e: any) =>
    setFooterH(Math.round(e.nativeEvent.layout.height));

  const IMAGE_H = 150;
  const gaps = 3 * gapPx;
  const cH = headerH + footerH + IMAGE_H + gaps;
  const availableForOptions = Math.max(0, bodyH - cH);

  const variableProduct = purchasable.product as VariableProduct;

  return (
    <ThemedYStack f={1} mih={0} onLayout={onBodyLayout} gap="$3">
      {/* header */}
      <ThemedXStack split onLayout={onHeaderLayout}>
        <ProductTitle product={purchasable.product} fs={1} />
        <ThemedButton circular onPress={close}>
          <X />
        </ThemedButton>
      </ThemedXStack>

      {/* image */}
      <ThemedYStack w="100%" h={IMAGE_H}>
        {hasOpened && (
          <ProductImage
            product={purchasable.activeProduct}
            img_height={IMAGE_H}
          />
        )}
      </ThemedYStack>

      {/* variations */}
      <Sheet.ScrollView
        style={
          availableForOptions ? { maxHeight: availableForOptions } : undefined
        }
        keyboardShouldPersistTaps="always"
        onContentSizeChange={(_w, h) => setContentH(Math.round(h))}
        scrollEnabled={contentH > availableForOptions}
      >
        {hasOpened && (
          <ProductVariationSelect
            variableProduct={variableProduct}
            h={availableForOptions}
          />
        )}
      </Sheet.ScrollView>

      {/* status & price */}
      <ThemedYStack onLayout={onFooterLayout}>
        <ProductSelectionStatus />
        <ThemedXStack split>
          <ProductAvailabilityStatus
            productAvailability={purchasable.activeProduct.availability}
          />
          <ProductPriceSimple
            productPrices={purchasable.prices}
            productAvailability={purchasable.availability}
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
});
