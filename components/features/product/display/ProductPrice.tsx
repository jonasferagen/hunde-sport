// components/product/ProductPrice.tsx
import { ThemedText } from '@/components/ui/themed-components'
import { usePurchasableContext } from '@/contexts'
import { ProductPrices, formatMinorWithHeader, formatRangeWithHeader } from '@/domain/pricing'
import { PurchasableProduct } from '@/types'
import { SizableTextProps, XStack } from 'tamagui'

export const ProductPriceRange = (props: SizableTextProps) => {
    const { purchasable } = usePurchasableContext()
    const prices = purchasable.activeProduct.prices as ProductPrices
    if (!prices.price_range) return null
    return (
        <ThemedText variant="price" {...props} >
            {formatRangeWithHeader(prices.price_range, prices, { style: 'short' })}
        </ThemedText>
    )
}

export const ProductPrice = (props: SizableTextProps) => {
    const { purchasable } = usePurchasableContext()
    return <ProductPriceImpl product={purchasable.activeProduct as PurchasableProduct} {...props} />
}

export const BaseProductPrice = (props: SizableTextProps) => {
    const { purchasable } = usePurchasableContext()
    return <ProductPriceImpl product={purchasable.product} {...props} />
}

const ProductPriceImpl = ({
    product,
    ...props
}: { product: PurchasableProduct } & SizableTextProps) => {
    const { isInStock, isPurchasable, isOnSale } = product.availability
    const prices = product.prices as ProductPrices

    // Variable products: show range
    if (prices.price_range) {
        return <ProductPriceRange {...props} />
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
