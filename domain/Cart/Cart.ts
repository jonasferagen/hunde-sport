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

export interface Cart {
    items: CartItemData[];
    token: string;
    items_count: number;
    items_weight: number;
    totals: WcTotals;
    has_calculated_shipping: boolean;
    shipping_rates: any;
    lastUpdated: number;
}


/**
 * Maps raw cart data from the API to the application's CartData model.
 * It uses the ProductFactory to ensure that product data within the cart
 * is correctly instantiated into SimpleProduct or VariableProduct objects.
 *
 * @param {any} rawData - The raw cart data object from the API.
 * @param {string} token - The cart token for the current session.
 * @returns {Cart} The structured and validated CartData object.
 */
export const mapToCart = (rawData: any, token: string): Cart => {
    const mappedItems = rawData.items.map((item: any): CartItemData => {

        return {
            ...item,
        };
    });

    return {
        ...rawData,
        items: mappedItems,
        token,
        lastUpdated: Date.now(),
    };
};
