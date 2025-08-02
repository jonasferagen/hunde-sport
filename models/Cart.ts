import { Product } from '@/types';
import { create } from 'zustand';
import { mapToProduct } from './Product/ProductMapper';

export type AddItemMutation = (vars: { id: number; quantity: number; variation: { attribute: string; value: string }[] }) => void;
export type UpdateItemMutation = (vars: { key: string; quantity: number; optimisticUpdateTimestamp?: number }) => void;
export type RemoveItemMutation = (vars: { key: string }) => void;

export interface CartItemData {
    key: string;
    product: Product;
    id: number;
    type: string;
    name: string;
    variations: any[];
    prices: any;
    totals: any;
    quantity: number;
}

export interface CartData {
    items: CartItemData[];
    cart_token: string;
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any;
    lastUpdated: number;
}

interface CartState {
    cartToken?: string;
    items: CartItemData[];
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any[];
    addItem?: AddItemMutation;
    updateItem?: UpdateItemMutation;
    removeItem?: RemoveItemMutation;
    lastUpdated: number;
    setData: (data: CartData) => void;
    setCartToken: (token: string) => void;
    setMutations: (mutations: { addItem: AddItemMutation; updateItem: UpdateItemMutation; removeItem: RemoveItemMutation }) => void;
    getItem: (key: string) => CartItemData | undefined;
    getSubtotal: (item: CartItemData) => string;
    updateItemQuantity: (key: string, newQuantity: number) => void;
    remove: (key: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    // State
    cartToken: undefined,
    items: [],
    items_count: 0,
    items_weight: 0,
    totals: {},
    has_calculated_shipping: false,
    shipping_rates: [],
    addItem: undefined,
    updateItem: undefined,
    removeItem: undefined,
    lastUpdated: 0,

    // Actions
    setData: (data: CartData) => {
        const itemsWithProducts = data.items.map(item => ({
            ...item,
            product: mapToProduct(item),
        }));

        set({
            items: itemsWithProducts,
            items_count: data.items_count,
            items_weight: data.items_weight,
            totals: data.totals,
            has_calculated_shipping: data.has_calculated_shipping,
            shipping_rates: data.shipping_rates,
            lastUpdated: data.lastUpdated,
        });
    },

    setCartToken: (token: string) => set({ cartToken: token }),

    setMutations: ({ addItem, updateItem, removeItem }) => {
        set({ addItem, updateItem, removeItem });
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

    updateItemQuantity: (key: string, newQuantity: number) => {
        const { items, items_count, updateItem } = get();
        const item = items.find(i => i.key === key);

        if (!item || !updateItem) return;

        const oldQuantity = item.quantity;
        const timestamp = Date.now();

        // Optimistically update the specific item's quantity and the total count
        const updatedItems = items.map(i =>
            i.key === key ? { ...i, quantity: newQuantity } : i
        );

        set({
            items: updatedItems,
            items_count: items_count - oldQuantity + newQuantity,
            lastUpdated: timestamp,
        });

        // Call the mutation to update the item on the server
        updateItem({ key, quantity: newQuantity, optimisticUpdateTimestamp: timestamp });
    },

    remove: (key: string) => {
        const { items, removeItem } = get();
        if (!removeItem) return;

        // Optimistic update
        set({ items: items.filter(i => i.key !== key) });

        // Call the actual mutation
        removeItem({ key });
    },
}));
