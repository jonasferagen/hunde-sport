import { ProductCardImage } from '@/components/features/product/card';
import { PageContent } from '@/components/layout';
import { Product } from '@/types';
import React, { JSX } from 'react';
import { H5, XStack } from 'tamagui';

interface ShoppingCartGroupHeaderProps {
    product: Product;
}

export const ShoppingCartGroupHeader = ({ product }: ShoppingCartGroupHeaderProps): JSX.Element => {
    return (
        <PageContent>
            <XStack gap="$3" ai="center">
                <ProductCardImage product={product} imageSize={60} />
                <H5>{product.name}</H5>
            </XStack>
        </PageContent>
    );
};
