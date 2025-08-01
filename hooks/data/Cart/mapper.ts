import { Cart, CartItem } from '@/models/Cart';
import { mapToProduct } from '../Product/mapper';

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


export const mapToCart = (data: any, cartToken: string): Cart => {
    return new Cart(data, cartToken);
};
