// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ArrowBigRightDash, ShoppingCart } from '@tamagui/lucide-icons';
import React from 'react';

interface ContinueButtonProps {
    onPress: () => void;
    disabled: boolean;
}

export const ContinueButton = ({ onPress, disabled }: ContinueButtonProps) => {

    const icon = <ShoppingCart />
    const iconAfter = <ArrowBigRightDash />
    const theme = "primary";

    const handlePress = () => {
        onPress();
    };

    const label = "Legg til i handlekurv"

    return (
        <CallToActionButton
            onPress={handlePress}
            disabled={disabled}
            icon={icon}
            theme={theme}
            size="$4"
            f={0}
            label={label}
            after={iconAfter}
        />
    );
};