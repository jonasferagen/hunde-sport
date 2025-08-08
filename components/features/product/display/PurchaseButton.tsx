import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useCartContext, useProductContext } from '@/contexts';
import { formatPrice } from '@/lib/helpers';
import { ValidationStatus } from '@/models/Product/Purchasable';
import { CircleX, ShoppingCart, TriangleAlert } from '@tamagui/lucide-icons';
import React, { JSX, useRef, } from 'react';
import { Button, ButtonProps, ThemeName } from 'tamagui';


interface ButtonStateConfig {
    icon: JSX.Element;
    theme: ThemeName;
}

// Map statuses to their corresponding configurations
const buttonConfig: Record<ValidationStatus, ButtonStateConfig> = {
    'OK': {
        icon: <ShoppingCart />,
        theme: 'dark_purple_alt2',
    },
    'ACTION_NEEDED': {
        icon: <TriangleAlert />,
        theme: 'secondary_soft',
    },
    'INVALID': {
        icon: <CircleX />,
        theme: 'danger',
    },
};

export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { isValid, prices, message, status } = purchasable;

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
            {isValid ? formatPrice(prices.price) : message}
        </CallToActionButton>
    );
};
