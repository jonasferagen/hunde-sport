// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { ArrowBigRightDash } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps } from 'tamagui';


interface NextButtonProps extends ButtonProps {
    onPress: () => void;
    disabled: boolean;
    label?: string;
}

export const NextButton = ({ onPress, disabled, label = 'Neste', ...props }: NextButtonProps) => {
    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            label={label}
            iconAfter={<ArrowBigRightDash />}
            {...props}
            theme="primary"
        />
    )
}