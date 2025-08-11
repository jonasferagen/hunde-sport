import { ThemedText } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps { }


export const ProductTitle = ({ children, ...props }: ProductTitleProps) => {

    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    return <ThemedText
        fow="bold"
        fos="$5"
        {...props}
    >
        {product.name}
        {children}
    </ThemedText>;
};