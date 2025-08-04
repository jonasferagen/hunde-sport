import { CartItemData } from '@/models/Cart';
import { useCartStore } from '@/stores/CartStore';
import { Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import React, { createContext, useContext, useMemo } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

// Create a new type that omits the original store methods we want to override
type BaseCartStore = Omit<ReturnType<typeof useCartStore>, 'addItem' | 'updateItem' | 'removeItem'>;

// Define the context type with the full store state and our new, enhanced methods
interface ShoppingCartContextType extends BaseCartStore {
    isReady: boolean;
    items: CartItemData[];
    items_count: number;
    getSubtotal: (item: CartItemData) => string;
    addItem: (purchasable: Purchasable, options?: CartItemOptions) => void;
    updateItem: (key: string, quantity: number) => void;
    removeItem: (key: string, options?: CartItemOptions) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = useCartStore();
    const toastController = useToastController();

    const addItem = (purchasable: Purchasable, options: CartItemOptions = {}) => {

        const productVariation = purchasable.productVariation;
        const variation = !productVariation ? [] : productVariation.variation_attributes.map((attribute: any) => ({ attribute: attribute.name, value: attribute.value }));

        store.addItem({ id: purchasable.product.id, quantity: 1, variation });

        if (!options.silent) {
            toastController.show('Lagt til i handlekurven', {
                message: purchasable.product.name,
                theme: 'dark_yellow',
                triggerRef: options.triggerRef,
            });
        }
    };

    const updateItem = (key: string, quantity: number) => {
        store.updateItem(key, quantity);
    };

    const removeItem = (key: string, options: CartItemOptions = {}) => {
        const item = store.getItem(key);
        if (item) {
            const productName = item.product.name;
            store.removeItem(key);

            if (!options.silent) {
                toastController.show('Fjernet fra handlekurven', {
                    message: productName,
                    theme: 'dark_yellow',
                    triggerRef: options.triggerRef,
                });
            }
        }
    };

    const value = useMemo(() => ({
        ...store,
        addItem,
        updateItem,
        removeItem,
    }), [store, addItem, updateItem, removeItem]);

    return (
        <ShoppingCartContext.Provider value={value}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCartContext = () => {
    const context = useContext(ShoppingCartContext);
    if (!context) throw new Error('useShoppingCartContext must be used within a ShoppingCartProvider');
    return context;
};
