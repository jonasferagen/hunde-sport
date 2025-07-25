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
    const { priceRange, product, productVariation, isProductVariationsLoading } = useProductContext();


    if (isProductVariationsLoading) {
        return <ThemedSpinner alignSelf='flex-end' size="small" />;
    }

    if (productVariation) {
        if (priceRange) {
            return (
                <PriceRange productPriceRange={priceRange} fontSize={fontSize} />
            );
        }

        return <Price activeProduct={productVariation} fontSize={fontSize} />;
    }

    return <Price activeProduct={product} fontSize={fontSize} />;
};
