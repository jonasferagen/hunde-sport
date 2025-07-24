import { useProductContext } from '@/contexts';
import React from 'react';
import { H3 } from 'tamagui';

export const ProductTitle = () => {
    const { product, productVariant } = useProductContext();

    if (!product) {
        return null;
    }

    const title = productVariant ? `${product.name} ${productVariant.name}` : product.name;

    return <H3>{title}</H3>;
};