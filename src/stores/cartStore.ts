// stores/cartStore.ts
import { Cart } from "@/domain/cart/Cart";
import type { CartAddItemOptions } from "@/domain/cart/types";

export interface CartActions {
  setCart: (cart: Cart) => void;
  reset: () => void;
  addItem: (options: CartAddItemOptions) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  checkout: () => Promise<URL>;
}

export interface CartState {
  cart: Cart;
  cartToken: string;
  isUpdating: boolean; // whole-cart ops only
  updatingKeys: Record<string, number>; // presence-only map ✅
  error: string | null;
}

export const initialState: CartState = {
  cart: Cart.DEFAULT,
  cartToken: "",
  isUpdating: false,
  updatingKeys: {},
  error: null,
};

// optimistic helper (unchanged, just moved below)
let cartActionVersion = 0;
// stores/cartStore.ts
type GetState = () => CartState;
// allow functional set for precise updates
type SetState = (
  partial: Partial<CartState> | ((s: CartState) => Partial<CartState>),
) => void;
type ApiCall = (cartToken: string) => Promise<Cart>;
type HandleOpts = { itemKey?: string };

export async function handleCartAction(
  actionName: keyof Pick<CartActions, "addItem" | "updateItem" | "removeItem">,
  get: GetState,
  set: SetState,
  apiCall: ApiCall,
  optimisticCart: Cart | null,
  opts: HandleOpts = {},
) {
  const { itemKey } = opts;
  const { cartToken, cart: currentCart } = get();
  if (!cartToken || !currentCart) {
    throw new Error(`CartStore: ${actionName} failed — no cart loaded.`);
  }

  const previousCart = currentCart;
  const thisVersion = ++cartActionVersion;
  const now = Date.now();

  // start: apply optimistic + mark busy (global or per-item)
  set((s) => ({
    cart: optimisticCart
      ? Cart.rebuild(optimisticCart, { lastUpdated: now })
      : s.cart,
    isUpdating: !itemKey || s.isUpdating,
    updatingKeys: itemKey
      ? { ...s.updatingKeys, [itemKey]: (s.updatingKeys[itemKey] ?? 0) + 1 } // ⬅️ ++
      : s.updatingKeys,
    error: null,
  }));

  try {
    const serverCart = await apiCall(cartToken);
    if (thisVersion !== cartActionVersion) return; // ignore stale cart writes

    const next = Cart.rebuild(serverCart, { lastUpdated: Date.now() });
    set((s) => ({
      cart: next,
      cartToken: next.token,
      // don't touch updatingKeys here; we clear it in finally
      isUpdating: itemKey ? s.isUpdating : false,
    }));
  } catch (err) {
    if (thisVersion === cartActionVersion) {
      set((s) => ({
        cart: previousCart,
        error: err instanceof Error ? err.message : String(err),
        isUpdating: itemKey ? s.isUpdating : false,
      }));
    }
  } finally {
    if (itemKey) {
      set((s) => {
        const nextCount = (s.updatingKeys[itemKey] ?? 1) - 1;
        if (nextCount <= 0) {
          const { [itemKey]: _drop, ...rest } = s.updatingKeys;
          return { updatingKeys: rest }; // ⬅️ gone when 0
        }
        return { updatingKeys: { ...s.updatingKeys, [itemKey]: nextCount } };
      });
    }
    if (thisVersion === cartActionVersion) {
      set({ isUpdating: false });
    }
  }
}
