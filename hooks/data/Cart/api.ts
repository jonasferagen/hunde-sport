import { ENDPOINTS } from '@/config/api';
import { Cart, CartData } from '@/models/Cart';
import apiClient from '@/utils/apiClient';
import { mapToCart } from './mapper';

/**
 * Fetches the cart data from the API.
 * @returns {Promise<Cart>} The cart data.
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
    return mapToCart(data, cartToken);
}

/**
 * Adds an item to the cart.
 * @param {number} id - The product ID.
 * @param {number} quantity - The quantity of the product to add.
 * @param {{attribute: string, value: string}[]} variation - The selected product variations.
 * @param {string | null} [cartToken] - The cart token for the current session.
 * @returns {Promise<{data: Cart}>} An object containing the updated cart data.
 */
export async function addItem({ cartToken, id, quantity, variation }: { cartToken: string, id: number, quantity: number, variation: { attribute: string; value: string }[] }): Promise<{ data: Cart }> {

    const { data, error } = await apiClient.post<CartData>(
        ENDPOINTS.CART.ADD_ITEM(),
        { id, quantity, variation },
        { headers: { 'Cart-Token': cartToken } }
    );

    if (error) {
        console.error("Error", error);
        throw new Error(error);
    }

    return { data: mapToCart(data, cartToken) };
}

/**
 * Updates an item in the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The key of the item to update.
 * @param {number} quantity - The new quantity of the item.
 * @returns {Promise<{data: Cart}>} An object containing the updated cart data.
 */
export async function updateItem({ cartToken, key, quantity }: { cartToken: string, key: string, quantity: number }): Promise<{ data: Cart }> {

    const { data, error } = await apiClient.post<CartData>(
        ENDPOINTS.CART.UPDATE_ITEM(),
        { key, quantity },
        { headers: { 'Cart-Token': cartToken } }
    );

    if (error) {
        console.error("Error", error);
        throw new Error(error);
    }

    return { data: mapToCart(data, cartToken) };
}

/**
 * Removes an item from the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The key of the item to remove.
 * @returns {Promise<{data: Cart}>} An object containing the updated cart data.
 */
export async function removeItem({ cartToken, key }: { cartToken: string, key: string }): Promise<{ data: Cart }> {

    const { data, error } = await apiClient.post<CartData>(
        ENDPOINTS.CART.REMOVE_ITEM(),
        { key },
        { headers: { 'Cart-Token': cartToken } }
    );

    if (error) {
        console.error("Error", error);
        throw new Error(error);
    }

    return { data: mapToCart(data, cartToken) };
}
