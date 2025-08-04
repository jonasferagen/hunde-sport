import { ENDPOINTS } from '@/config/api';
import { CartData } from '@/models/Cart/Cart';
import { mapCartData } from '@/models/Cart/CartMapper';
import { log } from '@/services/Logger';
import apiClient from '@/utils/apiClient';

/**
 * Fetches the cart from the API.
 * @returns {Promise<{data: CartData, token: string}>} The cart data and token.
 */
export async function fetchCart(): Promise<{ data: CartData; token: string }> {
    log.info('API: Fetching new cart...');
    const { data, headers, error } = await apiClient.get<any>(ENDPOINTS.CART.GET());
    const cartToken = headers.get('cart-token');

    if (error) {
        log.error('API: Failed to fetch cart');
        throw new Error(error);
    }
    if (!cartToken) {
        log.error('API: Cart token not found in response headers');
        throw new Error('Cart token not found');
    }

    if (!data) {
        log.error('API: No data returned from fetchCart');
        throw new Error('No data returned from fetchCart');
    }

    log.info('API: Successfully fetched new cart.');
    return { data: mapCartData(data), token: cartToken };
}

/**
 * Adds an item to the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {number} id - The product ID to add.
 * @param {number} quantity - The quantity of the product to add.
 * @param {object[]} variation - The product variation attributes.
 * @returns {Promise<CartData>} An object containing the updated cart data.
 */

export async function addItem({ cartToken, id, quantity, variation }: { cartToken: string, id: number, quantity: number, variation: { attribute: string; value: string }[] }): Promise<CartData> {
    const payload = { id, quantity, variation };
    log.info('API: addItem called.');

    const { data, headers, error } = await apiClient.post<any>(
        ENDPOINTS.CART.ADD_ITEM(),
        payload,
        { headers: { 'cart-token': cartToken } }
    );

    if (error) {
        log.error('API: addItem failed');
        throw new Error(error);
    }

    if (!data) {
        log.error('API: addItem returned no data');
        throw new Error('No data returned from addItem');
    }

    const newCartToken = headers.get('cart-token');
    if (newCartToken) {
        data.cart_token = newCartToken;
    }

    log.info('API: addItem success.');
    return mapCartData(data);
}

/**
 * Updates an item's quantity in the cart.
 * @param {string} key - The unique key of the item in the cart.
 * @param {number} quantity - The new quantity for the item.
 * @param {string} cartToken - The cart token for the current session.
 * @returns {Promise<CartData>} An object containing the updated cart data.
 */

/*
export async function updateItem({ cartToken, key, quantity }: { cartToken: string, key: string, quantity: number }): Promise<CartData> {
    const { data, headers, error } = await apiClient.post<any>(
        ENDPOINTS.CART.UPDATE_ITEM(key),
        { quantity },
        { headers: { 'cart-token': cartToken } }
    );

    if (error) {
        log.error('API: updateItem failed');
        throw new Error(error);
    }

    if (!data) {
        log.error('API: updateItem returned no data');
        throw new Error('No data returned from updateItem');
    }

    const newCartToken = headers.get('cart-token');
    if (newCartToken) {
        data.cart_token = newCartToken;
    }

    log.info('API: updateItem success.');
    return mapCartData(data);
}

/**
 * Removes an item from the cart.
 * @param {string} key - The unique key of the item in the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @returns {Promise<CartData>} An object containing the updated cart data.
 */

/*export async function removeItem({ cartToken, key }: { cartToken: string, key: string }): Promise<CartData> {
    const { data, headers, error } = await apiClient.delete<any>(
        ENDPOINTS.CART.REMOVE_ITEM(key),
        { headers: { 'cart-token': cartToken } }
    );

    if (error) {
        log.error('API: removeItem failed');
        throw new Error(error);
    }

    if (!data) {
        log.error('API: removeItem returned no data');
        throw new Error('No data returned from removeItem');
    }

    const newCartToken = headers.get('cart-token');
    if (newCartToken) {
        data.cart_token = newCartToken;
    }

    log.info('API: removeItem success.');
    return mapCartData(data);
}
*/