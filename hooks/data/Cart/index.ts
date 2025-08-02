import { AddItemMutation, RemoveItemMutation, UpdateItemMutation } from '@/models/Cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addItem as apiAddItem, removeItem as apiRemoveItem, updateItem as apiUpdateItem } from './api';
import { cartQueryOptions } from './queries';

// A generic mutation hook for cart operations
export const useCartMutation = <TVariables extends Record<string, any>>(
    mutationFn: (vars: TVariables & { cartToken: string }) => Promise<any>,
    errorMessage: string
) => {
    const queryClient = useQueryClient();
    // Get cart data from cache to access the token
    const cart: any = queryClient.getQueryData(cartQueryOptions().queryKey);
    const cartToken = cart?.getCartToken();

    return useMutation({
        mutationFn: (variables: TVariables) => {
            if (!cartToken) {
                return Promise.reject(new Error('Cart token not found'));
            }
            return mutationFn({ ...variables, cartToken });
        },
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

    cart?.setMutations(addItem as AddItemMutation, updateItem as UpdateItemMutation, removeItem as RemoveItemMutation);

    const isUpdating = isAddingItem || isUpdatingItem || isRemovingItem;

    return {
        cart,
        isLoading,
        isUpdating,
        addItem,
        updateItem,
        removeItem,
    };
};
