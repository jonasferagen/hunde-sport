import { ListItem } from '@/components/ui/list/ListItem';
import { ProductProvider } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import React from 'react';
import { SimpleItemHeader } from '../product/list/SimpleItemHeader';
import { ShoppingCartItemActions } from './ShoppingCartItemActions';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

export const ShoppingCartListItem: React.FC<ShoppingCartListItemProps> = ({ item }) => {

    return (

        <ProductProvider product={item.baseProduct} productVariant={item.selectedVariant}>
            <ListItem
                header={<SimpleItemHeader />}
                actions={<ShoppingCartItemActions item={item} />}
            />
        </ProductProvider>
    );
};
