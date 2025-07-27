import { useProductContext } from '@/contexts';
import React from 'react';
import { FontSizeTokens, SizableText } from 'tamagui';

interface ProductTitleProps {
    size: FontSizeTokens;
}

export const ProductTitle = ({ size }: ProductTitleProps) => {
    const { product, productVariation } = useProductContext();

    if (!product) {
        return null;
    }

    const title = productVariation ? `${product.name} ${productVariation.name}` : product.name;
    return <SizableText fontSize={size} fontWeight="bold">{title}</SizableText>;
};