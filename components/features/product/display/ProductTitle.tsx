import { Heading } from '@/components/ui';
import { Product } from '@/models/Product';
import React from 'react';

interface ProductTitleProps {
    product: Product;
    activeProduct: Product;
}

export const ProductTitle = ({ product, activeProduct }: ProductTitleProps) => {
    const title = (activeProduct.id === product.id) ? product.name : product.name + ' ' + activeProduct.name;
    return <Heading title={title} size="lg" />;
};
