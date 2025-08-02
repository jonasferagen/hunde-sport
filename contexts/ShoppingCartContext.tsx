import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useCartData, useInitializeCart } from '@/hooks/data/Cart';
import { Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import React, { createContext, useContext, useMemo } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

interface ShoppingCartContextType {
    cart: ReturnType<typeof useCartData>;
    isUpdating: boolean;
    addCartItem: (purchasable: Purchasable, options?: CartItemOptions) => void;
    updateCartItem: (key: string, quantity: number) => void;
    removeCartItem: (key: string, options?: CartItemOptions) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useInitializeCart();
    const cart = useCartData();
    const toastController = useToastController();

    const addCartItem = (purchasable: Purchasable, options: CartItemOptions = {}) => {
        if (!cart.addItem) return;

        const productVariation = purchasable.productVariation;
        const variation = !productVariation ? [] : productVariation.variation_attributes.map((attribute: any) => ({ attribute: attribute.name, value: attribute.value }));

        console.log("addItem");
        console.log(cart.items);

        cart.addItem({ id: purchasable.product.id, quantity: 1, variation });

        if (!options.silent) {
            toastController.show('Lagt til i handlekurven', {
                message: purchasable.product.name,
                theme: 'dark_yellow',
                triggerRef: options.triggerRef,
            });
        }
    };

    const updateCartItem = (key: string, quantity: number) => {

        console.log("updateitem");
        console.log(cart.items.length);

        cart.updateItemQuantity(key, quantity);
    };

    const removeCartItem = (key: string, options: CartItemOptions = {}) => {
        const item = cart.getItem(key);
        if (item) {
            const productName = item.product.name;
            cart.remove(key);

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
        cart,
        isUpdating: cart.isUpdating,
        addCartItem,
        updateCartItem,
        removeCartItem,
    }), [cart, cart.isUpdating]);

    if (cart.isLoading) {
        return <ThemedSpinner />;
    }

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
