import { WcItemPrices, WcItemTotals, WcTotals } from '@/domain/Cart/pricing';

export interface CartItemData {
    key: string;
    id: number;
    type: string;
    name: string;
    variations: any[];
    prices: WcItemPrices;
    totals: WcItemTotals;
    quantity: number;
}

export interface CartData {
    items: CartItemData[];
    token: string;
    items_count: number;
    items_weight: number;
    totals: WcTotals;
    has_calculated_shipping: boolean;
    shipping_rates: any;
    lastUpdated: number;
}

