import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { ProductProvider, useProductContext } from '@/contexts';
import { Product } from '@/models/Product/Product';
import React from 'react';
import { StackProps, YStack } from 'tamagui';
import { ProductCard, ProductCardContent, ProductCardFooter, ProductCardImage } from './card';
import { ProductVariations } from './variation/ProductVariations';

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
    const { product, productVariation } = useProductContext();

    const handleExpand = () => {
        onPress(product.id);
    };

    return (
        <YStack theme={index % 2 === 0 ? 'light' : 'light_soft'} p="$3" bbc="$borderColor" bbw={1} >
            <ThemedLinearGradient />
            <ProductCard>
                <ProductCardImage categoryId={categoryId} />
                <ProductCardContent categoryId={categoryId} />
            </ProductCard>
            <ProductCardFooter onExpand={handleExpand} />
            {

                product.hasVariations() && isExpanded && (
                    <YStack mt="$1">
                        <ProductVariations />
                    </YStack>
                )
            }
        </YStack >
    );
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    );
};
