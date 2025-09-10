// components/product/purchase/PurchaseButton.tsx
import {
  Boxes,
  Brush,
  CircleAlert,
  ShoppingCart,
  TriangleAlert,
  XCircle,
} from "@tamagui/lucide-icons";
import React, { type JSX } from "react";
import type { ThemeName } from "tamagui";

import { decidePurchasable } from "@/components/features/product/purchase/ctaDecision";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { Purchasable } from "@/domain/Purchasable";
import { useAddToCart } from "@/hooks/useAddToCart";

import { PurchaseButtonPriceTag } from "./PurchaseButtonPriceTag";

const ICONS: Record<string, JSX.Element> = {
  ShoppingCart: <ShoppingCart />,
  Boxes: <Boxes />,
  TriangleAlert: <TriangleAlert />,
  Brush: <Brush />,
  CircleAlert: <CircleAlert />,
  XCircle: <XCircle />,
};

type Props = {
  purchasable: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
  onOpenVariations?: (p: Purchasable) => void | Promise<void>;
  onOpenCustomization?: (p: Purchasable) => void | Promise<void>;
};

export const PurchaseButton = React.memo(function PurchaseButton({
  purchasable,
  onSuccess,
  onError,
  onOpenVariations,
  onOpenCustomization,
}: Props) {
  const decision = decidePurchasable(purchasable.status);
  const { theme, iconKey, label } = decision;

  const icon = ICONS[iconKey] ?? null;

  const { isLoading, onPress } = useAddToCart(purchasable, {
    onSuccess,
    onError,
  });

  // only show spinner when we're actually adding to cart
  const loadingForButton = decision.next === "addToCart" ? isLoading : false;

  const handlePress = async () => {
    if (decision.disabled) return;

    try {
      switch (decision.next) {
        case "addToCart":
          onPress();
          break;
        case "openVariations":
          await onOpenVariations?.(purchasable);
          break;
        case "openCustomize":
          await onOpenCustomization?.(purchasable);
          break;
        case "noop":
        default:
          // do nothing
          break;
      }
    } catch (e) {
      // bubble any lazy-import/open errors to the UI if provided
      onError?.(
        e instanceof Error ? e.message : "Kunne ikke åpne dialogen. Prøv igjen."
      );
    }
  };

  return (
    <CallToActionButton
      onPress={handlePress}
      before={icon}
      theme={theme as ThemeName}
      label={label}
      after={<PurchaseButtonPriceTag purchasable={purchasable} />}
      loading={loadingForButton}
      disabled={decision.disabled}
    />
  );
});
/*
async function openCustomizationNow(purchasable: Purchasable) {
  const { ProductCustomizationModal } = await import(
    "@/components/features/purchasable/ProductCustomizationModal"
  );
  openModal((_, api) => (
    <ProductCustomizationModal
      purchasable={purchasable}
      close={() => api.close()}
    />
  ));
}

async function openVariationsNow(purchasable: Purchasable) {
  const { ProductVariationsModal } = await import(
    "@/components/features/product-variation/ProductVariationsModal"
  );
  openModal((_, api) => (
    <ProductVariationsModal
      purchasable={purchasable}
      close={() => api.close()}
    />
  ));
} */
