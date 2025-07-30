import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import React, { JSX } from 'react';
import { FontSizeTokens } from 'tamagui';
import { Price } from './Price';
import { PriceRange } from './PriceRange';

interface PriceTagProps {
    fontSize?: FontSizeTokens;
}

export const PriceTag = ({ fontSize = "$3" }: PriceTagProps): JSX.Element => {
    const { product, productVariation, isProductVariationsLoading } = useProductContext();

    if (product.type === 'simple' || productVariation) {
        return <Price fontSize={fontSize} />;
    }

    if (isProductVariationsLoading) {
        return <ThemedSpinner alignSelf='flex-end' size="small" marginVertical="none" />;
    }

    return <PriceRange fontSize={fontSize} />;
};
