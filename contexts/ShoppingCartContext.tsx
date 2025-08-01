import { ClearCartDialog } from '@/components/features/shopping-cart/ClearCartDialog';
import { routes } from '@/config/routes';
import { useCart } from '@/hooks/data/Cart';
import { Cart } from '@/models/Cart';
import { Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import React, { createContext, RefObject, useCallback, useMemo, useState } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: RefObject<any>;
}

interface ShoppingCartContextType {
    cart: Cart | undefined;
    addItem: (purchasable: Purchasable) => void;
    updateItem: (key: string, quantity: number) => void;
    removeItem: (key: string, options?: CartItemOptions) => void;
    isUpdating: boolean;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cart, isUpdating } = useCart();

    const toastController = useToastController();

    const items = cart?.items ?? [];

    const [isClearCartDialogOpen, setClearCartDialogOpen] = useState(false);

    const addItem = useCallback(
        (purchasable: Purchasable) => {
            if (!cart) return;


            cart.addItem(purchasable);
            toastController.show('Lagt til i handlekurven', {
                message: purchasable.product.name,
                theme: 'dark_yellow',
            });
            //  originalAddItem({ cartToken: cart.cart_token, purchasable });
        },
        [cart, toastController]
    );

    const updateItem = useCallback(
        (key: string, quantity: number) => {
            if (!cart) return;
            cart.updateItem(key, quantity);
        },
        [cart]
    );

    const removeItem = useCallback((key: string, options: CartItemOptions = { silent: false }) => {
        const { silent = false, triggerRef } = options;
        if (!cart) return;

        cart.removeItem(key);

        if (!silent) {
            const item = items.find(i => i.key === key);
            if (item) {
                const title = item.product.name;
                toastController.show('Fjernet fra handlekurven', {
                    message: title,
                    theme: 'dark_yellow',
                    triggerRef: triggerRef,
                });
            }
        }
    }, [toastController, cart]);

    const handleConfirmClearCart = () => {

        toastController.show('Handlekurven er tømt', {
            message: 'Du har ingen produkter i handlekurven',
            theme: 'dark_yellow',
        });
        router.push(routes.index.path());
        setClearCartDialogOpen(false);
    };


    const value = useMemo(
        () => ({
            cart,
            addItem,
            updateItem,
            removeItem,
            isUpdating,
        }),
        [
            cart,
            addItem,
            updateItem,
            removeItem,
            isUpdating,
        ]
    );

    return (
        <ShoppingCartContext.Provider value={value}>
            {children}

            <ClearCartDialog
                isOpen={isClearCartDialogOpen}
                onConfirm={handleConfirmClearCart}
                onCancel={() => setClearCartDialogOpen(false)}
            />
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCartContext = () => {
    const context = React.useContext(ShoppingCartContext);
    if (context === undefined) {
        throw new Error('useShoppingCartContext must be used within a ShoppingCartProvider');
    }
    return context;
};
