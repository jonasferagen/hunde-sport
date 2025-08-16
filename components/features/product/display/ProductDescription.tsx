import { ThemedText } from '@/components/ui';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import React from 'react';
import { SizableTextProps } from 'tamagui';

interface ProductDescriptionProps extends SizableTextProps {
    long?: boolean;
}

export const ProductDescription = ({ long = false, ...sizableTextProps }: ProductDescriptionProps) => {

    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;

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