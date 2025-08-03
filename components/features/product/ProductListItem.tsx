import { ProductProvider, useProductContext } from '@/contexts';
import { Product } from '@/models/Product/Product';
import React from 'react';
import { StackProps } from 'tamagui';
import { ProductCard } from './card';

interface ProductListItemProps extends Omit<StackProps, 'onPress'> {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
}

const ProductListItemContent: React.FC<Omit<ProductListItemProps, 'product'>> = ({
    onPress,
    isExpanded,
    index,
}) => {
    const { product } = useProductContext();

    const handleExpand = () => {
        onPress(product.id);
    };

    return <ProductCard
        theme={index % 2 === 0 ? 'light' : 'light_soft'}
        bbc="$borderColor"
        bbw={1}
        isExpanded={isExpanded}
        handleExpand={handleExpand}
    />

};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) =>
    <ProductProvider product={product}>
        <ProductListItemContent {...props} />
    </ProductProvider>
