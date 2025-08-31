// components/product/purchase/PurchaseButton.tsx
import {
  Boxes,
  Brush,
  CircleAlert,
  ShoppingCart,
  TriangleAlert,
  XCircle,
} from "@tamagui/lucide-icons";
import React, { JSX } from "react";

import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { decidePurchasable } from "@/domain/purchasable/decidePurchasable";
import { Purchasable } from "@/domain/purchasable/Purchasable";
import { useAddToCart } from "@/hooks/useAddToCart";
import { openModal } from "@/stores/ui/modalStore";

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
};

export const PurchaseButton = React.memo(function PurchaseButton(props: Props) {
  const { purchasable, onSuccess, onError } = props;
  const { product } = purchasable;
  const decision = decidePurchasable(purchasable);

  const { isLoading, onPress } = useAddToCart(purchasable, {
    onSuccess,
    onError,
  });

  const handlePress = React.useCallback(() => {
    if (decision.disabled) return;
    switch (decision.next) {
      case "addToCart":
        onPress();
        break;
      case "openVariations":
        openVariationsNow(purchasable);
        break;
      case "openCustomize":
        openCustomizationNow(purchasable);
        break;
      case "noop":
        break;
    }
  }, [decision, purchasable, onPress]);

  const { theme, iconKey, label } = decision;
  const icon = ICONS[iconKey];

  return (
    <CallToActionButton
      onPress={handlePress}
      before={icon}
      theme={theme}
      label={label}
      after={<PurchaseButtonPriceTag product={product} />}
      loading={isLoading}
      disabled={decision.disabled}
    />
  );
});

function openCustomizationNow(purchasable: Purchasable) {
  // fire-and-forget dynamic import
  (async () => {
    const { ProductCustomizationModal } = await import(
      "@/components/features/purchasable/ProductCustomizationModal"
    );
    openModal((_, api) => (
      <ProductCustomizationModal
        purchasable={purchasable}
        close={() => api.close()}
      />
    ));
  })();
}

function openVariationsNow(purchasable: Purchasable) {
  (async () => {
    const { ProductVariationsModal } = await import(
      "@/components/features/product-variation/ProductVariationsModal"
    );
    openModal((_, api) => (
      <ProductVariationsModal
        purchasable={purchasable}
        close={() => api.close()}
      />
    ));
  })();
}
