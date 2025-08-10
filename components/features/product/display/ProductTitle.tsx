import { Product } from '@/types';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps {
    product: Product;
}

export const ProductTitle = ({ product, children, ...props }: ProductTitleProps) => {


    return <SizableText
        fow="bold"
        f={1}
        fs={1}
        {...props}
    >
        {product.name}
        {children}
    </SizableText>;
};