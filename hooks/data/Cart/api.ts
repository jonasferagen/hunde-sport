import { ENDPOINTS } from '@/config/api';
import api from '@/lib/apiClient';
import { CartData } from '@/models/Cart/Cart';
import { mapCartData } from '@/models/Cart/CartMapper';
import { log } from '@/services/Logger';
import { ApiResponse } from 'apisauce';

const handleResponse = (
    response: ApiResponse<any>,
    context: string,
    currentCartToken?: string
): { data: CartData; token: string } => {
    if (response.problem) {
        log.error(`API: ${context} failed`, { error: response.problem });
        throw new Error(response.problem);
    }

    if (!response.data) {
        log.error(`API: No data returned from ${context}`);
        throw new Error(`No data returned from ${context}`);
    }

    // Headers are a plain object in apisauce
    const newCartToken = response.headers?.['cart-token'] as string | undefined;
    const token = newCartToken || currentCartToken;

    if (!token) {
        log.error('API: Cart token not found in response headers');
        throw new Error('Cart token not found');
    }

    log.info(`API: ${context} success.`);
    return { data: mapCartData(response.data), token };
};


/**
 * Fetches the cart from the API.
 * @returns {Promise<{data: CartData, token: string}>} The cart data and token.
 */
export async function fetchCart(): Promise<{ data: CartData; token: string }> {
    log.info('API: Fetching new cart...');
    // 3. Use the apisauce client
    const response = await api.get<any>(ENDPOINTS.CART.GET());
    return handleResponse(response, 'fetchCart');
}

/**
 * Adds an item to the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {number} id - The product ID to add.
 * @param {number} quantity - The quantity of the product to add.
 * @param {object[]} variation - The product variation attributes.
 * @returns {Promise<{data: CartData, token: string}>} An object containing the updated cart data.
 */
export async function addItem({ cartToken, id, quantity, variation }: { cartToken: string, id: number, quantity: number, variation: { attribute: string; value: string }[] }): Promise<{ data: CartData; token: string }> {
    const payload = { id, quantity, variation };
    log.info('API: addItem called.');

    const response = await api.post<any>(
        ENDPOINTS.CART.ADD_ITEM(),
        payload,
        { headers: { 'cart-token': cartToken } } // Pass headers in the config object
    );

    return handleResponse(response, 'addItem', cartToken);
}

/**
 * Updates an item's quantity in the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The unique key of the item in the cart.
 * @param {number} quantity - The new quantity for the item.
 * @returns {Promise<{data: CartData, token: string}>} An object containing the updated cart data.
 */
export async function updateItem({ cartToken, key, quantity }: { cartToken: string, key: string, quantity: number }): Promise<{ data: CartData; token: string }> {
    log.info('API: updateItem called.');
    const response = await api.post<any>(
        ENDPOINTS.CART.UPDATE_ITEM(),
        { key, quantity },
        { headers: { 'cart-token': cartToken } }
    );
    return handleResponse(response, 'updateItem', cartToken);
}

/**
 * Removes an item from the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The unique key of the item in the cart.
 * @returns {Promise<{data: CartData, token: string}>} An object containing the updated cart data.
 */
export async function removeItem({ cartToken, key }: { cartToken: string, key: string }): Promise<{ data: CartData; token: string }> {
    log.info('API: removeItem called.');
    // Note: apisauce's delete method signature is (url, params, axiosConfig)
    // To send a body or custom headers, you pass them in the config.
    const response = await api.post<any>( // Woocommerce uses POST for removal
        ENDPOINTS.CART.REMOVE_ITEM(),
        { key },
        { headers: { 'cart-token': cartToken } }
    );
    return handleResponse(response, 'removeItem', cartToken);
}