import { CartData, CartItemData } from '@/models/Cart/Cart';
import { AddItemOptions, useCartStore } from '@/stores/CartStore';
import { Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import React, { createContext, useContext, useMemo } from 'react';

interface CartInteractionOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

interface ShoppingCartContextType {
    cart: CartData | null;
    isInitialized: boolean;
    isLoading: boolean;
    isUpdating: boolean;
    addItem: (purchasable: Purchasable, options?: CartInteractionOptions) => void;
    updateItem: (key: string, quantity: number) => void;
    removeItem: (key: string, options?: CartInteractionOptions) => void;
    getItem: (key: string) => CartItemData | undefined;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toastController = useToastController();
    const {
        cart,
        isInitialized,
        isLoading,
        isUpdating,
        addItem: storeAddItem,
        updateItem: storeUpdateItem,
        removeItem: storeRemoveItem,
    } = useCartStore();

    const getItem = (key: string) => cart?.items.find((i) => i.key === key);

    const addItem = async (purchasable: Purchasable, options: CartInteractionOptions = {}) => {
        const productVariation = purchasable.productVariation;
        const variation = !productVariation
            ? []
            : productVariation.variation_attributes.map((attribute: any) => ({ attribute: attribute.name, value: attribute.value }));

        const addItemOptions: AddItemOptions = {
            id: purchasable.product.id,
            quantity: 1,
            variation,
        };

        await storeAddItem(addItemOptions);

        if (!options.silent) {
            toastController.show('Lagt til i handlekurven', {
                message: purchasable.product.name,
                theme: 'dark_yellow',
                triggerRef: options.triggerRef,
            });
        }
    };

    const updateItem = async (key: string, quantity: number) => {
        await storeUpdateItem(key, quantity);
    };

    const removeItem = async (key: string, options: CartInteractionOptions = {}) => {
        const item = getItem(key);
        if (item) {
            await storeRemoveItem(key);
            if (!options.silent) {
                toastController.show('Fjernet fra handlekurven', {
                    message: item.product.name,
                    theme: 'dark_yellow',
                    triggerRef: options.triggerRef,
                });
            }
        }
    };

    const value = useMemo(() => ({
        cart,
        isInitialized,
        isLoading,
        isUpdating,
        addItem,
        updateItem,
        removeItem,
        getItem,
    }), [cart, isInitialized, isLoading, isUpdating]);

    return (
        <ShoppingCartContext.Provider value={value as ShoppingCartContextType}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCartContext = () => {
    const context = useContext(ShoppingCartContext);
    if (!context) throw new Error('useShoppingCartContext must be used within a ShoppingCartProvider');
    return context;
};
