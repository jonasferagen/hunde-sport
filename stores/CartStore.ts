import {
    addItem as apiAddItem,
    fetchCart as apiFetchCart,
    removeItem as apiRemoveItem,
    updateItem as apiUpdateItem,
} from '@/hooks/data/Cart/api';
import { log } from '@/lib/logger';
import { CartData } from '@/models/Cart/Cart';
import { Storage } from 'expo-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Expo Storage adapter for Zustand persistence
const expoStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return await Storage.getItem({ key: name });
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await Storage.setItem({ key: name, value });
    },
    removeItem: async (name: string): Promise<void> => {
        await Storage.removeItem({ key: name });
    },
};

/**
 * Defines the shape of the cart's state.
 */
interface CartState {
    cart: CartData | null;
    cartToken: string;
    isInitialized: boolean;
    isLoading: boolean;
    isUpdating: boolean;
}

// Defines the parameters for adding an item, simplified for component use.
export interface AddItemOptions {
    id: number;
    quantity: number;
    variation?: { attribute: string; value: string }[];
}

/**
 * Defines the actions available to manipulate the cart's state.
 */
interface CartActions {
    initializeCart: () => Promise<void>;
    addItem: (options: AddItemOptions) => Promise<void>;
    updateItem: (key: string, quantity: number) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
}

/**
 * The initial state of the cart store.
 */
const initialState: CartState = {
    cart: null,
    cartToken: '',
    isInitialized: false,
    isLoading: false,
    isUpdating: false,
};

/**
 * A generic helper function to manage cart operations by handling loading states, API calls, and state updates.
 * @param actionName - The name of the action for logging purposes.
 * @param get - The Zustand `get` function to access the current state.
 * @param set - The Zustand `set` function to update the state.
 * @param apiCall - The specific API function to execute for the cart operation.
 * @returns A promise that resolves when the action is complete.
 */
const handleCartAction = async (
    actionName: 'addItem' | 'updateItem' | 'removeItem',
    get: () => CartState,
    set: (partial: Partial<CartState>) => void,
    apiCall: (cartToken: string) => Promise<{ data: CartData }>,
    optimisticCart: CartData,

) => {
    log.info(`CartStore: ${actionName} invoked.`);
    const cartToken = get().cartToken;
    if (!cartToken) {
        throw new Error(`CartStore: ${actionName} failed, no cart token found.`);
    }
    const { cart: originalCart } = get();
    set({ isUpdating: true });
    try {
        const newCart = optimisticCart;
        const originalTimestamp = Date.now();
        set({
            cart: {
                ...newCart,
                lastUpdated: originalTimestamp,
            },
            isUpdating: true,
        });

        const result = await apiCall(cartToken);
        const cart = result.data;

        // Only update if response is newer
        const current = get().cart;
        if (current && current?.lastUpdated > cart.lastUpdated) {
            log.info('CartStore: response ignored due to newer cart state.');
            return;
        }

        set({ cart, cartToken: cart.token });
        log.info(`CartStore: ${actionName} success.`);
    } catch (error) {
        log.error(`CartStore: ${actionName} failed.`, error);
        set({ cart: originalCart });
    } finally {
        set({ isUpdating: false });
    }
};

/**
 * The centralized Zustand store for managing the shopping cart.
 */
export const useCartStore = create<CartState & CartActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            addItem: async (options: AddItemOptions) => {
                const { cart } = get();
                await handleCartAction(
                    'addItem',
                    get,
                    set,
                    (cartToken) => apiAddItem(cartToken, { ...options, variation: options.variation || [] }),
                    cart!
                );
            },

            updateItem: async (key: string, quantity: number) => {

                const { cart } = get();

                await handleCartAction(
                    'updateItem',
                    get,
                    set,
                    (cartToken) => apiUpdateItem(cartToken, { key, quantity }),
                    {
                        ...cart!,
                        items: cart!.items.map((item) =>
                            item.key === key ? { ...item, quantity } : item
                        ),
                    }
                );
            },

            removeItem: async (key: string) => {
                const { cart } = get();
                await handleCartAction(
                    'removeItem',
                    get,
                    set,
                    (cartToken) => apiRemoveItem(cartToken, { key }),
                    {
                        ...cart!,
                        items: cart!.items.filter((item) => item.key !== key),
                    }
                );
            }, initializeCart: async () => {
                if (get().isInitialized) return;
                if (get().cartToken && get().cart) {
                    set({ isInitialized: true });
                }

                log.info('CartStore: Initializing...');
                set({ isLoading: true });

                try {
                    const { data } = await apiFetchCart();
                    set({
                        cart: data,
                        cartToken: data.token,
                        isInitialized: true,
                    });
                    log.info('CartStore: Initialization successful.');
                } catch (error) {
                    log.error('CartStore: Initialization failed.');
                }
                set({ isLoading: false });
            },
        }),

        {
            name: 'cart-storage',
            storage: createJSONStorage(() => expoStorage),
            partialize: (state) => ({ cartToken: state.cartToken }), // Only persist the cart token
        }
    )
);
