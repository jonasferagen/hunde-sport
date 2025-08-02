import { ClearCartDialog } from '@/components/features/shopping-cart/ClearCartDialog';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { routes } from '@/config/routes';
import { useCart } from '@/hooks/data/Cart';
import { Cart } from '@/models/Cart';
import { Purchasable } from '@/types';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface CartItemOptions {
    silent?: boolean;
    triggerRef?: React.RefObject<any>;
}

interface ShoppingCartContextType {
    cart: Cart | undefined;
    isUpdating: boolean;
    addItem: (purchasable: Purchasable, options?: CartItemOptions) => void;
    updateItem: (key: string, quantity: number) => void;
    removeItem: (key: string, options?: CartItemOptions) => void;
    openClearCartDialog: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);
export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        cart,
        isLoading,
    } = useCart();

    if (isLoading || !cart) {
        return <ThemedSpinner />;
    }
    return <ShoppingCartInnerProvider cart={cart} >
        {children}
    </ShoppingCartInnerProvider>
};

const ShoppingCartInnerProvider: React.FC<{
    children: React.ReactNode;
    cart: Cart;

}> = ({ children, cart }) => {

    const {
        isUpdating,
        addItem: addItemMutation,
        updateItem: updateItemMutation,
        removeItem: removeItemMutation,
    } = useCart();


    const toastController = useToastController();
    const [isClearCartDialogOpen, setClearCartDialogOpen] = useState(false);

    const cartToken = cart.getToken();

    const addItem = (
        (purchasable: Purchasable, options: CartItemOptions = {}) => {

            const productVariation = purchasable.productVariation;
            const variation = !productVariation ? [] : productVariation.variation_attributes.map((attribute) => ({ attribute: attribute.name, value: attribute.value }));



            addItemMutation({ cartToken, id: purchasable.product.id, quantity: 1, variation });

            if (!options.silent) {
                toastController.show('Lagt til i handlekurven', {
                    message: purchasable.product.name,
                    theme: 'dark_yellow',
                    triggerRef: options.triggerRef,
                });
            }
        }
    );

    const updateItem = (
        (key: string, quantity: number) => {
            updateItemMutation({ cartToken, key, quantity });
        }
    );

    const removeItem = (
        (key: string, options: CartItemOptions = {}) => {
            removeItemMutation({ cartToken, key });

            if (!options.silent) {
                const item = cart.items.find(i => i.key === key);
                if (item) {
                    toastController.show('Fjernet fra handlekurven', {
                        message: item.product.name,
                        theme: 'dark_yellow',
                        triggerRef: options.triggerRef,
                    });
                }
            }
        }
    );
    const value = useMemo(() => ({
        cart,
        isUpdating,
        addItem,
        updateItem,
        removeItem,
        openClearCartDialog: () => setClearCartDialogOpen(true),
    }), [cart, isUpdating]);

    return (
        <ShoppingCartContext.Provider value={value}>
            {children}

            <ClearCartDialog
                isOpen={isClearCartDialogOpen}
                onConfirm={() => {
                    toastController.show('Handlekurven er tømt', {
                        message: 'Du har ingen produkter i handlekurven',
                        theme: 'dark_yellow',
                    });
                    router.push(routes.index.path());
                    setClearCartDialogOpen(false);
                }}
                onCancel={() => setClearCartDialogOpen(false)}
            />
        </ShoppingCartContext.Provider>
    );
};


export const useShoppingCartContext = () => {
    const context = useContext(ShoppingCartContext);
    if (!context) throw new Error('useShoppingCartContext must be used within a ShoppingCartProvider');
    return context;
};
