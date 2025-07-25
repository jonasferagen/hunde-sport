import { useProductContext } from '@/contexts';
import React from 'react';
import { H3 } from 'tamagui';

export const ProductTitle = () => {
    const { product, productVariation } = useProductContext();

    if (!product) {
        return null;
    }

    const title = productVariation ? `${product.name} ${productVariation.name}` : product.name;

    return <H3>{title}</H3>;
};