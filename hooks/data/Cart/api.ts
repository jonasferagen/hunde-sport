import { ENDPOINTS } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { CartData } from '@/models/Cart/Cart';
import { mapCartData } from '@/models/Cart/CartMapper';
import { ApiResponse } from 'apisauce';

const handleResponse = (
    response: ApiResponse<any>,
    context: string,
    currentCartToken?: string
): { data: CartData } => {
    if (response.problem) {
        throw new Error(response.problem);
    }

    if (!response.data) {
        throw new Error(`No data returned from ${context}`);
    }

    const token = response.headers?.['cart-token'] as string | undefined;

    if (!token) {
        throw new Error('Cart token not found in response headers');
    }

    return { data: mapCartData(response.data, token) };
};


/**
 * Fetches the cart from the API.
 * @returns {Promise<{data: CartData}>} The cart data and token.
 */
export async function fetchCart(): Promise<{ data: CartData }> {

    const response = await apiClient.get<any>(ENDPOINTS.CART.GET());
    return handleResponse(response, 'fetchCart');
}

/**
 * Adds an item to the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {number} id - The product ID to add.
 * @param {number} quantity - The quantity of the product to add.
 * @param {object[]} variation - The product variation attributes.
 * @returns {Promise<{data: CartData}>} An object containing the updated cart data.
 */
export async function addItem(cartToken: string, { id, quantity, variation }: { id: number, quantity: number, variation: { attribute: string; value: string }[] }): Promise<{ data: CartData }> {
    apiClient.headers['cart-token'] = cartToken;

    const payload = { id, quantity, variation };
    const response = await apiClient.post<any>(
        ENDPOINTS.CART.ADD_ITEM(),
        payload
    );

    return handleResponse(response, 'addItem');
}

/**
 * Updates an item's quantity in the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The unique key of the item in the cart.
 * @param {number} quantity - The new quantity for the item.
 * @returns {Promise<{data: CartData}>} An object containing the updated cart data.
 */
export async function updateItem(cartToken: string, { key, quantity }: { key: string, quantity: number }): Promise<{ data: CartData }> {
    apiClient.headers['cart-token'] = cartToken;
    const response = await apiClient.post<any>(
        ENDPOINTS.CART.UPDATE_ITEM(),
        { key, quantity }
    );
    return handleResponse(response, 'updateItem');
}

/**
 * Removes an item from the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {string} key - The unique key of the item in the cart.
 * @returns {Promise<{data: CartData}>} An object containing the updated cart data.
 */
export async function removeItem(cartToken: string, { key }: { key: string }): Promise<{ data: CartData }> {
    apiClient.headers['cart-token'] = cartToken;
    const response = await apiClient.post<any>( // Woocommerce uses POST for removal
        ENDPOINTS.CART.REMOVE_ITEM(),
        { key }
    );
    return handleResponse(response, 'removeItem');
}