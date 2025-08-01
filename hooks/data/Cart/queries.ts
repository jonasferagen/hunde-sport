import { queryOptions } from '@tanstack/react-query';
import { fetchCart } from './api';

/**
 * Defines the query options for fetching the cart.
 * @returns {import('@tanstack/react-query').QueryOptions} The query options.
 */
export const cartQueryOptions = () =>
    queryOptions({
        queryKey: ['cart'],
        queryFn: fetchCart,
    });
