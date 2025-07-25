import { ENDPOINTS } from '@/config/api';
import { Order } from '@/models/Order';
import apiClient from '@/utils/apiClient';

export async function postOrder(order: Order) {
    // The first argument to POST is the order, but it's not used in the URL construction.
    // The apiClient will send the order object as the request body.
    const { data, error } = await apiClient.post<any>(
        ENDPOINTS.ORDERS.POST(order),
        order
    );

    if (error) {
        console.error('Error posting order:', error);
        throw new Error('Failed to post order.');
    }

    console.log('API Response:', data);
    return data;
}
