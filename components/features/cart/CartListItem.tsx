import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';

import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { BaseProductProvider, useCartContext } from '@/contexts';
import { formatPrice } from '@/lib/helpers';
import { CartItemData } from '@/models/Cart/Cart';
import { PurchasableProduct } from '@/types';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { H4, SizableText, XStack, YStack } from 'tamagui';


export const CartListItem = ({ item }: { item: CartItemData }): JSX.Element => {

    return (
        <BaseProductProvider product={item.product as PurchasableProduct}>
            <CartListItemContent item={item} />
        </BaseProductProvider>
    );
}

const CartListItemContent = ({ item }: { item: CartItemData }): JSX.Element => {

    const { updateItem, removeItem } = useCartContext();
    const { quantity, key } = item;

    return (

        <YStack gap="$3" p="$3" bbw={2} borderBottomColor="$gray5">
            {/* Row 1: Product name + unit price */}
            <ProductTitle size="$4" />

            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton theme="success_alt7"
                        onPress={() => updateItem(key, quantity - 1)}
                        circular
                        disabled={quantity <= 1}
                    >
                        <Minus />
                    </ThemedButton>

                    <ThemedButton theme="success_alt7"
                        onPress={() => updateItem(key, quantity + 1)}
                        circular
                        disabled={false}
                    >
                        <Plus />
                    </ThemedButton>
                    <H4 w={30} ta="center">
                        {quantity}
                    </H4>
                    <SizableText fos="$4" col="$gray10" >
                        {formatPrice(item.prices.price)}
                    </SizableText>
                </XStack>

                <XStack f={1} ai="center" jc="flex-end">
                    <SizableText fos="$4" fow="bold" flex={1} ta="right">
                        {formatPrice(item.prices.price)}
                    </SizableText>
                </XStack>

                {/* Remove Button */}
                <ThemedButton theme="danger"
                    onPress={() => removeItem(key)}
                    circular
                    disabled={false}
                >
                    <X />
                </ThemedButton>
            </XStack>
        </YStack>

    );
};
