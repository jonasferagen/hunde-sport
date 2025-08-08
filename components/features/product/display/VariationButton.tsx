import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { Button, ButtonProps } from '@tamagui/button';
import { ChevronDown } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';

interface VariationButtonProps extends ButtonProps {
    onPress: () => void;
}

export const VariationButton = ({ onPress, ...props }: VariationButtonProps): JSX.Element | null => {
    const { product } = useProductContext();

    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    return (
        <Button
            {...props}
            onPress={onPress}
            iconAfter={ChevronDown}
            variant="outlined"
            theme="gray"
        >
            Velg variant
        </Button>
    );
};