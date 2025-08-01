import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

/**
 * Fetches the cart data from the store API.
 * @returns {Promise<any>} An object containing the cart data and the cart token.
 */
export async function fetchCart(): Promise<any> {
    const { data, error, headers } = await apiClient.get<any>(
        ENDPOINTS.CART.GET()
    );

    console.log('headers', headers);

    if (error) {
        throw new Error(error);
    }

    const cartToken = headers.get('cart-token');

    return { data, cartToken };
}
