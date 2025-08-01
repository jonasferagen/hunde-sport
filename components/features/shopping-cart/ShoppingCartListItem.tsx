import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';

import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { ProductProvider, useShoppingCartContext } from '@/contexts';
import { CartItemData } from '@/models/Cart';
import { formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { H4, SizableText, XStack, YStack } from 'tamagui';


export const ShoppingCartListItem = ({ item }: { item: CartItemData }): JSX.Element => {

    return (
        <ProductProvider product={item.product}>
            <ShoppingCartListItemContent item={item} />
        </ProductProvider>
    );
}

const ShoppingCartListItemContent = ({ item }: { item: CartItemData }): JSX.Element => {

    const { cart, updateCartItem, removeCartItem, isUpdating } = useShoppingCartContext();
    const { quantity, key } = item;

    return (

        <YStack gap="$3" padding="$3" borderBottomWidth={2} borderColor="$gray5">
            {/* Row 1: Product name + unit price */}
            <ProductTitle size="$4" />

            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton theme="primary"
                        icon={<Minus size="$3" />}
                        onPress={() => updateCartItem(key, quantity - 1)}
                        size="$5"
                        circular
                        disabled={quantity <= 1}
                    />

                    <ThemedButton theme="primary"
                        icon={<Plus size="$3" />}
                        onPress={() => updateCartItem(key, quantity + 1)}
                        size="$5"
                        circular
                        disabled={false}
                    />
                    <H4 width={30} textAlign="center">
                        {quantity}
                    </H4>
                    <SizableText fontSize="$4" color="$gray10" >
                        {formatPrice(item.prices.price)}
                    </SizableText>
                </XStack>

                <XStack f={1} ai="center" jc="flex-end">
                    <SizableText fontSize="$4" fontWeight="bold" flex={1} textAlign="right">
                        {isUpdating ? <ThemedSpinner /> : formatPrice(cart.getSubtotal(item))}
                    </SizableText>
                </XStack>

                {/* Remove Button */}
                <ThemedButton
                    theme="secondary"
                    icon={<X size="$3" />}
                    onPress={() => removeCartItem(key)}
                    size="$5"
                    circular
                    disabled={false}
                />

            </XStack>
        </YStack>

    );
};
