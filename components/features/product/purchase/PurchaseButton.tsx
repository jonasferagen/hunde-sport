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
import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import {
  THEME_CTA_BUY,
  THEME_CTA_OUTOFSTOCK,
  THEME_CTA_SELECTION_NEEDED,
  THEME_CTA_UNAVAILABLE,
  THEME_CTA_VIEW,
} from "@/config/app";
import {
  decidePurchasable,
  type UIByStatus,
} from "@/domain/purchasable/decidePurchasable";
import { Purchasable } from "@/domain/purchasable/Purchasable";
import { useAddToCart } from "@/hooks/useAddToCart";
import { openModal } from "@/stores/ui/modalStore";
import type { SimpleProduct, VariableProduct } from "@/types";

import { ProductPrice } from "../display";

const ICONS: Record<string, JSX.Element> = {
  ShoppingCart: <ShoppingCart />,
  Boxes: <Boxes />,
  TriangleAlert: <TriangleAlert />,
  Brush: <Brush />,
  CircleAlert: <CircleAlert />,
  XCircle: <XCircle />,
};

const UI_BY_STATUS: UIByStatus = {
  ready: { iconKey: "ShoppingCart", theme: THEME_CTA_BUY },
  select: { iconKey: "Boxes", theme: THEME_CTA_VIEW },
  select_incomplete: {
    iconKey: "TriangleAlert",
    theme: THEME_CTA_SELECTION_NEEDED,
  },
  customize: { iconKey: "Brush", theme: THEME_CTA_VIEW },
  customize_incomplete: {
    iconKey: "TriangleAlert",
    theme: THEME_CTA_SELECTION_NEEDED,
  },
  sold_out: { iconKey: "CircleAlert", theme: THEME_CTA_OUTOFSTOCK },
  unavailable: { iconKey: "XCircle", theme: THEME_CTA_UNAVAILABLE },
};

function PriceTag({ product }: { product: SimpleProduct | VariableProduct }) {
  return (
    <ThemedSurface
      theme="shade"
      h="$6"
      ai="center"
      jc="center"
      px="none"
      mr={-20}
      minWidth={80}
    >
      <ProductPrice
        productPrices={product.prices}
        productAvailability={product.availability}
      />
    </ThemedSurface>
  );
}

type Props = {
  purchasable: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
};

export const PurchaseButton = React.memo(function PurchaseButton(props: Props) {
  const { purchasable, onSuccess, onError } = props;

  const { isLoading, onPress } = useAddToCart(purchasable, {
    onSuccess,
    onError,
  });

  const decision = decidePurchasable(
    purchasable.status.key,
    purchasable.status.label,
    UI_BY_STATUS
  );

  const { theme, label, iconKey } = decision;
  const icon = ICONS[iconKey] ?? null;

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

  return (
    <CallToActionButton
      onPress={handlePress}
      before={icon}
      theme={theme}
      label={label}
      after={
        <PriceTag
          product={purchasable.product as SimpleProduct | VariableProduct}
        />
      }
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
