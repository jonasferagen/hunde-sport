import { formatPriceRange } from '@/utils/helpers';
import { FontSizeTokens, SizableText } from 'tamagui';

import { ProductPriceRange } from '@/types';

interface PriceRangeProps {
    productPriceRange: ProductPriceRange;
    fontSize?: FontSizeTokens;
}

export const PriceRange = ({ productPriceRange, fontSize = "$3" }: PriceRangeProps) => {

    return (
        <SizableText fontWeight="bold" fontSize={fontSize}>
            {formatPriceRange(productPriceRange!)}
        </SizableText>
    );
};