import { ThemedButton } from '@/components/ui/ThemedButton';
import { ProductProvider, useProductContext, useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { capitalize, formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

const ShoppingCartListItemContent = ({ item }: ShoppingCartListItemProps) => {
    const { increaseQuantity, decreaseQuantity, removeItem } = useShoppingCartContext();
    const { product } = useProductContext();
    const { purchasable, quantity, price } = item;
    const { productVariation } = purchasable;

    return (

        <YStack gap="$3" padding="$3" borderBottomWidth={1} borderColor="$gray5">
            {/* Row 1: Product name + unit price */}
            <XStack ai="center" gap="$2">
                <SizableText fontSize="$5" fontWeight="bold">
                    {product.name}
                    {productVariation && ` - ${capitalize(productVariation.name)}`}
                </SizableText>
            </XStack>

            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton theme="primary"
                        icon={<Minus size="$4" />}
                        onPress={() => decreaseQuantity(purchasable)}
                        size="$5"
                        circular
                        disabled={quantity <= 1}
                    />

                    <ThemedButton theme="primary"
                        icon={<Plus size="$4" />}
                        onPress={() => increaseQuantity(purchasable)}
                        size="$5"
                        circular
                    />
                    <H4 width={30} textAlign="center">
                        {quantity}
                    </H4>
                    <SizableText fontSize="$4" color="$gray10">
                        á {formatPrice(price)}
                    </SizableText>
                </XStack>

                {/* Subtotal */}
                <SizableText fontSize="$6" fontWeight="bold" flex={1} textAlign="right">
                    {formatPrice(quantity * price)}
                </SizableText>
                {/* Remove Button */}
                <ThemedButton
                    theme="secondary"
                    icon={<X size="$4" />}
                    onPress={() => removeItem(purchasable)}
                    size="$5"
                    circular
                />

            </XStack>
        </YStack>

    );
};

export const ShoppingCartListItem = ({ item }: ShoppingCartListItemProps) => {
    return (
        <ProductProvider product={item.purchasable.product} productVariation={item.purchasable.productVariation}>
            <ShoppingCartListItemContent item={item} />
        </ProductProvider>
    );
};
