import { CartData, CartItemData } from '@/models/Cart/Cart';
import { AddItemOptions, useCartStore } from '@/stores/CartStore';
import { ValidatedPurchasable } from '@/utils/purchasableUtils';
import { useToastController } from '@tamagui/toast';
import React, { createContext, useContext, useMemo } from 'react';

interface CartInteractionOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

interface CartContextType {
    cart: CartData;
    isUpdating: boolean;
    addItem: (validatedPurchasable: ValidatedPurchasable, options?: CartInteractionOptions) => void;
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

    // Safeguard against race conditions during hot reloads in development.
    // If the cart is not yet initialized, we'll wait before rendering the children.
    if (!cart) {
        return null;
    }

    const getItem = (key: string) => cart.items.find((i) => i.key === key);

    const addItem = async (validatedPurchasable: ValidatedPurchasable, options: CartInteractionOptions = {}) => {
        if (!validatedPurchasable.isValid) {
            throw new Error(validatedPurchasable.message);
        }

        if (validatedPurchasable.productVariation) {
            console.log(validatedPurchasable.productVariation);
        }

        const { product, productVariation } = validatedPurchasable;

        const variation = productVariation?.getParsedVariation() || [];

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
        cart,
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
