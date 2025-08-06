import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/helpers';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';



export const CartSummary = memo(
    (): JSX.Element => {

        const { cart, isUpdating } = useCartContext();

        if (!cart) {
            return <ThemedSpinner />
        }

        return <>
            <XStack jc="space-between" ai="center" gap="$3">
                <XStack ai="center" gap="$3" jc="flex-end">
                    <SizableText size="$4" textAlign="right">
                        {cart.items_count} var(er)
                    </SizableText>
                </XStack>
                <XStack gap="$3" ai='center'>
                    <ThemedText theme='alt1' fontSize="$3" fow='bold'>
                        {formatPrice(cart.totals.total_price)}
                    </ThemedText>
                    {(isUpdating) && <ThemedSpinner />}
                </XStack>
            </XStack>
        </>
    }
);
