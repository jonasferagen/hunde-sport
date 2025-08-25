// components/product/ProductPrice.tsx
import { ThemedText, ThemedTextProps, ThemedXStack } from '@/components/ui/themed-components';
import { ProductPrices, formatMinorWithHeader, formatRangeWithHeader } from '@/domain/pricing';
import { Product } from '@/types';

type PriceStyleFlags = Pick<ThemedTextProps, 'bold' | 'disabled' | 'subtle'>;

/** Merge orthogonal style flags, keeping incoming props override-friendly */
const withFlags = <P extends object>(
    props: P,
    flags: PriceStyleFlags
): P & PriceStyleFlags => ({ ...flags, ...props });

export const ProductPriceRange = ({
    product,
    ...props
}: { product: Product } & ThemedTextProps) => {
    const prices = product.prices as ProductPrices;
    if (!prices.price_range) throw new Error('product missing price_range', { cause: product });

    const { availability } = product;
    const { isInStock, isPurchasable, isFree } = availability;

    const content = formatRangeWithHeader(prices.price_range, prices, { style: 'short' });

    // Orthogonal flags
    const flags: PriceStyleFlags = {
        bold: isFree || props.bold,
        subtle: !isInStock || props.subtle,
        disabled: (!isPurchasable && !isInStock) || props.disabled,
    };

    return (
        <ThemedText price {...withFlags(props, flags)}>
            {content}
        </ThemedText>
    );
};

export const ProductPrice = ({
    product,
    ...props
}: { product: Product } & ThemedTextProps) => {
    const { isInStock, isPurchasable, isOnSale, isFree } = product.availability;
    const prices = product.prices as ProductPrices;

    // Variable products → delegate to range (and still apply flags there)
    if (prices.price_range) {
        return <ProductPriceRange product={product} {...props} />;
    }


    // Figure out display amounts
    const unit = isOnSale ? prices.sale_price : prices.price;
    const unitFormatted = isFree ? 'Gratis!' : formatMinorWithHeader(unit, prices, { style: 'short' });
    const regularFormatted = formatMinorWithHeader(prices.regular_price, prices, { style: 'short' });

    // Orthogonal style flags applied to all outputs
    const flags: PriceStyleFlags = {
        bold: isFree || props.bold,                // free → bold
        subtle: !isInStock || props.subtle,        // OOS → subtle
        disabled: !isPurchasable || props.disabled // not purchasable → disabled
    };

    // Special case: sale adds the crossed-out regular price
    if (isOnSale) {
        return (
            <ThemedXStack ai="center" gap="$2">
                <ThemedText disabled>
                    {regularFormatted}
                </ThemedText>
                <ThemedText {...withFlags(props, flags)}>
                    {unitFormatted}
                </ThemedText>
            </ThemedXStack>
        );
    }

    // Regular single price
    return (
        <ThemedText {...withFlags(props, flags)}>
            {unitFormatted}
        </ThemedText>
    );
};
