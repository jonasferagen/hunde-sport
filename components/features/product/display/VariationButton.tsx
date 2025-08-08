import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';

interface VariationButtonProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

export const VariationButton = ({ isExpanded, handleExpand }: VariationButtonProps): JSX.Element | null => {
    const { product } = useProductContext();

    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    return (
        <CallToActionButton
            theme="success_alt5"
            icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
            onPress={handleExpand}
        >
            Produktet finnes i flere varianter
        </CallToActionButton>

    );
};