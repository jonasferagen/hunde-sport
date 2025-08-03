import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { ProductProvider, useProductContext } from '@/contexts';
import { Product } from '@/models/Product/Product';
import React from 'react';
import { StackProps, YStack } from 'tamagui';
import { ProductCard } from './card';

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
    index,
}) => {
    const { product } = useProductContext();

    const handleExpand = () => {
        onPress(product.id);
    };

    return <YStack theme={index % 2 === 0 ? 'light' : 'light_soft'} p="$3" bbc="$borderColor" bbw={1} >
        <ThemedLinearGradient />
        <ProductCard isExpanded={isExpanded} handleExpand={handleExpand} categoryId={categoryId} />
    </YStack >
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) =>
    <ProductProvider product={product}>
        <ProductListItemContent {...props} />
    </ProductProvider>
