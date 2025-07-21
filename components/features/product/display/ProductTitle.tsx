import { Heading } from '@/components/ui';
import { Product } from '@/models/Product';
import React from 'react';

interface ProductTitleProps {
    product: Product;
    displayProduct: Product;
}

export const ProductTitle = ({ product, displayProduct }: ProductTitleProps) => {
    const title = (displayProduct.id === product.id) ? product.name : product.name + ' ' + displayProduct.name;

    return <Heading title={title} size="lg" />;
};
