import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ENDPOINTS } from "@/config/api";
import { createCartRestoreToken } from "@/hooks/checkout/api";
import {
  addItem as apiAddItem,
  removeItem as apiRemoveItem,
  updateItem as apiUpdateItem,
} from "@/hooks/data/Cart/api";
import { log } from "@/lib/logger";
import { createSmartExpoStorage } from "@/lib/storage";

import {
  CartActions,
  CartState,
  handleCartAction,
  initialState,
} from "./cartStore";

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // NEW: dumb setters
      setCart: (cart) =>
        set({
          cart,
          cartToken: cart?.token ?? "",
        }),

      reset: () => set({ ...initialState }),

      // optimistic actions (unchanged)
      addItem: async (options) => {
        const { cart } = get();
        await handleCartAction(
          "addItem",
          get,
          set,
          (token) =>
            apiAddItem(token, {
              ...options,
              variation: options.variation || [],
            }),
          cart
        );
      },

      updateItem: async (key, quantity) => {
        const { cart } = get();
        await handleCartAction(
          "updateItem",
          get,
          set,
          (token) => apiUpdateItem(token, { key, quantity }),
          cart ? cart.withUpdatedQuantity(key, quantity) : null,
          { itemKey: key } // ✅ per-item presence flag
        );
      },

      removeItem: async (key) => {
        const { cart } = get();
        await handleCartAction(
          "removeItem",
          get,
          set,
          (token) => apiRemoveItem(token, { key }),
          cart ? cart.withoutItem(key) : null,
          { itemKey: key } // ✅
        );
      },

      checkout: async () => {
        log.info("CartStore: checkout invoked.");
        const { cartToken } = get();
        try {
          const restoreToken = await createCartRestoreToken(cartToken);
          log.info(
            "CartStore: restore token created",
            restoreToken.substring(0, 10) + "..."
          );
          const checkoutUrl = new URL(
            ENDPOINTS.CHECKOUT.CHECKOUT(restoreToken)
          );
          log.info("CartStore: checkout URL created");
          return checkoutUrl;
        } catch (error) {
          log.error("CartStore: checkout failed.", error);
          throw error;
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => createSmartExpoStorage()),
      partialize: (state) => ({ cartToken: state.cartToken }), // keep only token
    }
  )
);

export const useCartIsLoading = () =>
  useCartStore((s) => s.isUpdating || Object.keys(s.updatingKeys).length > 0);

export const useItemIsUpdating = (key: string) =>
  useCartStore((s) => !!s.updatingKeys[key]);
