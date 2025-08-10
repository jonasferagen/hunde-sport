import { THEME_TOAST } from '@/config/app';
import { useCartStore } from '@/stores/CartStore';
import { useToastController } from '@tamagui/toast';
import { useEffect, useRef } from 'react';

export const CartToastHandler = (): null => {
    const toastController = useToastController();
    const { cart } = useCartStore();
    const prevItemsRef = useRef(cart?.items || []);

    useEffect(() => {

        const currentItems = cart?.items || [];
        const prevItems = prevItemsRef.current;

        // Item added
        if (currentItems.length > prevItems.length) {
            const newItem = currentItems.find(item => !prevItems.some(prevItem => prevItem.key === item.key));
            if (newItem) {
                toastController.show('Lagt til i handlekurven', {
                    message: newItem.product.name,
                    theme: THEME_TOAST,
                });
            }
        }

        // Item removed
        if (currentItems.length < prevItems.length) {
            const removedItem = prevItems.find(prevItem => !currentItems.some(item => item.key === prevItem.key));
            if (removedItem) {
                toastController.show('Fjernet fra handlekurven', {
                    message: removedItem.product.name,
                    theme: THEME_TOAST,
                });
            }
        }

        prevItemsRef.current = currentItems;
    }, [cart?.items, toastController]);

    return null;
};
