import { routes } from '@/config/routes';
import type { Product } from '@/models/Product';
import type { ShoppingCartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useStatusContext } from './StatusContext';

interface ShoppingCartContextType {
    items: ShoppingCartItem[];
    purchaseInfo: (displayProduct: Product) => { status: string; msg: string; msgShort: string };
    cartItemCount: number;
    cartTotal: number;
    getQuantity: (product: Product) => number;
    increaseQuantity: (product: Product, baseProduct?: Product) => void;
    decreaseQuantity: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ShoppingCartItem[]>([]);
    const { showMessage } = useStatusContext();

    const purchaseInfo = (displayProduct: Product) => {
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
        (product: Product) => {
            const cartItem = items.find((item) => (item.selectedVariant || item.baseProduct).id === product.id);
            return cartItem?.quantity ?? 0;
        },
        [items]
    );

    const decreaseQuantity = useCallback((product: Product) => {
        setItems((prevItems) =>
            prevItems
                .map((item) => {
                    const itemProduct = item.selectedVariant || item.baseProduct;
                    return itemProduct.id === product.id ? { ...item, quantity: item.quantity - 1 } : item;
                })
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const increaseQuantity = useCallback(
        (activeProduct: Product, baseProduct?: Product) => {
            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => (item.selectedVariant || item.baseProduct).id === activeProduct.id);

                if (existingItem) {
                    return prevItems.map((item) =>
                        (item.selectedVariant || item.baseProduct).id === activeProduct.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    const newBase = activeProduct.type === 'variation' ? baseProduct : activeProduct;
                    if (!newBase) {
                        console.error('Cannot add variation to cart without a base product.');
                        return prevItems;
                    }
                    const newVariant = activeProduct.type === 'variation' ? activeProduct : undefined;
                    return [...prevItems, { baseProduct: newBase, selectedVariant: newVariant, quantity: 1 }];
                }
            });

            const title = activeProduct.type === 'variation' && baseProduct
                ? `${baseProduct.name} - ${activeProduct.name}`
                : activeProduct.name;

            showMessage({ text: `${title} er lagt til i handlekurven`, type: 'info' });
        },
        [showMessage]
    );

    const removeFromCart = useCallback((productId: number) => {
        setItems((prevItems) =>
            prevItems.filter((item) => {
                const itemProduct = item.selectedVariant || item.baseProduct;
                return itemProduct.id !== productId;
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
            const itemProduct = item.selectedVariant || item.baseProduct;
            return sum + itemProduct.price * item.quantity;
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
