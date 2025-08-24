import { ENDPOINTS } from '@/config/api';
import { Cart, mapToCart } from '@/domain/Cart/Cart';
import { apiClient } from '@/lib/apiClient';
import { ApiError } from '@/lib/httpError';
import { ApiResponse } from 'apisauce';

const handleResponse = (
    response: ApiResponse<any>,
    context: string,
): Cart => {
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

    return mapToCart(response.data, token);
};


/**
 * Fetches the cart from the API.
 * @returns {Promise<Cart>} The cart data and token.
 */
export async function fetchCart(): Promise<Cart> {

    /*
        if (Math.random() < 0.99) {
            throw new ApiError('Simulated category fetch failure', {
                status: 500,
                retriable: true,
                problem: 'SERVER_ERROR',
                isNetworkError: false,
            });
        } */
    const response = await apiClient.get<any>(ENDPOINTS.CART.GET());
    return handleResponse(response, 'fetchCart');
}

/**
 * Adds an item to the cart.
 * @param {string} cartToken - The cart token for the current session.
 * @param {number} id - The product ID to add.
 * @param {number} quantity - The quantity of the product to add.
 * @param {object[]} variation - The product variation attributes.
 * @returns {Promise<Cart>} An object containing the updated cart data.
 */
export async function addItem(cartToken: string, {
    id,
    quantity,
    variation }: {
        id: number,
        quantity: number,
        variation: { attribute: string; value: string }[]
    }): Promise<Cart> {
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
 * @returns {Promise<Cart>} An object containing the updated cart data.
 */
export async function updateItem(
    cartToken: string,
    { key, quantity }: { key: string, quantity: number }): Promise<Cart> {
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
 * @returns {Promise<Cart>} An object containing the updated cart data.
 */
export async function removeItem(cartToken: string, { key }: { key: string }): Promise<Cart> {
    apiClient.headers['cart-token'] = cartToken;
    const response = await apiClient.post<any>( // Woocommerce uses POST for removal
        ENDPOINTS.CART.REMOVE_ITEM(),
        { key }
    );
    return handleResponse(response, 'removeItem');
}