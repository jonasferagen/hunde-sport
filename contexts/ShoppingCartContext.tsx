import { routes } from '@/config/routes';
import { Product, Purchasable, ShoppingCartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useStatusContext } from './StatusContext';

interface CartItemOptions {
    silent?: boolean;
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
    const { showMessage } = useStatusContext();

    const getQuantity = useCallback(
        (purchasable: Purchasable) => {
            const key = purchasable.productVariation
                ? `${purchasable.product.id}-${purchasable.productVariation.id}`
                : `${purchasable.product.id}-simple`;
            const cartItem = items.find((item) => item.key === key);
            return cartItem?.quantity ?? 0;
        },
        [items]
    );

    const decreaseQuantity = useCallback((purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {
        const key = purchasable.productVariation
            ? `${purchasable.product.id}-${purchasable.productVariation.id}`
            : `${purchasable.product.id}-simple`;
        setItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.key === key) {
                        return new ShoppingCartItem(purchasable, item.quantity - 1);
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const increaseQuantity = useCallback(
        (purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {
            const { silent } = options;

            const key = purchasable.productVariation
                ? `${purchasable.product.id}-${purchasable.productVariation.id}`
                : `${purchasable.product.id}-simple`;


            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.key === key);

                if (existingItem) {
                    return prevItems.map((item) =>
                        item.key === key
                            ? new ShoppingCartItem(purchasable, item.quantity + 1)
                            : item
                    );
                } else {
                    const newItem = new ShoppingCartItem(purchasable, 1);
                    return [...prevItems, newItem];
                }
            });

            if (!silent) {
                const title = purchasable.productVariation ? `${purchasable.product.name} - ${purchasable.productVariation.name}` : purchasable.product.name;
                showMessage({ text: `${title} er lagt til i handlekurven`, type: 'info' });
            }
        },
        [showMessage]
    );

    const removeItem = useCallback((purchasable: Purchasable, options: CartItemOptions = { silent: false }) => {
        const key = purchasable.productVariation
            ? `${purchasable.product.id}-${purchasable.productVariation.id}`
            : `${purchasable.product.id}-simple`;
        setItems((prevItems) => prevItems.filter((item) => item.key !== key));
    }, []);

    const clearCart = useCallback(() => {
        Alert.alert(
            'Tøm handlekurv',
            'Er du sikker på at du vil tømme handlekurven?',
            [
                {
                    text: 'Avbryt',
                    style: 'cancel',
                },
                {
                    text: 'Tøm',
                    style: 'destructive',
                    onPress: () => {
                        setItems([]);
                        showMessage({ text: 'Handlekurven er tømt', type: 'info' });
                        routes.home();
                    },
                },
            ]
        );
    }, [showMessage]);

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

    return (
        <ShoppingCartContext.Provider
            value={{
                items,
                groupedItems,
                cartItemCount,
                cartTotal,
                getQuantity,
                increaseQuantity,
                decreaseQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
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
