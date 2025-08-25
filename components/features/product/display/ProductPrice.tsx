// components/product/ProductPrice.tsx
import { ThemedText, ThemedTextProps, ThemedXStack } from '@/components/ui/themed-components';
import { formatPrice, useProductPricing } from '@/domain/pricing';
import { Product } from '@/types';
import type { PropsWithChildren } from "react";

import { Loader } from '@/components/ui/Loader';
import { StarFull } from '@tamagui/lucide-icons';




type ProductPriceProps = {
    product: Product;
    showIcon?: boolean;
    outOfStockLabel?: string;                      // default "Utsolgt"
} & ThemedTextProps;

export const ProductPrice = ({
    product,
    showIcon = false,
    outOfStockLabel = 'Utsolgt',
    ...props
}: ProductPriceProps) => {
    // use injected pricing if provided, else fetch
    const computed = useProductPricing(product);
    const { isLoading, isFree, priceRange } = computed;
    const { isInStock, isPurchasable, isOnSale } = product.availability;

    if (isLoading) return <PriceLine><Loader /></PriceLine>;



    const minPrices = priceRange.min;
    const maxPrices = priceRange.max;
    const subtle = (!isInStock || !isPurchasable) ? true : false;

    // Sale: crossed regular + sale
    if (isOnSale) {
        return (
            <PriceLine star={showIcon}>
                <ThemedText disabled>
                    {formatPrice(minPrices, { field: 'regular_price' })}
                </ThemedText>
                <ThemedText>
                    {formatPrice(minPrices, { field: 'sale_price' })}
                </ThemedText>
            </PriceLine>
        );
    }
    const prefix = Number(minPrices.price) < Number(maxPrices.price) ? 'Fra ' : '';
    const label = isFree ? 'Gratis!' : formatPrice(minPrices, { field: 'price' });
    return (
        <PriceLine star={showIcon && isFree}>
            <ThemedText subtle={subtle}>{prefix}{label}</ThemedText>
        </PriceLine>
    );
};

const PriceLine = ({ star, children }: React.PropsWithChildren<{ star?: boolean }>) => (

    <ThemedXStack ai="center" gap="$2">
        {star && <StarFull scale={0.5} color="gold" />}
        {children}
    </ThemedXStack>
);