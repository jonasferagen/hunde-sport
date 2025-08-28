// useAddToCart.ts

import { useToastController } from "@tamagui/toast";
import React from "react";

import { Purchasable } from "@/domain/Product/Purchasable";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { haptic } from "@/lib/haptics";
import { type AddItemOptions, useCartStore } from "@/stores/cartStore";

// ---- shared types (exported) ----
export type ActionStatus = "idle" | "loading" | "success" | "error";

export type AddActionOpts = {
  quantity?: number;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
};

export type AddActionReturn = {
  isLoading: boolean;
  status: ActionStatus;
  error?: string;
  onPress: () => Promise<void>;
  reset: () => void;
};

// ---- internal helpers ----
async function addWithUX(
  addItem: (opts: AddItemOptions) => Promise<unknown>,
  toast: ReturnType<typeof useToastController>,
  options: AddItemOptions,
  productName: string
) {
  try {
    await addItem(options);
    haptic.success();
    toast.show("Lagt til i handlekurv", { message: productName });
    return { ok: true as const };
  } catch (e: any) {
    const msg = e?.message ?? "Kunne ikke legge til";
    haptic.error();
    toast.show("Feil", { message: msg });
    return { ok: false as const, error: msg };
  }
}

function toAddItemOptionsFromPurchasable(
  p: Purchasable,
  qty: number
): AddItemOptions {
  if (!p.isValid) {
    throw new Error(p.message || "Velg variant");
  }
  // selection (attrKey -> termKey|null) → array of { attribute, value }
  const variation = p.selection
    ? Array.from(p.selection.entries())
        .filter(([, termKey]) => !!termKey)
        .map(([attrKey, termKey]) => ({
          attribute: attrKey,
          value: termKey as string,
        }))
    : [];

  return { id: p.variableProduct.id, quantity: qty, variation };
}

// ---- generic action hook factory (internal) ----
function useAddToCartActionInternal<T>(
  subject: T,
  buildOptions: (subject: T, qty: number) => AddItemOptions,
  productName: string,
  opts?: AddActionOpts
): AddActionReturn {
  const { quantity = 1, onSuccess, onError } = opts ?? {};
  const addItem = useCartStore((s) => s.addItem); // stable
  const toast = useToastController();

  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | undefined>(undefined);
  const isLoading = status === "loading";

  const onPress = React.useCallback(async () => {
    if (isLoading) return;
    setStatus("loading");
    setError(undefined);

    try {
      const options = buildOptions(subject, quantity);
      const res = await addWithUX(addItem, toast, options, productName);
      if (res.ok) {
        setStatus("success");
        onSuccess?.();
      } else {
        setStatus("error");
        setError(res.error);
        onError?.(res.error);
      }
    } catch (e: any) {
      const msg = e?.message ?? "Kunne ikke legge til";
      haptic.error();
      toast.show("Feil", { message: msg });
      setStatus("error");
      setError(msg);
      onError?.(msg);
    }
  }, [
    isLoading,
    subject,
    quantity,
    addItem,
    toast,
    productName,
    onSuccess,
    onError,
  ]);

  const reset = React.useCallback(() => {
    setStatus("idle");
    setError(undefined);
  }, []);

  return { isLoading, status, error, onPress, reset };
}

// ---- exported hooks ----

/**
 * Simple products: useAddToCartSimple(simpleProduct, opts)
 */
export function useAddToCartSimple(
  simpleProduct: SimpleProduct,
  opts?: AddActionOpts
): AddActionReturn {
  return useAddToCartActionInternal(
    simpleProduct,
    (sp, qty) => ({ id: sp.id, quantity: qty }),
    simpleProduct.name,
    opts
  );
}

/**
 * Variable products via purchasable: useAddToCartPurchasable(purchasable, opts)
 */
export function useAddToCartPurchasable(
  purchasable: Purchasable,
  opts?: AddActionOpts
): AddActionReturn {
  return useAddToCartActionInternal(
    purchasable,
    (p, qty) => toAddItemOptionsFromPurchasable(p, qty),
    purchasable.variableProduct.name,
    opts
  );
}
