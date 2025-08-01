import { ENDPOINTS } from '@/config/api';
import { Cart, CartData } from '@/models/Cart';
import apiClient from '@/utils/apiClient';
import { mapToCart } from './mapper';

/**
 * Fetches the cart data from the API.
 * @returns {Promise<{data: Cart, cartToken: string | null}>} An object containing the cart data and the cart token.
 */
export async function fetchCart(): Promise<Cart> {
    const { data, headers, error } = await apiClient.get<CartData>(ENDPOINTS.CART.GET());
    const cartToken = headers.get('cart-token');

    if (error) {
        throw new Error(error);
    }
    if (!cartToken) {
        throw new Error('Cart token not found');
    }
    const cart = mapToCart(data, cartToken);
    return cart;
}

/**
 * Adds an item to the cart.
 * @param {number} id - The product ID.
 * @param {number} quantity - The quantity of the product to add.
 * @param {any[]} variation - The selected product variations.
 * @param {string | null} [cartToken] - The cart token for the current session.
 * @returns {Promise<{data: Cart, cartToken: string | null}>} An object containing the updated cart data and the cart token.
 */
export async function addItem({ cartToken, id, quantity, variation }: { cartToken: string, id: number, quantity: number, variation: any[] }): Promise<{ data: Cart, cartToken: string }> {

    const { data, error } = await apiClient.post<CartData>(
        ENDPOINTS.CART.ADD_ITEM(),
        { id, quantity, variation },
        { headers: { 'Cart-Token': cartToken } }
    );

    if (error) {
        console.error("Error", error);
        throw new Error(error);
    }

    return { data: mapToCart(data, cartToken), cartToken };
}
