import { ThemedSpinner, ThemedText, ThemedXStack } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { THEME_CTA_CHECKOUT } from '@/config/app';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/helpers';
import { useCartStore } from '@/stores/cartStore';
import { ExternalLink } from '@tamagui/lucide-icons';
import React from 'react';
import { Linking } from 'react-native';
import { ButtonProps } from 'tamagui';



export const CheckoutButton = ({ disabled, ...props }: ButtonProps) => {
    const { cart, isUpdating } = useCartContext();
    const { checkout } = useCartStore();

    const icon = null;
    const iconAfter = <ExternalLink />
    const [isRedirecting, setIsRedirecting] = React.useState(false);
    const onPress = async () => {
        setIsRedirecting(true);
        const checkoutUrl = await checkout();
        await Linking.openURL(checkoutUrl.toString());
        setIsRedirecting(false);
    };

    const isWaiting = isUpdating || isRedirecting;

    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled || isWaiting}
            f={0}
            icon={icon}
            iconAfter={iconAfter}
            {...props}
            theme={THEME_CTA_CHECKOUT}
        >
            {
                <ThemedXStack split p="none" w="100%" ai="center">
                    {isWaiting ? <ThemedSpinner /> : (
                        <>
                            <ThemedText size="$5" >{cart.items_count} var(er)</ThemedText>
                            <ThemedText size="$5" bold>   {formatPrice(String(Number(cart.totals.total_price) + Number(cart.totals.total_tax)))}</ThemedText>
                        </>
                    )}
                </ThemedXStack>
            }
        </CallToActionButton>
    );
};