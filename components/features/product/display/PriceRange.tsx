import { useProductContext } from '@/contexts';
import { ProductPriceRange } from '@/types';
import { formatPriceRange } from '@/utils/helpers';
import { FontSizeTokens, SizableText } from 'tamagui';

interface PriceRangeProps {
    productPriceRangeOverride?: ProductPriceRange;
    fontSize?: FontSizeTokens;
}

export const PriceRange = ({ productPriceRangeOverride, fontSize = "$3" }: PriceRangeProps) => {

    const { priceRange } = useProductContext();

    const productPriceRange = productPriceRangeOverride || priceRange;

    if (!productPriceRange) {
        return null;
    }

    return (
        <SizableText fontWeight="bold" fontSize={fontSize}>
            {formatPriceRange(productPriceRange!)}
        </SizableText>
    );
};