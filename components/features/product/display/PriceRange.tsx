import { calculatePriceRange } from '@/contexts/ProductContext';
import { ProductVariation } from '@/types';
import { formatPriceRange } from '@/utils/helpers';
import { FontSizeTokens, SizableText } from 'tamagui';
export interface PriceProps {
    productVariationsOverride?: ProductVariation[];
    fontSize: FontSizeTokens;
}

export const PriceRange = ({ productVariationsOverride, fontSize }: PriceProps) => {

    const productVariations = productVariationsOverride || [];
    const priceRange = calculatePriceRange(productVariations);
    const formattedPriceRange = formatPriceRange(priceRange!);
    return (
        <SizableText fontWeight="bold" fontSize={fontSize}>
            {formattedPriceRange}
        </SizableText>
    );
};