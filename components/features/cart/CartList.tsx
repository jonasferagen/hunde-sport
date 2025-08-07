import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { useCartContext } from '@/contexts/CartContext';
import { FlashList } from '@shopify/flash-list';
import React, { JSX, memo } from 'react';
import { CartListItem } from './CartListItem';

export const CartList = memo(
    (): JSX.Element => {

        const { cart } = useCartContext();

        if (cart.items.length === 0) {
            return <DefaultTextContent>Handlekurven er tom</DefaultTextContent>
        }

        return <FlashList
            data={cart.items}
            renderItem={({ item }) => <CartListItem item={item} />}
            estimatedItemSize={100}
        />
    }
);
