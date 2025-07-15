import type { Product, ShoppingCartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useStatus } from './StatusProvider';



interface ShoppingCartContextType {
    items: ShoppingCartItem[];
    cartItemCount: number;
    cartTotal: number;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ShoppingCartItem[]>([]);
    const { showMessage } = useStatus();

    const addToCart = useCallback((product: Product) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);

            if (existingItem) {
                // If item already exists in cart, increment quantity
                return prevItems.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Otherwise, add new item to cart with quantity of 1
                return [...prevItems, { product, quantity: 1 }];
            }
        });
        showMessage({ text: `${product.name} er lagt til i handlekurven`, type: 'info' });
    }, [showMessage]);

    const removeFromCart = useCallback((productId: number) => {
        setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            ).filter(item => item.quantity > 0) // Also remove if quantity is 0
        );
    }, []);

    const cartItemCount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const cartTotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }, [items]);

    return (
        <ShoppingCartContext.Provider
            value={{
                items,
                cartItemCount,
                cartTotal,
                addToCart,
                removeFromCart,
                updateQuantity,
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => {
    const context = useContext(ShoppingCartContext);
    if (context === undefined) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};
