import { BaseProduct, BaseProductData } from '@/types';

export type AddItemMutation = (vars: { id: number; quantity: number; variation: { attribute: string; value: string }[] }) => void;
export type UpdateItemMutation = (vars: { key: string; quantity: number; optimisticUpdateTimestamp?: number }) => void;
export type RemoveItemMutation = (vars: { key: string }) => void;

export interface CartItemData {
    key: string;
    product: BaseProduct<BaseProductData>;
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
