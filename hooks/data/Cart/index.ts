import { AddItemMutation, cart, CartData, RemoveItemMutation, UpdateItemMutation } from '@/models/Cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addItem as apiAddItem, removeItem as apiRemoveItem, updateItem as apiUpdateItem, fetchCart } from './api';

export const useCartQuery = () => {
    return useQuery<CartData, Error>({
        queryKey: ['cart'],
        queryFn: fetchCart,
        enabled: true, // Fetch cart data immediately
    });
};

// A generic mutation hook for cart operations
export const useCartMutation = <TVariables extends Record<string, any>>(
    mutationFn: (vars: TVariables & { cartToken: string }) => Promise<CartData>,
    errorMessage: string
) => {
    const queryClient = useQueryClient();
    const cartToken = cart.getCartToken();

    return useMutation<CartData, Error, TVariables>({
        mutationFn: (variables: TVariables) => {
            if (!cartToken) {
                return Promise.reject(new Error('Cart token not found'));
            }
            return mutationFn({ ...variables, cartToken });
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['cart'], data);
            cart.setData(data);
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
    const { data, isLoading } = useCartQuery();

    if (data) {
        cart.setData(data);
    }

    const { mutate: addItem, isPending: isAddingItem } = useCartMutation(apiAddItem, 'Error adding item to cart:');
    const { mutate: updateItem, isPending: isUpdatingItem } = useCartMutation(apiUpdateItem, 'Error updating item in cart:');
    const { mutate: removeItem, isPending: isRemovingItem } = useCartMutation(apiRemoveItem, 'Error removing item from cart:');

    cart.setMutations(addItem as AddItemMutation, updateItem as UpdateItemMutation, removeItem as RemoveItemMutation);

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
