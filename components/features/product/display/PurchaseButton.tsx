import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useCartContext, useProductContext } from '@/contexts';
import { ValidationStatus } from '@/models/Product/Purchasable';
import { formatPrice } from '@/utils/helpers';
import { CircleX, ShoppingCart, TriangleAlert } from '@tamagui/lucide-icons';
import React, { JSX, useRef } from 'react';

import { Button, ButtonProps, SizableText, ThemeName, XStack } from 'tamagui';


interface ButtonStateConfig {
    icon: JSX.Element;
    theme: ThemeName;
}

// Map statuses to their corresponding configurations
const buttonConfig: Record<ValidationStatus, ButtonStateConfig> = {
    'OK': {
        icon: <ShoppingCart />,
        theme: 'dark_green_alt2',
    },
    'ACTION_NEEDED': {
        icon: <TriangleAlert />,
        theme: 'dark_yellow_alt2',
    },
    'INVALID': {
        icon: <CircleX />,
        theme: 'dark_red_alt2',
    },
};

export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { isValid, status } = purchasable;

    const { addItem } = useCartContext();
    const buttonRef = useRef<React.ComponentRef<typeof Button>>(null);

    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };

    // Get the configuration for the current status
    const { icon, theme } = buttonConfig[status as ValidationStatus];

    return (
        <CallToActionButton
            ref={buttonRef}
            theme={theme}
            onPress={handleAddToCart}
            disabled={!isValid}
            icon={icon}
            {...props}
        >
            <PurchaseButtonContent />
        </CallToActionButton>
    );
};

const PurchaseButtonContent = () => {

    const { purchasable } = useProductContext();
    const { title, prices, isValid, message } = purchasable;

    if (!isValid) {
        return <SizableText fos="$4">{message}</SizableText>;
    }

    return (
        <XStack f={1} jc="space-between">
            <SizableText fos="$4">{title}</SizableText>
            <SizableText fos="$4">{formatPrice(prices.price)}</SizableText>
        </XStack>
    );
};