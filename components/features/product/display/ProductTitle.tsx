import { useProductContext } from '@/contexts';
import React from 'react';
import { H6 } from 'tamagui';

export const ProductTitle = () => {
    const { product, productVariation } = useProductContext();

    if (!product) {
        return null;
    }

    const title = productVariation ? `${product.name} ${productVariation.name}` : product.name;

    return <H6>{title}</H6>;
};