import { routes } from '@/config/routes';
import type { Product } from '@/models/Product';
import { ProductVariation } from '@/models/ProductVariation';
import type { ShoppingCartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useStatusContext } from './StatusContext';

interface ShoppingCartContextType {
    items: ShoppingCartItem[];
    purchaseInfo: (displayProduct: Product | ProductVariation) => { status: string; msg: string; msgShort: string };
    cartItemCount: number;
    cartTotal: number;
    getQuantity: (product: Product | ProductVariation) => number;
    increaseQuantity: (product: Product | ProductVariation, parentProduct?: Product) => void;
    decreaseQuantity: (product: Product | ProductVariation) => void;
    removeFromCart: (productId: number) => void;
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
        (product: Product | ProductVariation) => {
            const cartItem = items.find((item) => (item.productVariation || item.product).id === product.id);
            return cartItem?.quantity ?? 0;
        },
        [items]
    );

    const decreaseQuantity = useCallback((product: Product | ProductVariation) => {
        setItems((prevItems) =>
            prevItems
                .map((item) => {
                    const itemProduct = item.productVariation || item.product;
                    return itemProduct.id === product.id ? { ...item, quantity: item.quantity - 1 } : item;
                })
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const increaseQuantity = useCallback(
        (productToAdd: Product | ProductVariation, parentProduct?: Product) => {
            setItems((prevItems) => {
                const existingItem = prevItems.find((item) => (item.productVariation || item.product).id === productToAdd.id);

                if (existingItem) {
                    return prevItems.map((item) =>
                        (item.productVariation || item.product).id === productToAdd.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    const newProduct = productToAdd.type === 'variation' ? parentProduct : productToAdd;
                    if (!newProduct) {
                        console.error('Cannot add variation to cart without a base product.');
                        return prevItems;
                    }
                    const newVariation = productToAdd.type === 'variation' ? (productToAdd as ProductVariation) : undefined;
                    return [...prevItems, { product: newProduct, productVariation: newVariation, quantity: 1 }];
                }
            });

            const title = productToAdd.type === 'variation' && parentProduct
                ? `${parentProduct.name} - ${productToAdd.name}`
                : productToAdd.name;

            showMessage({ text: `${title} er lagt til i handlekurven`, type: 'info' });
        },
        [showMessage]
    );

    const removeFromCart = useCallback((productId: number) => {
        setItems((prevItems) =>
            prevItems.filter((item) => {
                const itemProduct = item.productVariation || item.product;
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
            const itemProduct = item.productVariation || item.product;
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
