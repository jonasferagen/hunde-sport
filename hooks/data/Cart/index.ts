import { AddItemMutation, CartData, RemoveItemMutation, UpdateItemMutation } from '@/models/Cart';
import { useCartStore, useIsCartReady } from '@/stores/CartStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { addItem as apiAddItem, removeItem as apiRemoveItem, updateItem as apiUpdateItem, fetchCart } from './api';

export const useCartQuery = () => {
    const { setData } = useCartStore.getState();
    const isCartReady = useIsCartReady();

    const queryResult = useQuery<CartData, Error>({
        queryKey: ['cart'],
        queryFn: fetchCart,
        enabled: isCartReady, // Only fetch cart when the store is ready and token is available
        retry: 1,
    });

    // Effect to update the store when the query successfully fetches data.
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
    const { setData } = useCartStore.getState();

    return useMutation<CartData, Error, TVariables & { optimisticUpdateTimestamp?: number }>({
        mutationFn: (variables: TVariables) => {
            const { cartToken } = useCartStore.getState();
            if (!cartToken) {
                throw new Error('Cart token not found for mutation');
            }
            return mutationFn({ ...variables, cartToken });
        },
        onSuccess: (data, variables) => {
            const { lastUpdated } = useCartStore.getState();

            // Only update if this mutation is not stale
            if (variables.optimisticUpdateTimestamp && variables.optimisticUpdateTimestamp < lastUpdated) {
                return;
            }
            setData(data);
            queryClient.setQueryData(['cart'], data);
        },
        onError: (error) => {
            console.error(errorMessage, error);
        },
    });
};

/**
 * Hook to initialize cart mutations and fetch initial cart data.
 * It connects the API mutation hooks to the central cart store.
 */
export const useCartData = () => {
    const { setMutations } = useCartStore();
    const { isLoading } = useCartQuery();

    const { mutate: addItem, isPending: isAddingItem } = useCartMutation(apiAddItem, 'Error adding item to cart:');
    const { mutate: updateItem, isPending: isUpdatingItem } = useCartMutation(apiUpdateItem, 'Error updating item in cart:');
    const { mutate: removeItem, isPending: isRemovingItem } = useCartMutation(apiRemoveItem, 'Error removing item from cart:');

    // Effect to register the mutation functions with the store
    useEffect(() => {
        setMutations({
            addItem: addItem as AddItemMutation,
            updateItem: updateItem as UpdateItemMutation,
            removeItem: removeItem as RemoveItemMutation
        });
    }, [addItem, updateItem, removeItem, setMutations]);

    const isUpdating = isAddingItem || isUpdatingItem || isRemovingItem;

    // Return loading and updating states for consumers like the Preloader
    return {
        isLoading,
        isUpdating,
    };
};
