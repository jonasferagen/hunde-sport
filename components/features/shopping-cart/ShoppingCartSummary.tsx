import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { formatPrice } from '@/utils/helpers';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';



export const ShoppingCartSummary = memo(
    (): JSX.Element => {

        const { cart, isUpdating } = useShoppingCartContext();


        return (
            <>
                <XStack jc="space-between" ai="center" gap="$3">
                    <XStack ai="center" gap="$3" jc="flex-end">
                        <SizableText size="$4" textAlign="right">
                            {cart.items_count} var(er)
                        </SizableText>
                    </XStack>
                    <XStack gap="$3" ai='center'>
                        <ThemedText fontSize="$3" fontWeight="bold" textAlign="right">
                            {isUpdating ? <ThemedSpinner /> : formatPrice(cart.totals.total_price)}
                        </ThemedText>
                    </XStack>
                </XStack >

            </>
        );
    }
);
