import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import { formatPriceRange } from '@/utils/helpers';
import React, { JSX } from 'react';
import { FontSizeTokens, SizableText } from 'tamagui';
import { Price } from './Price';

interface PriceTagProps {
    fontSize?: FontSizeTokens;
}

export const PriceTag = ({ fontSize = "$3" }: PriceTagProps): JSX.Element => {
    const { priceRange, productVariation, isProductVariationsLoading } = useProductContext();

    if (isProductVariationsLoading) {
        return <ThemedSpinner alignSelf='flex-end' size="small" />;
    }

    if (productVariation) {
        return <Price fontSize={fontSize} />;
    }

    if (priceRange) {
        return (
            <SizableText fontWeight="bold" fontSize={fontSize}>
                {formatPriceRange(priceRange)}
            </SizableText>
        );
    }

    return <Price fontSize={fontSize} />;
};
