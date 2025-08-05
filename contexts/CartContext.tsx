import { CartData } from '@/models/Cart/Cart';
import { useCartStore } from '@/stores/CartStore';
import { createContext, FC, JSX, ReactNode, useContext } from 'react';

/**
 * Defines the shape of the data provided by the CartContext.
 */
interface CartContextType {
    cart: CartData;

    removeItem: (key: string) => void;
    updateItem: (key: string, quantity: number) => void;

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

    const cart = useCartStore((state) => state.cart);

    const updateItem = async (key: string, quantity: number) => {
        //await storeUpdateItem(key, quantity);
    };

    const removeItem = async (key: string) => {
        //await storeRemoveItem(key);
    };

    const value = {
        cart: cart!,
        removeItem,
        updateItem,
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
