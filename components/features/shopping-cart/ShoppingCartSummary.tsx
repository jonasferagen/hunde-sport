import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { formatPrice } from '@/utils/helpers';
import { X } from '@tamagui/lucide-icons';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;

}

export const ShoppingCartSummary = memo(
    ({ cartItemCount, cartTotal }: ShoppingCartSummaryProps): JSX.Element => {

        const { clearCart } = useShoppingCartContext();

        return (
            <>
                <XStack jc="space-between" ai="center" gap="$3">
                    <XStack ai="center" gap="$3" jc="flex-end">
                        <ThemedButton size="$5" circular theme="secondary" onPress={clearCart} disabled={cartItemCount === 0}>
                            <X size="$3" />
                        </ThemedButton>
                        <SizableText size="$4" textAlign="right">
                            {cartItemCount} var(er)
                        </SizableText>
                    </XStack>
                    <XStack gap="$3" ai='center'>
                        <ThemedText fontSize="$3" fontWeight="bold" textAlign="right">
                            Totalt {formatPrice(cartTotal)}
                        </ThemedText>
                    </XStack>
                </XStack >

            </>
        );
    }
);
