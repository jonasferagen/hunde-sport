import { usePurchasable } from '@/hooks/usePurchasable';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps { }


export const ProductTitle = ({ children, ...props }: ProductTitleProps) => {

    const { product } = usePurchasable();
    return <SizableText
        fow="bold"
        fos="$5"
        f={1}
        fs={1}
        {...props}
    >
        {product.name}
        {children}
    </SizableText>;
};