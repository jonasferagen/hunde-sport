import { ThemedText } from '@/components/ui';
import { PurchasableProduct } from '@/types';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductDescriptionProps extends SizableTextProps {
    long?: boolean;
    product: PurchasableProduct;
}

export const ProductDescription = ({ long = false, product, ...sizableTextProps }: ProductDescriptionProps) => {

    const description = long ? product.description || product.short_description : product.short_description

    return <ThemedText
        fos="$2"
        lh='$1'
        textDecorationLine="none"
        {...sizableTextProps}
    >
        {description || "Ingen beskrivelse tilgjengelig"}
    </ThemedText>;
};