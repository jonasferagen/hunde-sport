// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ArrowBigRightDash, ShoppingCart } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps, SizableText } from 'tamagui';

interface NextButtonProps extends ButtonProps {
    onPress: () => void;
    disabled: boolean;
    label?: string;
}

export const NextButton = ({ onPress, disabled, label = 'Neste', ...props }: NextButtonProps) => {

    const icon = <ShoppingCart />
    const iconAfter = <ArrowBigRightDash />

    const handlePress = () => {
        onPress();
    };

    return (
        <CallToActionButton
            onPress={handlePress}
            disabled={disabled}
            icon={icon}
            f={0}
            label={label}
            after={iconAfter}
            {...props}
        >
            <SizableText>  aa </SizableText>
        </CallToActionButton>
    );
};