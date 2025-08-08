import { ENDPOINTS } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from 'apisauce';

interface RestoreTokenResponse {
    success: boolean;
    restore_token?: string;
    message?: string;
}

/**
 * Creates a WooCommerce cart restore token and returns the token string.
 * Leave URL construction to config (ENDPOINTS.CHECKOUT.CHECKOUT).
 * @param jwtToken - The JWT token to exchange for a cart restore token.
 * @returns Promise<string> - The restore token.
 */
export async function createCartRestoreToken(jwtToken: string): Promise<string> {
    const payload = { jwt_token: jwtToken };

    const response: ApiResponse<RestoreTokenResponse> = await apiClient.post(
        ENDPOINTS.CHECKOUT.CART_RESTORE_TOKEN(),
        payload
    );

    if (response.problem) {
        throw new Error(response.problem);
    }

    if (!response.data) {
        throw new Error('No data returned from createCartRestoreToken');
    }

    const { success, restore_token, message } = response.data;

    if (!success) {
        throw new Error(message || 'Failed to create restore token');
    }

    if (!restore_token) {
        throw new Error('Missing restore_token in response');
    }

    return restore_token;
}