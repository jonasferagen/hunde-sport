// stores/cartStore.ts
import { Cart } from "@/domain/cart/Cart";
import { AddItemOptions } from "@/hooks/data/Cart/api";

export interface CartActions {
  setCart: (cart: Cart) => void;
  reset: () => void;
  addItem: (options: AddItemOptions) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  checkout: () => Promise<URL>;
}

export interface CartState {
  cart: Cart;
  cartToken: string;
  isUpdating: boolean; // whole-cart ops only
  updatingKeys: Record<string, true>; // presence-only map ✅
  error: string | null;
}

export const initialState: CartState = {
  cart: Cart.DEFAULT,
  cartToken: "",
  isUpdating: false,
  updatingKeys: {}, // ✅
  error: null,
};

// optimistic helper (unchanged, just moved below)
let cartActionVersion = 0;
// stores/cartStore.ts
type GetState = () => CartState;
// allow functional set for precise updates
type SetState = (
  partial: Partial<CartState> | ((s: CartState) => Partial<CartState>)
) => void;
type ApiCall = (cartToken: string) => Promise<Cart>;
type HandleOpts = { itemKey?: string };

export async function handleCartAction(
  actionName: keyof Pick<CartActions, "addItem" | "updateItem" | "removeItem">,
  get: GetState,
  set: SetState,
  apiCall: ApiCall,
  optimisticCart: Cart | null,
  opts: HandleOpts = {}
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
    isUpdating: !itemKey || s.isUpdating, // only flip global when no itemKey
    updatingKeys: itemKey
      ? { ...s.updatingKeys, [itemKey]: true }
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
    // per-item: always clear presence (keeps things simple & robust)
    if (itemKey) {
      set((s) => {
        const { [itemKey]: _omit, ...rest } = s.updatingKeys;
        return { updatingKeys: rest };
      });
    }
    // global flag only cleared by the latest action
    if (thisVersion === cartActionVersion) {
      set({ isUpdating: false });
    }
  }
}
