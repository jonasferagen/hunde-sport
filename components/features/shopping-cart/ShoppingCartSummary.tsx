import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { formatPrice } from '@/utils/helpers';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';



export const ShoppingCartSummary = memo(
    (): JSX.Element => {

        const { items_count, totals, isLoading, isMutating } = useShoppingCartContext();

        return <>
            <XStack jc="space-between" ai="center" gap="$3">
                <XStack ai="center" gap="$3" jc="flex-end">
                    <SizableText size="$4" textAlign="right">
                        {items_count} var(er)
                    </SizableText>
                </XStack>
                <XStack gap="$3" ai='center'>
                    <ThemedText theme='alt1' size="$6" fow='bold'>
                        {formatPrice(totals.total_price)}
                    </ThemedText>
                    {(isLoading || isMutating) && <ThemedSpinner />}
                </XStack>
            </XStack>
        </>
    }
);
