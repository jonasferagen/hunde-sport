// useAddToCart.ts

import { useToastController } from "@tamagui/toast";
import React from "react";

import { Purchasable } from "@/domain/Product/Purchasable";
// useAddToCart.ts (append below your existing exports)
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { haptic } from "@/lib/haptics";
import { AddItemOptions, useCartStore } from "@/stores/cartStore";

type AddResult = { ok: true } | { ok: false; error?: string };

/** Shared UX wrapper for add-to-cart */
async function addWithUX(
  addItem: (opts: AddItemOptions) => Promise<unknown>,
  toast: ReturnType<typeof useToastController>,
  options: AddItemOptions,
  productName: string
): Promise<AddResult> {
  try {
    await addItem(options);
    haptic.success();
    toast.show("Lagt til i handlekurv", { message: productName });
    return { ok: true };
  } catch (e: any) {
    const msg = e?.message ?? "Kunne ikke legge til";
    haptic.error();
    toast.show("Feil", { message: msg });
    return { ok: false, error: msg };
  }
}

/**
 * Build AddItemOptions from a Purchasable.
 * - Throws if !p.isValid
 * - variation built from p.selection (attrKey -> termKey), as [{ [attrKey]: termKey }, ...]
 */
function toAddItemOptions(p: Purchasable, qty = 1): AddItemOptions {
  if (!p.isValid) {
    throw new Error(p.message || "Velg variant");
  }

  // Turn selection Map into array of { [attribute]: value } entries
  // Only include chosen (non-null) terms
  const variation = p.selection
    ? Array.from(p.selection.entries())
        .filter(([, termKey]) => !!termKey)
        .map(([attrKey, termKey]) => ({
          attribute: attrKey,
          value: termKey as string,
        }))
    : [];

  return {
    id: p.product.id,
    quantity: qty,
    variation,
  };
}

export const useAddToCart = () => {
  const addItem = useCartStore((s) => s.addItem); // stable
  const toast = useToastController();

  return React.useCallback(
    async (p: Purchasable, qty = 1): Promise<AddResult> => {
      const options = toAddItemOptions(p, qty); // throws if invalid
      return addWithUX(addItem, toast, options, p.product.name);
    },
    [addItem, toast]
  );
};

export const useAddToCartSimple = () => {
  const addItem = useCartStore((s) => s.addItem); // stable
  const toast = useToastController();

  return React.useCallback(
    async (simpleProduct: SimpleProduct, qty = 1): Promise<AddResult> => {
      const options: AddItemOptions = {
        id: simpleProduct.id,
        quantity: qty,
      };
      return addWithUX(addItem, toast, options, simpleProduct.name);
    },
    [addItem, toast]
  );
};

type ActionStatus = "idle" | "loading" | "success" | "error";

export function useAddToCartSimpleAction(params: {
  simpleProduct: SimpleProduct;
  quantity?: number;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}) {
  const { simpleProduct, quantity = 1, onSuccess, onError } = params;
  const addSimple = useAddToCartSimple();

  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | undefined>(undefined);

  const isLoading = status === "loading";

  const onPress = React.useCallback(async () => {
    if (isLoading) return;
    setStatus("loading");
    setError(undefined);

    const res = await addSimple(simpleProduct, quantity);

    if (res.ok) {
      setStatus("success");
      onSuccess?.();
    } else {
      setStatus("error");
      setError(res.error);
      onError?.(res.error);
    }
  }, [isLoading, addSimple, simpleProduct, quantity, onSuccess, onError]);

  const reset = React.useCallback(() => {
    setStatus("idle");
    setError(undefined);
  }, []);

  return { isLoading, status, error, onPress, reset };
}

export function useAddToCartAction(params: {
  purchasable: Purchasable;
  quantity?: number;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}) {
  const { purchasable, quantity = 1, onSuccess, onError } = params;
  const add = useAddToCart();

  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | undefined>(undefined);

  const isLoading = status === "loading";

  const onPress = React.useCallback(async () => {
    if (isLoading) return;
    setStatus("loading");
    setError(undefined);

    const res = await add(purchasable, quantity);

    if (res.ok) {
      setStatus("success");
      onSuccess?.();
    } else {
      setStatus("error");
      setError(res.error);
      onError?.(res.error);
    }
  }, [isLoading, add, purchasable, quantity, onSuccess, onError]);

  const reset = React.useCallback(() => {
    setStatus("idle");
    setError(undefined);
  }, []);

  return { isLoading, status, error, onPress, reset };
}
