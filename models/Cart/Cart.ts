

export interface CartItemData {
    key: string;
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
    token: string;
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any;
    lastUpdated: number;
}
