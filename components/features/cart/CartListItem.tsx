import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';

import { ThemedSpinner, ThemedText, ThemedXStack, ThemedYStack } from '@/components/ui';

import { CartItemData } from '@/domain/Cart/Cart';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { H4, StackProps, XStack } from 'tamagui';

import { ThemedSurface } from '@/components/ui/themed-components/ThemedSurface';
import { THEME_CART_ITEM_1, THEME_CART_ITEM_2 } from '@/config/app';
import { formatItemLineTotal, formatItemUnitPrice } from '@/domain/Cart/pricing';
import { useCartStore } from '@/stores/cartStore';


interface CartListItemProps {
    item: CartItemData;
    index: number;
}


export const CartListItem = ({ item, index, ...props }: CartListItemProps & StackProps): JSX.Element => {

    const { updateItem, removeItem, isUpdating } = useCartStore();
    const { quantity, key } = item;

    return (
        <ThemedYStack boc="black" {...props} fs={1}>
            <ThemedSurface theme={THEME_CART_ITEM_1} >
                <ThemedXStack container split>
                    {/* Row 1: Product name + unit price */}
                    <ThemedText size="$5">
                        {item.name}
                    </ThemedText>
                    <ThemedText size="$5">
                        {formatItemUnitPrice(item.prices)}
                    </ThemedText>
                </ThemedXStack>
            </ThemedSurface>
            <ThemedSurface theme={THEME_CART_ITEM_2} boc="red" bw={1}>
                <ThemedXStack container gap="$2">
                    {/* Row 2: Quantity + Subtotal + Remove */}

                    <XStack ai="center" gap="$2">
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
                        <ThemedButton
                            onPress={() => updateItem(key, quantity - 1)}
                            circular
                            disabled={quantity <= 1}
                        >
                            <Minus />
                        </ThemedButton>
                    </XStack>
                    <XStack f={1} ai="center" jc="flex-end">
                        {isUpdating ? <ThemedSpinner /> : <ThemedText f={1} ta="right" size="$5">
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
                </ThemedXStack>
            </ThemedSurface>
        </ThemedYStack>
    );
};
