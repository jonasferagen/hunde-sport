import { ThemedText } from '@/components/ui/ThemedText';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;

}

export const ShoppingCartSummary = memo(
    ({ cartItemCount }: ShoppingCartSummaryProps): JSX.Element => {


        return (
            <>
                <XStack jc="space-between" ai="center" gap="$3">
                    <XStack ai="center" gap="$3" jc="flex-end">
                        <SizableText size="$4" textAlign="right">
                            {cartItemCount} var(er)
                        </SizableText>
                    </XStack>
                    <XStack gap="$3" ai='center'>
                        <ThemedText fontSize="$3" fontWeight="bold" textAlign="right">
                            Totalt something
                        </ThemedText>
                    </XStack>
                </XStack >

            </>
        );
    }
);
