import { useProductContext } from '@/contexts';
import { formatPriceRange } from '@/utils/helpers';
import { FontSizeTokens, SizableText } from 'tamagui';

interface PriceRangeProps {
    productPriceRangeOverride?: any;
    fontSize?: FontSizeTokens;
}

export const PriceRange = ({ productPriceRangeOverride, fontSize = "$3" }: PriceRangeProps) => {

    const { product } = useProductContext();

    const productPriceRange = productPriceRangeOverride || product?.prices.price_range;

    if (!productPriceRange) {
        return null;
    }

    return (
        <SizableText fow="bold" fos={fontSize} borderWidth={2} borderColor="green">
            {formatPriceRange(productPriceRange)}
        </SizableText>
    );
};