import { routes } from '@/config/routes';
import type { Product } from '@/models/Product';
import type { ProductVariation } from '@/models/ProductVariation';
import type { ShoppingCartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useStatusContext } from './StatusContext';

const getCartItemId = (product: Product, productVariation?: ProductVariation) => {
    return productVariation ? `${product.id}-${productVariation.id}` : `${product.id}`;
};

interface ShoppingCartContextType {
    items: ShoppingCartItem[];
    purchaseInfo: (displayProduct: Product | ProductVariation) => { status: string; msg: string; msgShort: string };
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

    const purchaseInfo = (displayProduct: Product | ProductVariation) => {
        if (displayProduct.stock_status === 'outofstock') {
            return {
                status: 'outofstock',
                msg: 'Produktet er ikke lenger på lager',
                msgShort: 'Utsolgt',
            };
        }

        if (!(displayProduct.type === 'simple' || displayProduct.type === 'variation')) {
            return {
                status: 'variantneeded',
                msg: 'Velg en variant',
                msgShort: 'Velg variant',
            };
        }

        return {
            status: 'ok',
            msg: 'Legg til i handlekurv',
            msgShort: 'Kjøp',
        };
    };

    const getQuantity = useCallback(
        (product: Product, productVariation?: ProductVariation) => {
            const cartItemId = getCartItemId(product, productVariation);
            const cartItem = items.find((item) => getCartItemId(item.product, item.productVariation) === cartItemId);
            return cartItem?.quantity ?? 0;
        },
        [items]
    );

    const decreaseQuantity = useCallback((product: Product, productVariation?: ProductVariation) => {
        const cartItemId = getCartItemId(product, productVariation);
        setItems((prevItems) =>
            prevItems
                .map((item) => {
                    const currentItemId = getCartItemId(item.product, item.productVariation);
                    return currentItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item;
                })
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const increaseQuantity = useCallback(
        (product: Product, productVariation?: ProductVariation) => {
            const cartItemId = getCartItemId(product, productVariation);
            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => getCartItemId(item.product, item.productVariation) === cartItemId);

                if (existingItem) {
                    return prevItems.map((item) =>
                        getCartItemId(item.product, item.productVariation) === cartItemId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, { product, productVariation, quantity: 1 }];
                }
            });

            const title = productVariation ? `${product.name} - ${productVariation.name}` : product.name;

            showMessage({ text: `${title} er lagt til i handlekurven`, type: 'info' });
        },
        [showMessage]
    );

    const removeFromCart = useCallback((product: Product, productVariation?: ProductVariation) => {
        const cartItemId = getCartItemId(product, productVariation);
        setItems((prevItems) =>
            prevItems.filter((item) => {
                const currentItemId = getCartItemId(item.product, item.productVariation);
                return currentItemId !== cartItemId;
            })
        );
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
                purchaseInfo,
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
