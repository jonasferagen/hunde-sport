// components/product/ProductPrice.tsx
import { ThemedText, ThemedTextProps, ThemedXStack } from '@/components/ui/themed-components';
import { ProductPrices, formatPrice, formatPriceRange, getProductPriceRange } from '@/domain/pricing';
import { useProductVariations } from '@/hooks/data/Product';
import { Product, VariableProduct } from '@/types';
import { Loader } from '@/components/ui/Loader';

type PriceStyleFlags = Pick<ThemedTextProps, 'bold' | 'disabled' | 'subtle'>;

/** Merge orthogonal style flags, keeping incoming props override-friendly */
const withFlags = <P extends object>(
    props: P,
    flags: PriceStyleFlags
): P & PriceStyleFlags => ({ ...flags, ...props });

export const ProductPriceRange = ({
    variableProduct,
    ...props
}: { variableProduct: VariableProduct } & ThemedTextProps) => {
    const { isLoading, items: productVariations } = useProductVariations(variableProduct);

    if (isLoading) {
        return <Loader />
    }
    const prices = productVariations.map(v => v.prices);
    const productPriceRange = getProductPriceRange(prices);

    const { availability } = variableProduct;
    const { isInStock, isPurchasable, isFree } = availability;

    const content = formatPriceRange(productPriceRange!);

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

    if (product.type === 'variable') {
        return <ProductPriceRange variableProduct={product as VariableProduct} {...props} />;
    }
    const { isInStock, isPurchasable, isOnSale, isFree } = product.availability;
    const prices = product.prices as ProductPrices;
    const priceFormatted = isFree ? 'Gratis!' : formatPrice(prices);

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
                    {formatPrice(prices, { field: 'regular_price' })}
                </ThemedText>
                <ThemedText {...withFlags(props, flags)}>
                    {formatPrice(prices, { field: 'sale_price' })}
                </ThemedText>
            </ThemedXStack>
        );
    }

    // Regular single price
    return (
        <ThemedText {...withFlags(props, flags)}>
            {priceFormatted}
        </ThemedText>
    );
};

