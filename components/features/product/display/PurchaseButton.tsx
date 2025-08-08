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
        icon: <ShoppingCart m={0} p={0} />,
        theme: 'dark_green_mod',
    },
    'ACTION_NEEDED': {
        icon: <TriangleAlert />,
        theme: 'light_yellow',
    },
    'INVALID': {
        icon: <CircleX />,
        theme: 'dark_red_mod',
    },
};

export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { isValid, title, prices, message, status } = purchasable;

    const { addItem } = useCartContext();
    const buttonRef = useRef<React.ComponentRef<typeof Button>>(null);

    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };
    // Get the configuration for the current status
    const { icon, theme } = buttonConfig[status as ValidationStatus];

    const leftContent = isValid ? title : null;
    const rightContent = isValid ? formatPrice(prices.price) : message;


    return (
        <CallToActionButton
            ref={buttonRef}
            theme={theme}
            onPress={handleAddToCart}
            disabled={!isValid}
            icon={icon}
            {...props}
        >
            {leftContent}
            {rightContent}
        </CallToActionButton>
    );
};
/*
const PurchaseButtonContent = () => {

    const { purchasable } = useProductContext();
    const { title, prices, isValid, message } = purchasable;

    if (!isValid) {
        return <SizableText fow="bold" fos="$4">{message}</SizableText>;
    }

    return (
        <XStack f={1} jc="space-between">
            <SizableText fow="bold" fos="$4">{title}</SizableText>
            <SizableText fow="bold" fos="$4">{formatPrice(prices.price)}</SizableText>
        </XStack>
    );
}; */