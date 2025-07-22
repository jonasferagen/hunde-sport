import { ListItem } from '@/components/ui/list/ListItem';
import { ShoppingCartItem } from '@/types';
import React from 'react';
import { SimpleItemHeader } from '../product/list/SimpleItemHeader';
import { ShoppingCartItemActions } from './ShoppingCartItemActions';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

export const ShoppingCartListItem: React.FC<ShoppingCartListItemProps> = ({ item }) => {
    const product = item.selectedVariant || item.baseProduct;

    return (
        <ListItem
            header={<SimpleItemHeader product={product} />}
            actions={<ShoppingCartItemActions item={item} />}
        />
    );
};
