import {
    addItem as apiAddItem,
    fetchCart as apiFetchCart,
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

                    console.error(data.token);

                    set({
                        cart: data,
                        cartToken: data.token,
                        isInitialized: true,
                        isLoading: false,
                    });
                    log.info('CartStore: Initialization successful.');
                } catch (error) {
                    log.error('CartStore: Initialization failed.');
                    set({ isLoading: false });
                }
            },

            addItem: async (options: AddItemOptions) => {
                const { cartToken, cart: originalCart } = get();
                log.info('CartStore: addItem invoked.');

                if (!cartToken) {
                    log.error('CartStore: addItem failed, no cart token found.');
                    return;
                }

                set({ isUpdating: true });

                try {
                    const { data } = await apiAddItem({ ...options, cartToken, variation: options.variation || [] });
                    set({ cart: data, cartToken: data.token, isUpdating: false });
                    log.info('CartStore: addItem success.');
                } catch (error) {
                    log.error('CartStore: addItem failed.');
                    log.error(error);
                    set({ cart: originalCart, isUpdating: false });
                }
            },

            updateItem: async (key: string, quantity: number) => { /*
                const { cartToken, cart: originalCart } = get();
                log.info('CartStore: updateItem invoked.');

                if (!cartToken) {
                    log.error('CartStore: updateItem failed, no cart token found.');
                    return;
                }

                set({ isUpdating: true });

                try {
                    const updatedCartData = await apiUpdateItem({ cartToken, key, quantity });
                    set({ cart: updatedCartData, cartToken: updatedCartData.cart_token, isUpdating: false });
                    log.info('CartStore: updateItem success.');
                } catch (error) {
                    log.error('CartStore: updateItem failed.');
                    set({ cart: originalCart, isUpdating: false });
                } */
            },

            removeItem: async (key: string) => { /*
                const { cartToken, cart: originalCart } = get();
                log.info('CartStore: removeItem invoked.');

                if (!cartToken) {
                    log.error('CartStore: removeItem failed, no cart token found.');
                    return;
                }

                set({ isUpdating: true });

                try {
                    const updatedCartData = await apiRemoveItem({ cartToken, key });
                    set({ cart: updatedCartData, cartToken: updatedCartData.cart_token, isUpdating: false });
                    log.info('CartStore: removeItem success.');
                } catch (error) {
                    log.error('CartStore: removeItem failed.');
                    // Rollback to original state on error
                    set({ cart: originalCart, isUpdating: false });
                } */
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => expoStorage),
            partialize: (state) => ({ cartToken: state.cartToken }), // Only persist the cart token
        }
    )
);
