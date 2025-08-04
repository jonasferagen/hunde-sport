import { useCartStore } from '@/stores/CartStore';
import { createContext, FC, JSX, ReactNode, useContext } from 'react';

/**
 * Defines the shape of the data provided by the CartContext.
 */
interface CartContextType {
    itemsCount: number;
}

/**
 * Creates the React Context for the cart.
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * The provider component that wraps parts of the app that need access to the cart's item count.
 * It subscribes to the `items_count` from the Zustand store and provides it down the component tree.
 */
export const CartProvider: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
    const itemsCount = useCartStore((state) => state.cart?.items_count ?? 0);

    const value = {
        itemsCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to easily consume the cart's item count from the context.
 * Throws an error if used outside of a CartProvider.
 */
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
