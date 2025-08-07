import { CartData, CartItemData } from '@/models/Cart/Cart';
import { Purchasable } from '@/models/Product/Purchasable';
import { AddItemOptions, useCartStore } from '@/stores/CartStore';
import { useToastController } from '@tamagui/toast';
import React, { createContext, useContext, useMemo } from 'react';

interface CartInteractionOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

interface CartContextType {
    cart: CartData;
    isUpdating: boolean;
    addItem: (validatedPurchasable: Purchasable, options?: CartInteractionOptions) => void;
    updateItem: (key: string, quantity: number) => void;
    removeItem: (key: string, options?: CartInteractionOptions) => void;
    getItem: (key: string) => CartItemData | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toastController = useToastController();
    const {
        cart,
        isUpdating,
        addItem: storeAddItem,
        updateItem: storeUpdateItem,
        removeItem: storeRemoveItem,
    } = useCartStore();


    const getItem = (key: string) => cart!.items.find((i) => i.key === key);

    const addItem = async (validatedPurchasable: Purchasable, options: CartInteractionOptions = {}) => {
        if (!validatedPurchasable.isValid) {
            throw new Error(validatedPurchasable.message);
        }


        const { product, productVariation } = validatedPurchasable;

        const parsedVariation = productVariation?.getParsedVariation() || [];
        const variation = parsedVariation.map(attr => ({ attribute: attr.name, value: attr.value }));

        const addItemOptions: AddItemOptions = {
            id: product.id,
            quantity: 1,
            variation,
        };

        await storeAddItem(addItemOptions);

        if (!options.silent) {
            toastController.show('Lagt til i handlekurven', {
                message: product.name,
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
        cart: cart!,
        isUpdating,
        addItem,
        updateItem,
        removeItem,
        getItem,
    }), [cart, isUpdating]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCartContext must be used within a CartProvider');
    return context;
};
