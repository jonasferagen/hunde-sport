import { ListItem } from '@/components/ui/list/ListItem';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { Product } from '@/models/Product';
import React from 'react';
import { StackProps } from 'tamagui';
import { ProductItemHeader } from './list/ProductItemHeader';


interface ProductListItemProps extends Omit<StackProps, 'onPress'> {
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
    ...props
}) => {
    const { product } = useProductContext();

    const handleExpand = () => {
        onPress(product.id);
    };

    return (
        <ListItem
            header={<ProductItemHeader categoryId={categoryId} isExpanded={isExpanded} handleExpand={handleExpand} />}
            actions={<></>}
            {...props}
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
