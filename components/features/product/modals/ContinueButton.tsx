// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ArrowBigRightDash, ShoppingCart } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps, ThemeName } from 'tamagui';

interface ContinueButtonProps extends ButtonProps {
    onPress: () => void;
    disabled: boolean;

}

export const ContinueButton = ({ onPress, disabled, ...props }: ContinueButtonProps) => {

    const icon = <ShoppingCart />
    const iconAfter = <ArrowBigRightDash />
    const theme: ThemeName = "primary";

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
            {...props}
        />
    );
};