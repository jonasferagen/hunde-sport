// stores/cartStore.ts
import { Cart } from "@/domain/cart/Cart";
import { AddItemOptions } from "@/hooks/data/Cart/api";
import { log } from "@/lib/logger";

export interface CartState {
  cart: Cart;
  cartToken: string;
  isUpdating: boolean;
  error: string | null;
}

export interface CartActions {
  // removed initializeCart
  setCart: (cart: Cart) => void;
  reset: () => void;
  addItem: (options: AddItemOptions) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  checkout: () => Promise<URL>;
}

export const initialState: CartState = {
  cart: Cart.DEFAULT,
  cartToken: "",
  isUpdating: false,
  error: null,
};

// optimistic helper (unchanged, just moved below)
let cartActionVersion = 0;

type GetState = () => CartState;
type SetState = (partial: Partial<CartState>) => void;
type ApiCall = (cartToken: string) => Promise<Cart>;

export async function handleCartAction(
  actionName: keyof Pick<CartActions, "addItem" | "updateItem" | "removeItem">,
  get: GetState,
  set: SetState,
  apiCall: ApiCall,
  optimisticCart: Cart | null
) {
  log.info(`CartStore: ${actionName} invoked.`);

  const { cartToken, cart: currentCart } = get();
  if (!cartToken || !currentCart) {
    throw new Error(`CartStore: ${actionName} failed — no cart loaded.`);
  }

  const previousCart = currentCart;
  const thisVersion = ++cartActionVersion;
  const now = Date.now();

  // Apply optimistic state (if provided)
  if (optimisticCart) {
    set({
      cart: Cart.rebuild(optimisticCart, { lastUpdated: now }),
      isUpdating: true,
      error: null,
    });
  } else {
    set({ isUpdating: true, error: null });
  }

  try {
    const serverCart = await apiCall(cartToken);

    // Ignore stale responses from older inflight actions
    if (thisVersion !== cartActionVersion) {
      log.info(`CartStore: ${actionName} response ignored (stale version).`);
      return;
    }

    const next = Cart.rebuild(serverCart, { lastUpdated: Date.now() });
    set({ cart: next, cartToken: next.token });
    log.info(`CartStore: ${actionName} success.`);
  } catch (err) {
    log.error(
      `CartStore: ${actionName} failed.`,
      err instanceof Error ? err.message : err
    );

    // Only roll back if this action is still the latest
    if (thisVersion === cartActionVersion) {
      set({
        cart: previousCart,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    // Re-throw if you want callers to handle/display errors upstream
    // throw err;
  } finally {
    // Only clear updating flag if this action is still the latest
    if (thisVersion === cartActionVersion) {
      set({ isUpdating: false });
    }
  }
}
