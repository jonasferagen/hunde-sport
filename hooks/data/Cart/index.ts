import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addItem as apiAddItem } from './api';
import { cartQueryOptions } from './queries';

export const useCartMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiAddItem,
        onSuccess: (data) => {
            queryClient.setQueryData(cartQueryOptions().queryKey, data.data);
        },
        onError: (error) => {
            console.error('Error adding item to cart:', error);
        },
    });
};

/**
 * Hook to fetch and manage the cart data.
 * @returns The result of the query, including the cart data, token, and an `addCartItem` function.
 */
export const useCart = () => {
    const { data: cart, isLoading } = useQuery(cartQueryOptions());
    const { mutate: addItem, isPending: isAddingItem } = useCartMutation();


    return {
        cart,
        isLoading,
        addItem,
        isAddingItem,
    };
};
