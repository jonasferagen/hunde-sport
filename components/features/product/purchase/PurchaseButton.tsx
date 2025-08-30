// components/product/purchase/PurchaseButton.tsx
import {
  Boxes,
  CircleAlert,
  ShoppingCart,
  TriangleAlert,
  XCircle,
} from "@tamagui/lucide-icons";
import type { JSX } from "react";
import React from "react";
import type { ThemeName } from "tamagui";

import { ProductVariationsModal } from "@/components/features/product-variation/ProductVariationsModal";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import {
  THEME_CTA_BUY,
  THEME_CTA_OUTOFSTOCK,
  THEME_CTA_SELECTION_NEEDED,
  THEME_CTA_UNAVAILABLE,
  THEME_CTA_VIEW,
} from "@/config/app";
import { Purchasable, PurchaseStatus } from "@/domain/purchasable/Purchasable";
import { useAddToCart } from "@/hooks/useAddToCart";
import { openModal } from "@/stores/ui/modalStore";
import type { SimpleProduct, VariableProduct } from "@/types";

import { ProductPrice } from "../display";

/* -------------------------------- UI config -------------------------------- */

type UIConf = {
  icon: JSX.Element;
  theme: ThemeName;
};

const UI_BY_STATUS_KEY: Record<PurchaseStatus, UIConf> = {
  ready: { icon: <ShoppingCart />, theme: THEME_CTA_BUY },
  select: { icon: <Boxes />, theme: THEME_CTA_VIEW },
  select_incomplete: {
    icon: <TriangleAlert />,
    theme: THEME_CTA_SELECTION_NEEDED,
  },
  sold_out: { icon: <CircleAlert />, theme: THEME_CTA_OUTOFSTOCK },
  unavailable: { icon: <XCircle />, theme: THEME_CTA_UNAVAILABLE },
};

/* --------------------------- Price tag (inline) ---------------------------- */

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

/* ------------------------------- Main button ------------------------------- */

type Props = {
  purchasable: Purchasable;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
};

export const PurchaseButton = React.memo(function PurchaseButton({
  purchasable,
  onSuccess,
  onError,
}: Props) {
  const product = purchasable.product;
  const { key, label } = purchasable.status;
  const ui = UI_BY_STATUS_KEY[key];

  // Always call the hook (avoid conditional hooks)
  const { isLoading, onPress } = useAddToCart(purchasable, {
    onSuccess,
    onError,
  });

  // Default: simple or variable+resolved → add-to-cart
  let pressHandler: () => void = onPress;
  let loading = isLoading;
  // You wanted the button to own disabled: !(ready || select)
  let disabled = !(key === "ready" || key === "select");

  if (key === "select") {
    // No selection context yet → open modal
    pressHandler = () =>
      openModal(
        (_, api) => (
          <ProductVariationsModal
            purchasable={purchasable}
            close={() => api.close()}
          />
        ),
        purchasable
      );
    loading = false;
    disabled = false;
  } else if (key === "select_incomplete") {
    // Selection exists but unresolved → guidance only
    pressHandler = () => {};
    loading = false;
    disabled = true;
    // finalLabel already includes guidance from purchasable.status.label
  }

  return (
    <CallToActionButton
      onPress={pressHandler}
      before={ui.icon}
      theme={ui.theme}
      label={label}
      after={<PriceTag product={product} />}
      loading={loading}
      disabled={disabled}
    />
  );
});
