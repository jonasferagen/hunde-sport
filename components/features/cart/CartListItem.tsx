import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';

import { ThemedLinearGradient, ThemedText, ThemedYStack } from '@/components/ui';
import { THEME_CART_QUANTITY, THEME_CART_REMOVE } from '@/config/app';
import { useCartContext } from '@/contexts';
import { formatPrice } from '@/lib/helpers';
import { CartItemData } from '@/models/Cart/Cart';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { H4, StackProps, Theme, XStack } from 'tamagui';
import { PriceText } from '../product/display/PriceText';

export const CartListItem = ({ item, index }: { item: CartItemData, index: number }): JSX.Element => {
    const theme = index % 2 === 0 ? 'soft' : 'elevated';
    return (
        <Theme name={theme}>
            <ThemedLinearGradient />
            <CartListItemContent item={item} bbw={3} />
        </Theme>

    );
}

interface CartListItemProps {
    item: CartItemData;
}

const CartListItemContent = ({ item, ...props }: CartListItemProps & StackProps): JSX.Element => {

    const { updateItem, removeItem } = useCartContext();
    const { quantity, key } = item;

    console.log(item.totals);

    return (
        <ThemedYStack p="$3"  {...props}>
            {/* Row 1: Product name + unit price */}
            <ThemedText>
                {item.product.name}
            </ThemedText>

            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton theme={THEME_CART_QUANTITY}
                        onPress={() => updateItem(key, quantity - 1)}
                        circular
                        disabled={quantity <= 1}
                    >
                        <Minus />
                    </ThemedButton>

                    <ThemedButton theme={THEME_CART_QUANTITY}
                        onPress={() => updateItem(key, quantity + 1)}
                        circular
                        disabled={false}
                    >
                        <Plus />
                    </ThemedButton>
                    <H4 w={30} ta="center">
                        {quantity}
                    </H4>
                    <PriceText variant="disabled">
                        {formatPrice(item.prices.price)}
                    </PriceText>
                </XStack>

                <XStack f={1} ai="center" jc="flex-end">
                    <PriceText f={1} ta="right">
                        {formatPrice(String(Number(item.totals.line_subtotal) + Number(item.totals.line_subtotal_tax)))}
                    </PriceText>
                </XStack>

                {/* Remove Button */}
                <ThemedButton theme={THEME_CART_REMOVE}
                    onPress={() => removeItem(key)}
                    circular
                    disabled={false}
                >
                    <X />
                </ThemedButton>
            </XStack>
        </ThemedYStack>
    );
};
