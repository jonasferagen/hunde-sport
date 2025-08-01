import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { cartQueryOptions } from './queries';

/**
 * Hook to fetch and manage the cart data.
 * @returns The result of the query, including the cart data and token.
 */
export const useCart = () => {
    const result = useQuery(cartQueryOptions());
    const { data, cartToken } = useMemo(() => ({
        data: result.data?.data,
        cartToken: result.data?.cartToken,
    }), [result.data]);

    console.log(data.items);

    return {
        ...result,
        cart: data,
        cartToken,
    };
};
