import { useCartStore } from '@/stores/CartStore';
import { Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import React, { createContext, useContext, useMemo } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

type ShoppingCartContextType = ReturnType<typeof useCartStore> & {
    addCartItem: (purchasable: Purchasable, options?: CartItemOptions) => void;
    updateCartItem: (key: string, quantity: number) => void;
    removeCartItem: (key: string, options?: CartItemOptions) => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = useCartStore();
    const toastController = useToastController();

    const addCartItem = (purchasable: Purchasable, options: CartItemOptions = {}) => {

        const productVariation = purchasable.productVariation;
        const variation = !productVariation ? [] : productVariation.variation_attributes.map((attribute: any) => ({ attribute: attribute.name, value: attribute.value }));

        store.addItem({ id: purchasable.product.id, quantity: 1, variation });

        if (!options.silent) {
            toastController.show('Lagt til i handlekurven', {
                message: purchasable.product.name,
                theme: 'dark_yellow',
                triggerRef: options.triggerRef,
            });
        }
    };

    const updateCartItem = (key: string, quantity: number) => {
        store.updateItem(key, quantity);
    };

    const removeCartItem = (key: string, options: CartItemOptions = {}) => {
        const item = store.getItem(key);
        if (item) {
            const productName = item.product.name;
            store.removeItem(key);

            if (!options.silent) {
                toastController.show('Fjernet fra handlekurven', {
                    message: productName,
                    theme: 'dark_yellow',
                    triggerRef: options.triggerRef,
                });
            }
        }
    };

    const value = useMemo(() => ({
        ...store,
        addCartItem,
        updateCartItem,
        removeCartItem,
    }), [store]);

    return (
        <ShoppingCartContext.Provider value={value}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCartContext = () => {
    const context = useContext(ShoppingCartContext);
    if (!context) throw new Error('useShoppingCartContext must be used within a ShoppingCartProvider');
    return context;
};
