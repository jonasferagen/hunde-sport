// hooks/useAddToCart.ts
import { useToastController } from "@tamagui/toast";
import React from "react";

import type { Purchasable } from "@/domain/Purchasable";
import { haptic } from "@/lib/haptics";
import { useCartStore } from "@/stores/useCartStore";

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

export function useAddToCart(
  purchasable: Purchasable,
  opts?: AddActionOpts,
): AddActionReturn {
  const { quantity = 1, onSuccess, onError } = opts ?? {};
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToastController();

  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | undefined>(undefined);
  const isLoading = status === "loading";

  const onPress = React.useCallback(async () => {
    if (isLoading) return;
    setStatus("loading");
    setError(undefined);

    try {
      const options = purchasable.toCartItem(quantity);
      await addItem(options);

      haptic.success();
      toast.show("Lagt til i handlekurv", {
        message: purchasable.product.name,
      });
      setStatus("success");
      onSuccess?.();
    } catch (e: any) {
      const msg = e?.message ?? "Kunne ikke legge til";
      haptic.error();
      toast.show("Feil", { message: msg });
      setStatus("error");
      setError(msg);
      onError?.(msg);
    }
  }, [isLoading, purchasable, quantity, addItem, toast, onSuccess, onError]);

  const reset = React.useCallback(() => {
    setStatus("idle");
    setError(undefined);
  }, []);

  return { isLoading, status, error, onPress, reset };
}
