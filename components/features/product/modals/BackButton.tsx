// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { ArrowBigLeftDash } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps, XStack } from 'tamagui';

interface BackButtonProps extends ButtonProps {
    onPress: () => void;
    disabled: boolean;
    label?: string;
}

export const BackButton = ({ onPress, disabled, label = 'Tilbake', ...props }: BackButtonProps) => {

    return (
        <CallToActionButton
            theme="strong"
            onPress={onPress}
            disabled={disabled}
            icon={<XStack><ArrowBigLeftDash size="$5" /></XStack>}
            f={0}
            size="$4"
            label={label}
            variant="outlined"
            {...props}
        />
    );
};