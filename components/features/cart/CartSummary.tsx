import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/helpers';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';

export const CartSummary = memo(
    (): JSX.Element => {

        const { cart, isUpdating } = useCartContext();

        return (

            <XStack jc="space-between" ai="center" gap="$3">
                <XStack
                    jc="space-between"
                    ai="center"
                    gap="$3"
                    flex={1}
                >
                    {isUpdating && <ThemedSpinner pos="absolute" />}

                    <SizableText size="$4" opacity={isUpdating ? 0 : 1}>
                        {cart.items_count} var(er)
                    </SizableText>
                    <ThemedText fos="$3" fow="bold" opacity={isUpdating ? 0 : 1}>
                        {formatPrice(cart.totals.total_price)}
                    </ThemedText>
                </XStack>
            </XStack >

        );
    }
);
