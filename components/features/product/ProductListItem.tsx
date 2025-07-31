import { ProductProvider, useProductContext } from '@/contexts';
import { Product } from '@/models/Product';
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
}) => {
    const { product, productVariation } = useProductContext();

    const handleExpand = () => {
        onPress(product.id);
    };

    //  console.log('productVariation', productVariation);
    return (
        <YStack borderBottomWidth={1} paddingVertical="$3" borderBottomColor="$gray7">
            <ProductCard>
                <ProductCardImage product={product} categoryId={categoryId} />
                <ProductCardContent product={product} categoryId={categoryId} />
            </ProductCard>
            <ProductCardFooter onExpand={handleExpand} />
            {

                product.hasVariations() && isExpanded && (
                    <YStack marginHorizontal="$3" mt="$2">
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
