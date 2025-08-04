import { AddItemMutation, CartData, CartItemData, RemoveItemMutation, UpdateItemMutation } from '@/models/Cart';
import { createProduct } from '@/models/Product/ProductFactory';
import { Storage } from 'expo-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

// Expo Storage adapter for Zustand
const expoStorage: StateStorage = {
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

// Main state interface for the cart
interface CartState {
    cartToken?: string;
    items: CartItemData[];
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any[];
    lastUpdated: number;

    // Internal mutation functions, set by the data hooks
    _addItem?: AddItemMutation;
    _updateItem?: UpdateItemMutation;
    _removeItem?: RemoveItemMutation;

    // Actions
    setData: (data: CartData) => void;
    setCartToken: (token: string) => void;
    setMutations: (mutations: { addItem: AddItemMutation; updateItem: UpdateItemMutation; removeItem: RemoveItemMutation }) => void;
    getItem: (key: string) => CartItemData | undefined;
    getSubtotal: (item: CartItemData) => string;

    // Public methods for cart operations that perform optimistic updates
    addItem: (itemToAdd: { id: number; quantity: number; variation: { attribute: string; value: string }[] }) => void;
    updateItem: (key: string, newQuantity: number) => void;
    removeItem: (key: string) => void;
    isReady: boolean;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            // State
            items: [],
            items_count: 0,
            items_weight: 0,
            totals: {},
            has_calculated_shipping: false,
            shipping_rates: [],
            _addItem: undefined,
            _updateItem: undefined,
            _removeItem: undefined,
            lastUpdated: 0,
            isReady: false,

            // Actions
            setData: (data: CartData) => {
                const itemsWithProducts = data.items.map(item => ({
                    ...item,
                    product: createProduct(item), // Hydrate with full product model
                }));

                set({
                    items: itemsWithProducts,
                    items_count: data.items_count,
                    items_weight: data.items_weight,
                    totals: data.totals,
                    has_calculated_shipping: data.has_calculated_shipping,
                    shipping_rates: data.shipping_rates,
                    lastUpdated: data.lastUpdated,
                    cartToken: data.cart_token, // Ensure token is also updated
                });
            },

            setCartToken: (token: string) => set({ cartToken: token }),

            setMutations: ({ addItem, updateItem, removeItem }) => {
                set({
                    _addItem: addItem,
                    _updateItem: updateItem,
                    _removeItem: removeItem,
                });
            },

            getItem: (key: string) => {
                return get().items.find(i => i.key === key);
            },

            getSubtotal: (cartItem: CartItemData) => {
                if (!cartItem?.totals) {
                    return '0';
                }
                return (Number(cartItem.totals.line_total) + Number(cartItem.totals.line_total_tax)).toString();
            },

            addItem: (itemToAdd) => {
                const { items_count, _addItem: addItemMutation } = get();
                if (!addItemMutation) return;

                set({ items_count: items_count + itemToAdd.quantity }); // Optimistic update
                addItemMutation(itemToAdd);
            },

            updateItem: (key, newQuantity) => {
                const { items, items_count, _updateItem: updateItem } = get();
                const item = items.find(i => i.key === key);
                if (!item || !updateItem) return;

                const oldQuantity = item.quantity;
                const timestamp = Date.now();

                // Optimistically update the UI
                const updatedItems = items.map(i =>
                    i.key === key ? { ...i, quantity: newQuantity } : i
                );
                set({
                    items: updatedItems,
                    items_count: items_count - oldQuantity + newQuantity,
                    lastUpdated: timestamp,
                });

                updateItem({ key, quantity: newQuantity, optimisticUpdateTimestamp: timestamp });
            },

            removeItem: (key) => {
                const { items, items_count, _removeItem: removeItem } = get();
                const item = items.find(i => i.key === key);
                if (!removeItem || !item) return;

                // Optimistic update
                set({
                    items: items.filter(i => i.key !== key),
                    items_count: items_count - item.quantity,
                });

                removeItem({ key });
            }
        }),
        {
            name: 'cart-storage', // Key for persisted data in AsyncStorage
            storage: createJSONStorage(() => expoStorage),
            partialize: state => ({ cartToken: state.cartToken }), // Only persist the cart token
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isReady = true;
                }
            },
        }
    )
);

/**
 * Hook to check if the cart store has been rehydrated.
 */
export const useIsCartReady = () => useCartStore(state => state.isReady);