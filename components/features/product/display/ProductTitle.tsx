import { Product } from '@/models/Product';
import React from 'react';
import { H3 } from 'tamagui';

interface ProductTitleProps {
    product: Product;
    activeProduct?: Product;
}

export const ProductTitle = ({ product, activeProduct }: ProductTitleProps) => {

    if (!activeProduct) {
        if (product) {
            return <H3>{product.name}</H3>;
        }
    } else {
        const title = (activeProduct.id === product.id) ? product.name : product.name + ' ' + activeProduct.name;
        if (title) {
            return <H3>{title}</H3>;
        }
    }

    return null;
};
