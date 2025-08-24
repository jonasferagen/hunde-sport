// stores/cartStore.ts
import { Cart } from '@/domain/Cart/Cart';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Storage } from 'expo-storage';
import { log } from '@/lib/logger';
import {
    addItem as apiAddItem,
    removeItem as apiRemoveItem,
    updateItem as apiUpdateItem,
} from '@/hooks/data/Cart/api';

// unchanged smartExpoStorage...
let lastPersistedValue: string | null = null;
const smartExpoStorage = {
    getItem: async (name: string) => {
        const v = await Storage.getItem({ key: name });
        lastPersistedValue = v;
        return v;
    },
    setItem: async (name: string, value: string) => {
        if (value === lastPersistedValue) return;
        lastPersistedValue = value;
        await Storage.setItem({ key: name, value });
    },
    removeItem: async (name: string) => {
        lastPersistedValue = null;
        await Storage.removeItem({ key: name });
    },
};

interface CartState {
    cart: Cart | null;
    cartToken: string;
    isUpdating: boolean;
    error: string | null;
}

export interface AddItemOptions {
    id: number;
    quantity: number;
    variation?: { attribute: string; value: string }[];
}

interface CartActions {
    // removed initializeCart
    setCart: (cart: Cart | null) => void;
    reset: () => void;
    addItem: (options: AddItemOptions) => Promise<void>;
    updateItem: (key: string, quantity: number) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
    checkout: () => Promise<URL>;
}

const initialState: CartState = {
    cart: null,
    cartToken: '',
    isUpdating: false,
    error: null,
};

// optimistic helper (unchanged, just moved below)
let cartActionVersion = 0;
const handleCartAction = async (
    actionName: keyof Pick<CartActions, 'addItem' | 'updateItem' | 'removeItem'>,
    get: () => CartState,
    set: (partial: Partial<CartState>) => void,
    apiCall: (cartToken: string) => Promise<Cart>,
    optimisticCart: Cart | null
) => {
    log.info(`CartStore: ${actionName} invoked.`);
    const { cartToken, cart: originalCart } = get();
    if (!cartToken || !originalCart) throw new Error(`CartStore: ${actionName} failed — no cart loaded.`);

    const actionVersion = ++cartActionVersion;

    set({ cart: { ...optimisticCart!, lastUpdated: Date.now() }, isUpdating: true });

    try {
        const result = await apiCall(cartToken);
        if (actionVersion < cartActionVersion) {
            log.info(`CartStore: ${actionName} response ignored (stale version).`);
            return;
        }
        const apiCart = { ...result, lastUpdated: result.lastUpdated ?? Date.now() };
        set({ cart: apiCart, cartToken: apiCart.token });
        log.info(`CartStore: ${actionName} success.`);
    } catch (error) {
        log.error(`CartStore: ${actionName} failed.`, error instanceof Error ? error.message : error);
        set({ cart: originalCart });
    } finally {
        set({ isUpdating: false });
    }
};

export const useCartStore = create<CartState & CartActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            // NEW: dumb setters
            setCart: (cart) => set({
                cart,
                cartToken: cart?.token ?? '',
            }),

            reset: () => set({ ...initialState }),

            // optimistic actions (unchanged)
            addItem: async (options) => {
                const { cart } = get();
                await handleCartAction(
                    'addItem',
                    get,
                    set,
                    (token) => apiAddItem(token, { ...options, variation: options.variation || [] }),
                    cart
                );
            },

            updateItem: async (key, quantity) => {
                const { cart } = get();
                await handleCartAction(
                    'updateItem',
                    get,
                    set,
                    (token) => apiUpdateItem(token, { key, quantity }),
                    cart && {
                        ...cart,
                        items: cart.items.map((item) => (item.key === key ? { ...item, quantity } : item)),
                    }
                );
            },

            removeItem: async (key) => {
                const { cart } = get();
                await handleCartAction(
                    'removeItem',
                    get,
                    set,
                    (token) => apiRemoveItem(token, { key }),
                    cart && {
                        ...cart,
                        items: cart.items.filter((item) => item.key !== key),
                    }
                );
            },

            checkout: async () => {
                // unchanged…
                throw new Error('Implement your checkout here (omitted for brevity)');
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => smartExpoStorage),
            partialize: (state) => ({ cartToken: state.cartToken }), // keep only token
        }
    )
);
