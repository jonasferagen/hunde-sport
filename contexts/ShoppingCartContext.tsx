import { ClearCartDialog } from '@/components/features/shopping-cart/ClearCartDialog';
import { routes } from '@/config/routes';
import { useCart } from '@/hooks/data/Cart';
import { Cart } from '@/models/Cart';
import { Product, Purchasable, ShoppingCartItem } from '@/types';
import { getPurchasableKey, getPurchasableTitle } from '@/utils/purchasable';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import React, { createContext, RefObject, useCallback, useContext, useMemo, useState } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: RefObject<any>;
}

interface ShoppingCartContextType {
    items: ShoppingCartItem[];
    groupedItems: { product: Product; items: ShoppingCartItem[] }[];
    cartItemCount: number;
    cartTotal: number;
    getQuantity: (purchasable: Purchasable) => number;
    increaseQuantity: (purchasable: Purchasable, options?: CartItemOptions) => void;
    decreaseQuantity: (purchasable: Purchasable, options?: CartItemOptions) => void;
    removeItem: (purchasable: Purchasable, options?: CartItemOptions) => void;
    clearCart: () => void;
    addItem: (purchasable: Purchasable) => void;
    cart: Cart | undefined;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cart, addItem: addItemMutation, isAddingItem, isLoading } = useCart();


    const toastController = useToastController();

    const items = [] as ShoppingCartItem[];

    const [isClearCartDialogOpen, setClearCartDialogOpen] = useState(false);

    const addItem = useCallback(
        (purchasable: Purchasable) => {
            if (!cart) return;
            cart.addItem(purchasable, 1, [], addItemMutation);
        },
        [addItemMutation, cart]
    );

    const getQuantity = useCallback(
        (purchasable: Purchasable) => {
            const key = getPurchasableKey(purchasable);
            const cartItem = items.find((item) => item.key === key);
            return cartItem?.quantity ?? 0;
        },
        [items]
    );

    const increaseQuantity = useCallback(
        (purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {
            const { silent, triggerRef } = options;
            const key = getPurchasableKey(purchasable);

            if (!cart) return;
            cart.addItem(purchasable, getQuantity(purchasable) + 1, [], addItemMutation);

            if (!silent) {
                const product = getPurchasableTitle(purchasable);

                toastController.show('Lagt til i handlekurven', {
                    message: product,
                    theme: 'dark_green',
                    triggerRef,
                });
            }
        },
        [toastController, getQuantity, addItemMutation, cart]
    );

    const decreaseQuantity = useCallback((purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {

        const { triggerRef } = options;
        const key = getPurchasableKey(purchasable);


    }, [getQuantity, addItemMutation]);

    const removeItem = useCallback((purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {
        const { silent = false, triggerRef } = options;
        const key = getPurchasableKey(purchasable);



        if (!silent) {
            const title = getPurchasableTitle(purchasable);
            toastController.show('Fjernet fra handlekurven', {
                message: title,
                theme: 'dark_yellow',
                ref: triggerRef,
            });
        }
    }, [toastController, addItemMutation]);

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

    const cartItemCount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const cartTotal = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
    }, [items]);

    const groupedItems = useMemo(() => {
        const groups: { [key: number]: { product: Product; items: ShoppingCartItem[] } } = {};

        for (const item of items) {
            const productId = item.purchasable.product.id;
            if (!groups[productId]) {
                groups[productId] = { product: item.purchasable.product, items: [] };
            }
            groups[productId].items.push(item);
        }

        return Object.values(groups);
    }, [items]);

    const value = useMemo(
        () => ({
            items,
            groupedItems,
            cartItemCount,
            cartTotal,
            getQuantity,
            increaseQuantity,
            decreaseQuantity,
            removeItem,
            clearCart,
            addItem,
            cart,
        }),
        [
            items,
            groupedItems,
            cartItemCount,
            cartTotal,
            getQuantity,
            increaseQuantity,
            decreaseQuantity,
            removeItem,
            clearCart,
            addItem,
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
    const context = useContext(ShoppingCartContext);
    if (context === undefined) {
        throw new Error('useShoppingCartContext must be used within a ShoppingCartProvider');
    }
    return context;
};
