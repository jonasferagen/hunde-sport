import { ClearCartDialog } from '@/components/features/shoppingCart/ClearCartDialog';
import { routes } from '@/config/routes';
import { Product, Purchasable, ShoppingCartItem } from '@/types';
import { getPurchasableKey, getPurchasableTitle } from '@/utils/purchasable';
import { useToastController } from '@tamagui/toast';
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
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ShoppingCartItem[]>([]);
    const toastController = useToastController();

    const [isClearCartDialogOpen, setClearCartDialogOpen] = useState(false);


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

            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.key === key);

                if (existingItem) {
                    return prevItems.map((item) =>
                        item.key === key
                            ? new ShoppingCartItem(purchasable, item.quantity + 1, triggerRef)
                            : item
                    );
                } else {
                    const newItem = new ShoppingCartItem(purchasable, 1, triggerRef);
                    return [...prevItems, newItem];
                }
            });

            if (!silent) {
                const product = getPurchasableTitle(purchasable);

                toastController.show('Lagt til i handlekurven', {
                    message: product,
                    theme: 'dark_green',
                    triggerRef
                });
            }
        },
        [toastController]
    );

    const removeItem = useCallback((purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {
        const { silent = false, triggerRef } = options;
        const key = getPurchasableKey(purchasable);
        setItems((prevItems) => prevItems.filter((item) => item.key !== key));

        if (!silent) {
            const title = getPurchasableTitle(purchasable);
            toastController.show('Fjernet fra handlekurven', {
                message: title,
                theme: 'dark_yellow',
                ref: triggerRef
            });
        }
    }, [toastController]);

    const decreaseQuantity = useCallback((purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {

        const { triggerRef } = options;
        const key = getPurchasableKey(purchasable);

        setItems((prevItems) => {
            const itemToDecrease = prevItems.find((item) => item.key === key);

            if (itemToDecrease && itemToDecrease.quantity <= 1) {
                return prevItems; // Do nothing if quantity is already 1 or less
            }

            const updatedItems = prevItems.map((item) => {
                if (item.key === key) {
                    const newQuantity = item.quantity - 1;
                    return new ShoppingCartItem(purchasable, newQuantity, triggerRef);
                }
                return item;
            });

            return updatedItems;
        });
    }, []);

    const handleConfirmClearCart = () => {
        setItems([]);
        toastController.show('Handlekurven er tømt', {
            message: 'Du har ingen produkter i handlekurven',
            theme: 'dark_yellow',
        });
        routes.home();
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

        }),
        [items, cartItemCount, cartTotal, clearCart]
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
