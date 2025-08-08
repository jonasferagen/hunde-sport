import { useProductContext } from '@/contexts';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps {
    full?: boolean;
    product?: boolean;
    variation?: boolean;
}

export const ProductTitle = ({ full = true, product = false, variation = false, children, ...props }: ProductTitleProps) => {
    const { purchasable } = useProductContext();
    const { titles } = purchasable;

    return <SizableText
        fow="bold"
        f={1}
        fs={1}
        {...props}
    >
        {variation ? titles.variation : product ? titles.product : titles.full}
        {children}
    </SizableText>;
};