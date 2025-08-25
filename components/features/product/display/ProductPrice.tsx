// components/product/ProductPrice.tsx
import React from 'react';
import { ThemedSpinner, ThemedText, ThemedTextProps, ThemedXStack } from '@/components/ui/themed-components';
import { Loader } from '@/components/ui/Loader';
import { formatPrice, useProductPricing } from '@/domain/pricing';
import { Product, ProductPrices } from '@/types';
import { StarFull } from '@tamagui/lucide-icons';

type ProductPriceProps = {
    product: Product;
    showIcon?: boolean;
} & ThemedTextProps;

const PriceLine = ({ showIcon, children }: React.PropsWithChildren<{ showIcon?: boolean }>) => (
    <ThemedXStack ai="center" gap="$2" pos="relative">
        {showIcon ? <StarFull scale={0.5} color="gold" /> : null}
        <ThemedText>{children}</ThemedText>
    </ThemedXStack>
);

export const ProductPrice = React.memo(function ProductPrice({
    product,
    showIcon = false,
    ...textProps
}: ProductPriceProps) {
    const { isInStock, isPurchasable, isOnSale } = product.availability;
    const { isLoading, isFree, priceRange } = useProductPricing(product);

    // Safety guard (in case a future change makes range optional)
    const minPrices = priceRange?.min as ProductPrices;
    const maxPrices = priceRange?.max as ProductPrices;

    // Compute once
    const { saleValid } = React.useMemo(() => {
        const minVal = parseInt(minPrices?.price ?? '0', 10);
        const maxVal = parseInt(maxPrices?.price ?? '0', 10);
        const saleVal = parseInt(minPrices?.sale_price ?? '0', 10);
        const regVal = parseInt(minPrices?.regular_price ?? '0', 10);

        return {
            hasRange: minVal !== maxVal,
            prefix: minVal < maxVal ? 'Fra ' : '',
            saleValid: isOnSale && saleVal > 0 && regVal > 0 && saleVal < regVal,
        };
    }, [minPrices, maxPrices, isOnSale]);

    if (isLoading) return <PriceLine><ThemedSpinner size="small" /></PriceLine>;
    // Flags (forward caller overrides)
    const subtle = (!isInStock || !isPurchasable) || textProps.subtle;



    // Sale: crossed regular + sale (only if it actually makes sense)
    if (saleValid) {
        return (
            <PriceLine showIcon={showIcon}>
                <ThemedText disabled subtle {...textProps}>
                    {formatPrice(minPrices, { field: 'regular_price' })}
                </ThemedText>
                <ThemedText {...textProps} subtle={subtle}>
                    {formatPrice(minPrices, { field: 'sale_price' })}
                </ThemedText>
            </PriceLine>
        );
    }

    // Regular / Free
    const label = isFree ? 'Gratis!' : formatPrice(minPrices, { field: 'price' });
    return (
        <PriceLine showIcon={showIcon && (isFree || isOnSale)}>
            <ThemedText {...textProps} subtle={subtle}>
                {label}
            </ThemedText>
        </PriceLine >
    );
});
