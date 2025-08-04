import { ThemedButton } from '@/components/ui/ThemedButton';

import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { ProductProvider, useShoppingCartContext } from '@/contexts';
import { CartItemData } from '@/models/Cart/Cart';
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

    const { getSubtotal, updateItem, removeItem } = useShoppingCartContext();
    const { quantity, key } = item;

    return (

        <YStack gap="$3" p="$3" bbw={2} borderBottomColor="$gray5">
            {/* Row 1: Product name + unit price */}
            <ProductTitle size="$4" />

            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton theme="primary"
                        icon={<Minus size="$3" />}
                        onPress={() => updateItem(key, quantity - 1)}
                        size="$5"
                        circular
                        disabled={quantity <= 1}
                    />

                    <ThemedButton theme="primary"
                        icon={<Plus size="$3" />}
                        onPress={() => updateItem(key, quantity + 1)}
                        size="$5"
                        circular
                        disabled={false}
                    />
                    <H4 w={30} ta="center">
                        {quantity}
                    </H4>
                    <SizableText fos="$4" col="$gray10" >
                        {formatPrice(item.prices.price)}
                    </SizableText>
                </XStack>

                <XStack f={1} ai="center" jc="flex-end">
                    <SizableText fos="$4" fow="bold" flex={1} ta="right">
                        {formatPrice(getSubtotal(item))}
                    </SizableText>
                </XStack>

                {/* Remove Button */}
                <ThemedButton
                    theme="secondary"
                    icon={<X size="$3" />}
                    onPress={() => removeItem(key)}
                    size="$5"
                    circular
                    disabled={false}
                />
            </XStack>
        </YStack>

    );
};
