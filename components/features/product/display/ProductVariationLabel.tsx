import { ThemedText } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps { }

export const ProductVariationLabel = ({ children, ...props }: ProductTitleProps) => {

    const { purchasable } = usePurchasableContext();
    const { productVariation } = purchasable;
    return <ThemedText
        fow="bold"
        fos="$5"
        {...props}
    >
        {productVariation?.getLabel()}
        {children}
    </ThemedText>;
};


