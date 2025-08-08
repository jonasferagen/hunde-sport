import { useProductContext } from '@/contexts';
import { formatPriceRange } from '@/lib/helpers';
import { SizableText, SizableTextProps } from 'tamagui';


export const PriceRange = ({ productPriceRangeOverride, fontSize = "$4" }: any & SizableTextProps) => {

    const { product } = useProductContext();

    const productPriceRange = productPriceRangeOverride || product?.prices.price_range;

    if (!productPriceRange) {
        return null;
    }

    return (
        <SizableText fow="bold" fos={fontSize} >
            {formatPriceRange(productPriceRange)}
        </SizableText>
    );
};