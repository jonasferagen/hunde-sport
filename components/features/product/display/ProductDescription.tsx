import { ThemedText } from '@/components/ui';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductDescriptionProps extends SizableTextProps {
    short?: boolean;
}

export const ProductDescription = ({ short = true, ...sizableTextProps }: ProductDescriptionProps) => {

    const { product } = useBaseProductContext();

    return <ThemedText
        {...sizableTextProps}
    >
        {short ? product.short_description : product.description}
    </ThemedText>;
};