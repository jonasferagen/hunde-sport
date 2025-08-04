import { AddItemMutation, RemoveItemMutation, UpdateItemMutation } from '@/models/Cart';
import { useCartStore } from '@/stores/CartStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { addItem as apiAddItem, removeItem as apiRemoveItem, updateItem as apiUpdateItem, fetchCart } from './api';

export const useCartQuery = () => {
    const { setData } = useCartStore.getState();
    const queryResult = useQuery({
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
    mutationFn: (vars: TVariables & { cartToken: string }) => Promise<any>,
    errorMessage: string
) => {
    const queryClient = useQueryClient();

    return useMutation({
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
    return useCartData();
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
