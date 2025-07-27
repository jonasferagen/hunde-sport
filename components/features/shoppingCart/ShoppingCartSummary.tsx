import { ThemedButton } from '@/components/ui/ThemedButton';
import { routes } from '@/config/routes';
import { useRouter } from 'expo-router';
import React, { JSX, memo } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

export const ShoppingCartSummary = memo(
    ({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps): JSX.Element => {
        const router = useRouter();

        const handleCheckout = () => {
            router.push(routes.shipping());
        };

        return (
            <>
                <XStack jc="space-between" ai="center">
                    <SizableText fontWeight="bold" size="$6" textAlign="right">
                        Antall: {cartItemCount}
                    </SizableText>
                    <SizableText fontWeight="bold" size="$6" textAlign="right">
                        Total: {cartTotal}
                    </SizableText>
                </XStack>
                <YStack gap="$3" mt="$3">
                    <ThemedButton onPress={onClearCart} theme="secondary">
                        Tøm handlekurv
                    </ThemedButton>
                    <ThemedButton onPress={handleCheckout} theme="primary" disabled={cartItemCount === 0}>
                        Gå til kassen
                    </ThemedButton>
                </YStack>
            </>
        );
    }
);
