import { ThemedSpinner, ThemedText, ThemedXStack } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { THEME_CTA_CHECKOUT } from '@/config/app';
import { formatCartGrandTotal } from '@/domain/Cart/pricing';
import { useCartStore } from '@/stores/cartStore';
import { ExternalLink } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { ButtonProps } from 'tamagui';

export const CheckoutButton = (props: ButtonProps) => {
    // 🔒 Narrow, primitive selectors = fewer re-renders
    const itemsCount = useCartStore(s => s.cart?.items_count ?? 0);
    const isUpdating = useCartStore(s => s.isUpdating);
    const formattedTotal = useCartStore(
        s => (s.cart?.totals ? formatCartGrandTotal(s.cart.totals) : ''),
    );

    // Actions are stable in Zustand; read via getState to avoid subscribing
    const checkout = useCartStore.getState().checkout;

    const [isRedirecting, setIsRedirecting] = React.useState(false);

    const onPress = useCallback(async () => {
        setIsRedirecting(true);
        try {
            const checkoutUrl = await checkout();
            await Linking.openURL(checkoutUrl.toString());
        } finally {
            setIsRedirecting(false);
        }
    }, [checkout]);

    const disabled = itemsCount === 0;
    const waiting = isUpdating || isRedirecting;
    const label = useMemo(
        () => `${itemsCount} ${itemsCount === 1 ? 'vare' : 'varer'}`,
        [itemsCount]
    );

    // Stable icon elements (avoid re-creating each render)
    const iconAfter = useMemo(() => <ExternalLink />, []);

    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled || waiting}
            f={0}
            icon={null}
            iconAfter={iconAfter}
            theme={THEME_CTA_CHECKOUT}
            {...props}
        >
            <ThemedXStack split p="none" w="100%" ai="center">
                {waiting ? (
                    <ThemedSpinner />
                ) : (
                    <>
                        <ThemedText size="$5">{label}</ThemedText>
                        <ThemedText size="$5" bold>
                            {formattedTotal}
                        </ThemedText>
                    </>
                )}
            </ThemedXStack>
        </CallToActionButton>
    );
};
