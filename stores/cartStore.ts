// stores/cartStore.ts
import { Cart } from "@/domain/cart/Cart";
import { log } from "@/lib/logger";

export interface CartState {
  cart: Cart | null;
  cartToken: string;
  isUpdating: boolean;
  error: string | null;
}

export interface AddItemOptions {
  id: number;
  quantity: number;
  variation?: { attribute: string; value: string }[];
  extensions?: {
    app_fpf?: {
      values: Record<string, string>;
    };
  };
}

export interface CartActions {
  // removed initializeCart
  setCart: (cart: Cart | null) => void;
  reset: () => void;
  addItem: (options: AddItemOptions) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  checkout: () => Promise<URL>;
}

export const initialState: CartState = {
  cart: null,
  cartToken: "",
  isUpdating: false,
  error: null,
};

// optimistic helper (unchanged, just moved below)
let cartActionVersion = 0;
export const handleCartAction = async (
  actionName: keyof Pick<CartActions, "addItem" | "updateItem" | "removeItem">,
  get: () => CartState,
  set: (partial: Partial<CartState>) => void,
  apiCall: (cartToken: string) => Promise<Cart>,
  optimisticCart: Cart | null
) => {
  log.info(`CartStore: ${actionName} invoked.`);
  const { cartToken, cart: originalCart } = get();
  if (!cartToken || !originalCart)
    throw new Error(`CartStore: ${actionName} failed — no cart loaded.`);

  const actionVersion = ++cartActionVersion;

  set({
    cart: optimisticCart
      ? Cart.rebuild(optimisticCart, { lastUpdated: Date.now() })
      : null,
    isUpdating: true,
  });

  try {
    const result = await apiCall(cartToken);
    if (actionVersion < cartActionVersion) {
      log.info(`CartStore: ${actionName} response ignored (stale version).`);
      return;
    }
    const apiCart = Cart.rebuild(result, { lastUpdated: Date.now() });
    set({ cart: apiCart, cartToken: apiCart.token });
    log.info(`CartStore: ${actionName} success.`);
  } catch (error) {
    log.error(
      `CartStore: ${actionName} failed.`,
      error instanceof Error ? error.message : error
    );
    set({ cart: originalCart });
  } finally {
    set({ isUpdating: false });
  }
};
