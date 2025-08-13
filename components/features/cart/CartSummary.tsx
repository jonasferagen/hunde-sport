import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/helpers';
import React, { JSX, memo } from 'react';
import { XStack } from 'tamagui';

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

                    <ThemedText size="$4" o={isUpdating ? 0 : 1}>
                        {cart.items_count} var(er)
                    </ThemedText>
                    <ThemedText fos="$3" fow="bold" o={isUpdating ? 0 : 1}>
                        {formatPrice(cart.totals.total_price)}
                    </ThemedText>
                </XStack>
            </XStack >

        );
    }
);
