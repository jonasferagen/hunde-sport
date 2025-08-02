import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ProductProvider, useShoppingCartContext } from '@/contexts';
import { CartItem } from '@/models/Cart';
import { formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: CartItem;
}


export const ShoppingCartListItem = ({ item }: ShoppingCartListItemProps) => {
    return (
        <ProductProvider product={item.product}>
            <ShoppingCartListItemContent item={item} />
        </ProductProvider>
    );
}

const ShoppingCartListItemContent = ({ item }: ShoppingCartListItemProps) => {

    const { updateItem, removeItem, isUpdating } = useShoppingCartContext();

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
                    <H4 width={30} textAlign="center">
                        {quantity}
                    </H4>
                    <SizableText fontSize="$4" color="$gray10" >
                        {isUpdating ? <ThemedSpinner /> : formatPrice(item.prices.price)}
                    </SizableText>
                </XStack>

                {/* Subtotal */}
                <SizableText fontSize="$4" fontWeight="bold" flex={1} textAlign="right">
                    {isUpdating ? <ThemedSpinner /> : formatPrice(Number(item.totals.line_total) + Number(item.totals.line_total_tax) + '')}
                </SizableText>
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
