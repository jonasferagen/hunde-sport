import { ThemedText } from '@/components/ui';
import { usePurchasable } from '@/hooks/usePurchasable';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductTitleProps extends SizableTextProps { }

export const ProductVariationTitle = ({ children, ...props }: ProductTitleProps) => {

    const { productVariation } = usePurchasable();
    return <ThemedText
        fow="bold"
        fos="$5"
        {...props}
    >
        {productVariation?.getLabel()}

    </ThemedText>;
};