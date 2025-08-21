// components/product/ProductPrice.tsx
import { ThemedText } from '@/components/ui/themed-components'
import { ProductPrices, formatMinorWithHeader, formatRangeWithHeader } from '@/domain/pricing'
import { Product } from '@/types'
import { SizableTextProps, XStack } from 'tamagui'

export const ProductPriceRange = ({ product, ...props }: { product: Product } & SizableTextProps) => {
    const prices = product.prices as ProductPrices
    if (!prices.price_range) throw new Error("product missing price_range", { cause: product })
    return (
        <ThemedText variant="price" {...props} >
            {formatRangeWithHeader(prices.price_range, prices, { style: 'short' })}
        </ThemedText>
    )
}

export const ProductPrice = ({
    product,
    ...props
}: { product: Product } & SizableTextProps) => {
    const { isInStock, isPurchasable, isOnSale, isFree } = product.availability
    const prices = product.prices as ProductPrices

    if (isFree) {
        return (
            <XStack ai="center" gap="$2">
                <ThemedText bold {...props}>Gratis!</ThemedText>
            </XStack>
        )
    }

    // Variable products: show range
    if (prices.price_range) {
        return <ProductPriceRange product={product} {...props} />
    }

    // Decide which exact amount to display and format that single field:
    const unit = isOnSale ? prices.sale_price : prices.price
    const unitFormatted = formatMinorWithHeader(unit, prices, { style: 'short' })
    const regularFormatted = formatMinorWithHeader(prices.regular_price, prices, { style: 'short' })

    if (!isPurchasable) {
        return (
            <ThemedText disabled {...props}>
                {unitFormatted}
            </ThemedText>
        )
    }

    if (isOnSale) {
        return (
            <XStack ai="center" gap="$2">
                <ThemedText disabled {...props}>{regularFormatted}</ThemedText>
                <ThemedText bold {...props}>{unitFormatted}</ThemedText>
            </XStack>
        )
    }

    return <ThemedText {...props}>{unitFormatted}</ThemedText>
}
