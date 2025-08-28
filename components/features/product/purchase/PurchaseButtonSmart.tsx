// PurchaseButtonSmart.tsx
// PurchaseButtonSmart.tsx
import React from "react";
import { Theme } from "tamagui";

import { ThemedSurface } from "@/components/ui/themed-components/ThemedSurface";
import { useAddToCart } from "@/hooks/useAddToCart";
import type { Product, Purchasable, VariableProduct } from "@/types";

import { ProductPrice } from "../display";
import { PurchaseButtonBase } from "./PurchaseButton"; // view-only

type Props = {
  purchasable: Purchasable;
  onSuccess?: () => void; // close modal, show toast, etc.
  inModal?: boolean; // true when used inside variation modal
  onRequestVariation?: (variableProduct: VariableProduct) => void;
};

export const PurchaseButtonSmart = React.memo(function PurchaseButtonSmart({
  purchasable,
  onSuccess,
  inModal = false,
  onRequestVariation,
}: Props) {
  const addToCart = useAddToCart();
  const [loading, setLoading] = React.useState(false);

  const cta = computeCTA(purchasable, inModal ? "modal" : "card");

  const onPress = React.useCallback(async () => {
    if (loading) return;

    // Need to pick a variant
    if (cta.mode === "select-variation") {
      if (inModal) return; // already in picker; wait for valid
      onRequestVariation?.(purchasable.product as VariableProduct); // delegate opening the modal
      return;
    }

    // Can't buy
    if (cta.mode === "unavailable") return;

    // Buy path
    let ok = false;
    try {
      setLoading(true);
      await addToCart(purchasable, 1);
      ok = true;
    } catch (err) {
      console.error(err);
      // Optionally toast/log here
      // toast.error(typeof err === 'string' ? err : 'Kunne ikke legge i handlekurv');
    } finally {
      setLoading(false);

      if (ok) onSuccess?.(); // ← guarantees it fires only after success
    }
  }, [loading, cta.mode, inModal, addToCart, purchasable, onSuccess]);

  // Disable rules: in modal we only enable when selection is valid; on cards we enable unless unavailable
  const disabled =
    loading || (inModal ? !purchasable.isValid : cta.mode === "unavailable");

  const priceTag = (
    <Theme inverse>
      <ThemedSurface
        theme="shade"
        h="$6"
        ai="center"
        jc="center"
        px="none"
        mr={-20}
        minWidth={80}
      >
        <ProductPrice product={purchasable.activeProduct as Product} />
      </ThemedSurface>
    </Theme>
  );

  return (
    <PurchaseButtonBase
      mode={cta.mode}
      label={cta.label}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      after={priceTag}
    />
  );
});

export type PurchaseCTAMode = "buy" | "select-variation" | "unavailable";
export type PurchaseCTAState = {
  mode: PurchaseCTAMode;
  label: string;
  disabled: boolean;
};

export function computeCTA(
  p: Purchasable,
  ctx: "card" | "modal"
): PurchaseCTAState {
  const noSelection = p.isVariable && !p.productVariation;

  // No selection yet → let users pick
  if (noSelection) {
    return {
      mode: "select-variation",
      label: ctx === "modal" ? "Velg variant" : "Se varianter",
      disabled: false,
    };
  }

  // Selected or simple product: check stock
  if (!p.availability.isInStock) {
    return { mode: "unavailable", label: p.message, disabled: true };
  }

  return { mode: "buy", label: p.message, disabled: false };
}
