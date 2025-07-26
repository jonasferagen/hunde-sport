import { routes } from '@/config/routes';
import type { Product } from '@/models/Product';
import type { ProductVariation } from '@/models/ProductVariation';
import { ShoppingCartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useStatusContext } from './StatusContext';



interface ShoppingCartContextType {
    items: ShoppingCartItem[];
    cartItemCount: number;
    cartTotal: number;
    getQuantity: (product: Product, productVariation?: ProductVariation) => number;
    increaseQuantity: (product: Product, productVariation?: ProductVariation) => void;
    decreaseQuantity: (product: Product, productVariation?: ProductVariation) => void;
    removeFromCart: (product: Product, productVariation?: ProductVariation) => void;
    clearCart: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ShoppingCartItem[]>([]);
    const { showMessage } = useStatusContext();

    const getQuantity = useCallback(
        (product: Product, productVariation?: ProductVariation) => {
            const key = `${product.id}-${productVariation?.id ?? 'simple'}`;
            const cartItem = items.find((item) => item.key === key);
            return cartItem?.quantity ?? 0;
        },
        [items]
    );

    const decreaseQuantity = useCallback((product: Product, productVariation?: ProductVariation) => {
        const key = `${product.id}-${productVariation?.id ?? 'simple'}`;
        setItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.key === key) {
                        return new ShoppingCartItem(item.product, item.productVariation, item.quantity - 1);
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const increaseQuantity = useCallback(
        (product: Product, productVariation?: ProductVariation) => {
            const key = `${product.id}-${productVariation?.id ?? 'simple'}`;
            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.key === key);

                if (existingItem) {
                    return prevItems.map((item) =>
                        item.key === key
                            ? new ShoppingCartItem(item.product, item.productVariation, item.quantity + 1)
                            : item
                    );
                } else {
                    const newItem = new ShoppingCartItem(product, productVariation, 1);
                    return [...prevItems, newItem];
                }
            });

            const title = productVariation ? `${product.name} - ${productVariation.name}` : product.name;

            console.log(productVariation);

            showMessage({ text: `${title} er lagt til i handlekurven`, type: 'info' });
        },
        [showMessage]
    );

    const removeFromCart = useCallback((product: Product, productVariation?: ProductVariation) => {
        const key = `${product.id}-${productVariation?.id ?? 'simple'}`;
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
            const itemProduct = item.productVariation || item.product;
            const price = itemProduct.price ?? item.product.price ?? 0;
            return sum + price * item.quantity;
        }, 0);
    }, [items]);

    return (
        <ShoppingCartContext.Provider
            value={{
                items,
                cartItemCount,
                cartTotal,
                getQuantity,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
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
