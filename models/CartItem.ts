import { Product } from '@/models/Product/Product';
import { mapToProduct } from '@/models/Product/ProductMapper';

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

export class CartItem implements CartItemData {
    key: string;
    product: Product;
    id: number;
    type: string;
    name: string;
    variations: any[];
    prices: any;
    totals: any;
    quantity: number;

    constructor(data: CartItemData) {
        this.key = data.key;

        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.variations = data.variations;
        this.prices = data.prices;
        this.totals = data.totals;
        this.quantity = data.quantity;

        this.product = data.product;
    }
}


/**
 * Maps a raw data object to a CartItem instance.
 * @param {any} item - The raw cart item data from the API.
 * @returns {CartItem} A new CartItem instance.
 */
export const mapToCartItem = (item: any): CartItem => {

    const product = mapToProduct(item);

    return new CartItem({
        key: item.key,
        id: item.id,
        product,
        quantity: item.quantity,
        type: item.type,
        name: item.name,
        variations: item.variations,
        prices: item.prices,
        totals: item.totals,
    });
};
