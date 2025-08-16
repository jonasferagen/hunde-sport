import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';

import { ThemedSpinner, ThemedText, ThemedXStack, ThemedYStack } from '@/components/ui';

import { CartItemData } from '@/domain/Cart/Cart';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { H4, StackProps, XStack } from 'tamagui';

import { THEME_CART_ITEM_1, THEME_CART_ITEM_2 } from '@/config/app';
import { formatItemLineTotal, formatItemUnitPrice } from '@/domain/Cart/pricing';
import { useCartStore } from '@/stores/cartStore';

export const CartListItem = ({ item, index }: { item: CartItemData, index: number }): JSX.Element => {

    return (
        <CartListItemContent item={item} />
    );
}

interface CartListItemProps {
    item: CartItemData;
}

const CartListItemContent = ({ item, theme, ...props }: CartListItemProps & StackProps): JSX.Element => {

    const { updateItem, removeItem, isUpdating } = useCartStore();
    const { quantity, key } = item;

    return (<>
        <ThemedXStack theme={THEME_CART_ITEM_1} box container split bw={0} bbw={1} {...props}>
            {/* Row 1: Product name + unit price */}
            <ThemedText size="$5">
                {item.name}
            </ThemedText>
            <ThemedText>
                {formatItemUnitPrice(item.prices)}
            </ThemedText>
        </ThemedXStack>
        <ThemedYStack theme={THEME_CART_ITEM_2} box container bw={0} bbw={1} {...props}>
            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton
                        onPress={() => updateItem(key, quantity - 1)}
                        circular
                        disabled={quantity <= 1}
                    >
                        <Minus />
                    </ThemedButton>

                    <ThemedButton
                        onPress={() => updateItem(key, quantity + 1)}
                        circular
                        disabled={false}
                    >
                        <Plus />
                    </ThemedButton>
                    <H4 w={30} ta="center">
                        {quantity}
                    </H4>

                </XStack>

                <XStack f={1} ai="center" jc="flex-end">
                    {isUpdating ? <ThemedSpinner /> : <ThemedText f={1} ta="right">
                        {formatItemLineTotal(item.totals)}
                    </ThemedText>}
                </XStack>

                {/* Remove Button */}
                <ThemedButton
                    onPress={() => removeItem(key)}
                    circular
                    disabled={false}
                >
                    <X />
                </ThemedButton>
            </XStack>
        </ThemedYStack>
    </>);
};
