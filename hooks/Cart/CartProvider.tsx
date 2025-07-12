import type { Product } from '@/types';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useStatus } from '../Status/StatusProvider';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
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
        showMessage(`${product.name} er lagt til i handlekurven`, 2000);
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

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
