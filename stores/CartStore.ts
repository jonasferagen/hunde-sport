import {
    addItem as apiAddItem,
    fetchCart as apiFetchCart,
    removeItem as apiRemoveItem,
    updateItem as apiUpdateItem,
} from '@/hooks/data/Cart/api';
import { CartData } from '@/models/Cart/Cart';
import { log } from '@/services/Logger';
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
    cartToken: string | null;
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
    cartToken: null,
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
const _handleCartAction = async <T>(
    actionName: 'addItem' | 'updateItem' | 'removeItem',
    get: () => CartState,
    set: (partial: Partial<CartState>) => void,
    apiCall: () => Promise<{ data: CartData }>
) => {
    log.info(`CartStore: ${actionName} invoked.`);
    const { cart: originalCart } = get();
    set({ isUpdating: true });

    try {
        const { data } = await apiCall();
        set({ cart: data, cartToken: data.token });
        log.info(`CartStore: ${actionName} success.`);
    } catch (error) {
        log.error(`CartStore: ${actionName} failed.`, error);
        set({ cart: originalCart });
    }
    set({ isUpdating: false });
};

/**
 * The centralized Zustand store for managing the shopping cart.
 */
export const useCartStore = create<CartState & CartActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            initializeCart: async () => {
                if (get().isInitialized) return;

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

            addItem: async (options: AddItemOptions) => {
                const { cartToken } = get();
                if (!cartToken) {
                    log.error('CartStore: addItem failed, no cart token found.');
                    return;
                }

                await _handleCartAction(
                    'addItem',
                    get,
                    set,
                    () => apiAddItem({ ...options, cartToken, variation: options.variation || [] })
                );
            },

            updateItem: async (key: string, quantity: number) => {
                const { cartToken } = get();
                if (!cartToken) {
                    log.error('CartStore: updateItem failed, no cart token found.');
                    return;
                }

                await _handleCartAction(
                    'updateItem',
                    get,
                    set,
                    () => apiUpdateItem({ cartToken, key, quantity })
                );
            },

            removeItem: async (key: string) => {
                const { cartToken } = get();
                if (!cartToken) {
                    log.error('CartStore: removeItem failed, no cart token found.');
                    return;
                }

                await _handleCartAction(
                    'removeItem',
                    get,
                    set,
                    () => apiRemoveItem({ cartToken, key })
                );
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => expoStorage),
            partialize: (state) => ({ cartToken: state.cartToken }), // Only persist the cart token
        }
    )
);
