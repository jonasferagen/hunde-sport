import { ListItem } from '@/components/ui/list/ListItem';
import { useThemeContext } from '@/contexts';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { Product } from '@/models/Product';
import React from 'react';
import { ItemActions } from './list/ItemActions';
import { ItemHeader } from './list/ItemHeader';

interface ProductListItemProps {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
    categoryId?: number;
}

const ProductListItemContent: React.FC<Omit<ProductListItemProps, 'product'>> = ({
    onPress,
    isExpanded,
    categoryId,
}) => {
    const { product } = useProductContext();

    if (!product) {
        return null;
    }

    const handleExpand = () => {
        onPress(product.id);
    };

    return (
        <ListItem
            header={<ItemHeader categoryId={categoryId} />}
            actions={<ItemActions isExpanded={isExpanded} handleExpand={handleExpand} />}
        />
    );
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    );
};
