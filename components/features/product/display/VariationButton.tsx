import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { ButtonProps } from '@tamagui/button';
import { PawPrint } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { ThemeName } from 'tamagui';

interface VariationButtonProps extends ButtonProps {
    onPress: () => void;
}

export const VariationButton = ({ onPress, ...props }: VariationButtonProps): JSX.Element | null => {
    const { product } = useProductContext();

    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    const themeName = "success_alt7" as ThemeName;

    return (
        <CallToActionButton
            theme={themeName}
            onPress={onPress}
            iconAfter={<PawPrint />}
            {...props}
        >
            Velg variant
        </CallToActionButton>
    );
};