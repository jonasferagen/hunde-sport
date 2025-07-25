import { ListItem } from '@/components/ui/list/ListItem';
import { ProductProvider } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import React from 'react';
import { SimpleProductItemHeader } from '../product/list/SimpleProductItemHeader';
import { ShoppingCartItemActions } from './ShoppingCartItemActions';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

export const ShoppingCartListItem: React.FC<ShoppingCartListItemProps> = ({ item }) => {

    return (

        <ProductProvider product={item.product} productVariation={item.productVariation}>
            <ListItem
                header={<SimpleProductItemHeader />}
                actions={<ShoppingCartItemActions item={item} />}
            />
        </ProductProvider>
    );
};
