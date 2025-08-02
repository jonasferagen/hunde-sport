import { AddItemMutation, CartData, RemoveItemMutation, UpdateItemMutation, useCartStore } from '@/models/Cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { addItem as apiAddItem, removeItem as apiRemoveItem, updateItem as apiUpdateItem, fetchCart } from './api';

export const useCartQuery = () => {
    const { setData } = useCartStore.getState();
    const queryResult = useQuery<CartData, Error>({
        queryKey: ['cart'],
        queryFn: fetchCart,
        enabled: true, // Fetch cart data immediately
    });

    useEffect(() => {
        if (queryResult.data) {
            setData(queryResult.data);
        }
    }, [queryResult.data, setData]);

    return queryResult;
};

// A generic mutation hook for cart operations
export const useCartMutation = <TVariables extends Record<string, any>>(
    mutationFn: (vars: TVariables & { cartToken: string }) => Promise<CartData>,
    errorMessage: string
) => {
    const queryClient = useQueryClient();

    return useMutation<CartData, Error, TVariables & { optimisticUpdateTimestamp?: number }>({
        mutationFn: (variables: TVariables) => {
            const { cartToken } = useCartStore.getState();
            if (!cartToken) {
                return Promise.reject(new Error('Cart token not found'));
            }
            return mutationFn({ ...variables, cartToken });
        },
        onSuccess: (data, variables) => {
            const { setData, lastUpdated } = useCartStore.getState();

            // Only update if this mutation is not stale
            if (variables.optimisticUpdateTimestamp && variables.optimisticUpdateTimestamp < lastUpdated) {
                return;
            }

            queryClient.setQueryData(['cart'], data);
            setData(data);
        },
        onError: (error) => {
            console.error(errorMessage, error);
        },
    });
};

export const useInitializeCart = () => {
    useCartQuery();
};

/**
 * Hook to fetch and manage the cart data.
 * @returns The result of the query, including the cart data, token, and functions to modify the cart.
 */
export const useCartData = () => {
    const state = useCartStore();
    const { isLoading } = useCartQuery();

    const { mutate: addItem, isPending: isAddingItem } = useCartMutation(apiAddItem, 'Error adding item to cart:');
    const { mutate: updateItem, isPending: isUpdatingItem } = useCartMutation(apiUpdateItem, 'Error updating item in cart:');
    const { mutate: removeItem, isPending: isRemovingItem } = useCartMutation(apiRemoveItem, 'Error removing item from cart:');

    useEffect(() => {
        state.setMutations({
            addItem: addItem as AddItemMutation,
            updateItem: updateItem as UpdateItemMutation,
            removeItem: removeItem as RemoveItemMutation
        });
    }, [addItem, updateItem, removeItem, state.setMutations]);

    const isUpdating = isAddingItem || isUpdatingItem || isRemovingItem;

    return {
        ...state,
        isLoading,
        isUpdating,
    };
};
