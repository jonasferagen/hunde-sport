import { ThemedButton } from '@/components/ui/ThemedButton';
import { useShoppingCartContext } from '@/contexts';
import { useProduct } from '@/hooks/data/Product';
import { CartItem } from '@/models/Cart';
import { formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: CartItem;
}

export const ShoppingCartListItem = ({ item }: ShoppingCartListItemProps) => {

    const { increaseQuantity, decreaseQuantity, removeItem } = useShoppingCartContext();
    const { quantity, prices } = item;

    const { data: product } = useProduct(item.id);

    if (!product) return null;
    const purchasable = { product, productVariation: undefined };


    console.log(item.totals);

    return (

        <YStack gap="$3" padding="$3" borderBottomWidth={2} borderColor="$gray5">
            {/* Row 1: Product name + unit price */}
            <XStack ai="center" gap="$2">
                <SizableText fontSize="$4" >{item.name}</SizableText>
            </XStack>

            {/* Row 2: Quantity + Subtotal + Remove */}
            <XStack jc="space-between" ai="center" gap="$4">
                {/* Quantity Controls */}
                <XStack ai="center" gap="$2">
                    <ThemedButton theme="primary"
                        icon={<Minus size="$3" />}
                        //   onPress={() => decreaseQuantity(purchasable, { silent: true })}
                        size="$5"
                        circular
                        disabled={quantity <= 1}
                    />

                    <ThemedButton theme="primary"
                        icon={<Plus size="$3" />}
                        //   onPress={() => increaseQuantity(purchasable, { silent: true })}
                        size="$5"
                        circular
                    />
                    <H4 width={30} textAlign="center">
                        {quantity}
                    </H4>
                    <SizableText fontSize="$4" color="$gray10">
                        á {formatPrice(item.prices.price)}
                    </SizableText>
                </XStack>

                {/* Subtotal */}
                <SizableText fontSize="$4" fontWeight="bold" flex={1} textAlign="right">
                    {formatPrice(Number(item.totals.line_total) + Number(item.totals.line_total_tax) + '')}
                </SizableText>
                {/* Remove Button */}
                <ThemedButton
                    theme="secondary"
                    icon={<X size="$3" />}
                    // onPress={() => removeItem(purchasable)}
                    size="$5"
                    circular
                />

            </XStack>
        </YStack>

    );
};

