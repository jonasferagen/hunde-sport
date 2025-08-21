import { Product } from '@/types';
import React from 'react';
import { Heading, SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps { product: Product }

export const ProductTitle = ({ product, children, ...props }: ProductTitleProps) => {

    return <Heading
        fow="bold"
        {...props}
    >
        {product.name}
        {children}
    </Heading>;
};


