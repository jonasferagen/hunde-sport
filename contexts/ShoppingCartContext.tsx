import { ClearCartDialog } from '@/components/features/shopping-cart/ClearCartDialog';
import { routes } from '@/config/routes';
import { useCart } from '@/hooks/data/Cart';
import { Cart, CartItem } from '@/models/Cart';
import { Product, Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import React, { createContext, RefObject, useCallback, useMemo, useState } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: RefObject<any>;
}

interface ShoppingCartContextType {
    items: CartItem[];
    groupedItems: { product: Product; items: CartItem[] }[];
    updateItem: (key: string, quantity: number) => void;
    removeItem: (key: string, options?: CartItemOptions) => void;
    clearCart: () => void;
    addItem: (purchasable: Purchasable) => void;
    cart: Cart | undefined;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cart, addItem: addItemMutation, updateItem: updateItemMutation, removeItem: removeItemMutation } = useCart();

    const toastController = useToastController();

    const items = cart?.items ?? [];

    const [isClearCartDialogOpen, setClearCartDialogOpen] = useState(false);
    1
    const addItem = useCallback(
        (purchasable: Purchasable) => {

            const product = purchasable.product;
            const productVariation = purchasable.productVariation;
            const variation = productVariation ? productVariation.variation_attributes?.map((attr) => ({ attribute: attr.name, value: attr.value })) : [];
            const id = product.id;

            if (!cart?.cart_token) return;

            const title = product.name;
            toastController.show('Lagt til i handlekurven', {
                message: title,
                theme: 'dark_yellow',
            });


            addItemMutation({ cartToken: cart.cart_token, id, quantity: 1, variation });
        },
        [addItemMutation, cart]
    );

    const updateItem = useCallback(
        (key: string, quantity: number) => {
            if (!cart?.cart_token) return;
            updateItemMutation({ cartToken: cart.cart_token, key, quantity });
        },
        [updateItemMutation, cart]
    );

    const removeItem = useCallback((key: string, options: CartItemOptions = { silent: false }) => {
        const { silent = false, triggerRef } = options;
        if (!cart?.cart_token) return;

        removeItemMutation({ cartToken: cart.cart_token, key });

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
    }, [toastController, removeItemMutation, cart, items]);

    const handleConfirmClearCart = () => {

        toastController.show('Handlekurven er tømt', {
            message: 'Du har ingen produkter i handlekurven',
            theme: 'dark_yellow',
        });
        router.push(routes.index.path());
        setClearCartDialogOpen(false);
    };

    const clearCart = useCallback(() => {
        setClearCartDialogOpen(true);
    }, []);

    const groupedItems = useMemo(() => {
        const groups: { [key: number]: { product: Product; items: CartItem[] } } = {};

        for (const item of items) {
            const productId = item.product.id;
            if (!groups[productId]) {
                groups[productId] = { product: item.product, items: [] };
            }
            groups[productId].items.push(item);
        }

        return Object.values(groups);
    }, [items]);

    const value = useMemo(
        () => ({
            items,
            groupedItems,
            removeItem,
            clearCart,
            addItem,
            updateItem,
            cart,
        }),
        [
            items,
            groupedItems,
            removeItem,
            clearCart,
            addItem,
            updateItem,
            cart,
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
