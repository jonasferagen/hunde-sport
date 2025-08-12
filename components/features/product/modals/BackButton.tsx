// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ArrowBigLeftDash } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps } from 'tamagui';

interface BackButtonProps extends ButtonProps {
    onPress: () => void;
    disabled: boolean;
    label?: string;
}

export const BackButton = ({ onPress, disabled, label = 'Tilbake', ...props }: BackButtonProps) => {

    const icon = <ArrowBigLeftDash size="$6" />
    const iconAfter = <ArrowBigLeftDash />


    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            icon={icon}
            f={0}
            label={label}

            {...props}
        >

        </CallToActionButton>
    );
};