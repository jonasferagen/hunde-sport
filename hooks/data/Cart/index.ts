import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addItem as apiAddItem, removeItem as apiRemoveItem, updateItem as apiUpdateItem } from './api';
import { cartQueryOptions } from './queries';

// A generic mutation hook for cart operations
export const useCartMutation = (mutationFn: (...args: any[]) => Promise<any>, errorMessage: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: (data) => {
            queryClient.setQueryData(cartQueryOptions().queryKey, data.data);
        },
        onError: (error) => {
            console.error(errorMessage, error);
        },
    });
};

/**
 * Hook to fetch and manage the cart data.
 * @returns The result of the query, including the cart data, token, and functions to modify the cart.
 */
export const useCart = () => {
    const { data: cart, isLoading } = useQuery(cartQueryOptions());

    const { mutate: addItem, isPending: isAddingItem } = useCartMutation(apiAddItem, 'Error adding item to cart:');
    const { mutate: updateItem, isPending: isUpdatingItem } = useCartMutation(apiUpdateItem, 'Error updating item in cart:');
    const { mutate: removeItem, isPending: isRemovingItem } = useCartMutation(apiRemoveItem, 'Error removing item from cart:');

    return {
        cart,
        isLoading,
        addItem,
        isAddingItem,
        updateItem,
        isUpdatingItem,
        removeItem,
        isRemovingItem,
    };
};
