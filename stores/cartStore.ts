import { ENDPOINTS } from '@/config/api';
import { CartData } from '@/domain/Cart/Cart';
import { createCartRestoreToken } from '@/hooks/checkout/api';
import {
    addItem as apiAddItem,
    fetchCart as apiFetchCart,
    removeItem as apiRemoveItem,
    updateItem as apiUpdateItem,
} from '@/hooks/data/Cart/api';
import { log } from '@/lib/logger';
import { Storage } from 'expo-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


let lastPersistedValue: string | null = null;

const smartExpoStorage = {
    getItem: async (name: string) => {
        const v = await Storage.getItem({ key: name });
        lastPersistedValue = v;
        return v;
    },
    setItem: async (name: string, value: string) => {
        if (value === lastPersistedValue) return; // skip no-op write
        lastPersistedValue = value;
        await Storage.setItem({ key: name, value });
    },
    removeItem: async (name: string) => {
        lastPersistedValue = null;
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
    checkout: () => Promise<URL>;
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


// Tracks the order in which cart actions are initiated
let cartActionVersion = 0;

const handleCartAction = async (
    actionName: keyof Pick<CartActions, 'addItem' | 'updateItem' | 'removeItem'>,
    get: () => CartState,
    set: (partial: Partial<CartState>) => void,
    apiCall: (cartToken: string) => Promise<{ data: CartData }>,
    optimisticCart: CartData | null
) => {
    log.info(`CartStore: ${actionName} invoked.`);

    const { cartToken, cart: originalCart } = get();
    if (!cartToken || !originalCart) {
        throw new Error(`CartStore: ${actionName} failed — no cart loaded.`);
    }

    // Assign a version for this specific action
    const actionVersion = ++cartActionVersion;

    // Apply optimistic state immediately
    set({
        cart: {
            ...optimisticCart!,
            lastUpdated: Date.now(),
        },
        isUpdating: true,
    });

    try {
        const result = await apiCall(cartToken);

        // Ignore stale responses
        if (actionVersion < cartActionVersion) {
            log.info(`CartStore: ${actionName} response ignored (stale version).`);
            return;
        }

        const apiCart = {
            ...result.data,
            lastUpdated: result.data.lastUpdated ?? Date.now(),
        };

        set({
            cart: apiCart,
            cartToken: apiCart.token,
        });

        log.info(`CartStore: ${actionName} success.`);
    } catch (error) {
        log.error(`CartStore: ${actionName} failed.`, error instanceof Error ? error.message : error);
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
                        isLoading: false,
                    });
                } catch (e) {
                    log.error('CartStore: Initialization failed.');
                    set({ isLoading: false });
                }
            },



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
                        items: cart.items.map((item) =>
                            item.key === key ? { ...item, quantity } : item
                        ),
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
                log.info('CartStore: checkout invoked.');
                const { cartToken } = get();
                try {
                    const restoreToken = await createCartRestoreToken(cartToken);
                    log.info('CartStore: restore token created', restoreToken.substring(0, 10) + '...');
                    const checkoutUrl = new URL(ENDPOINTS.CHECKOUT.CHECKOUT(restoreToken));
                    log.info('CartStore: checkout URL created');
                    return checkoutUrl;
                } catch (error) {
                    log.error('CartStore: checkout failed.', error);
                    throw error;
                }
            },
        }),

        {
            name: 'cart-storage',
            storage: createJSONStorage(() => smartExpoStorage),
            partialize: (state) => ({ cartToken: state.cartToken }), // Only persist the cart token
        }
    )
);
