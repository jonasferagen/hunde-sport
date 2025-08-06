import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { ChevronsDown, ChevronsUp } from '@tamagui/lucide-icons';
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
        <ThemedButton
            f={1}
            theme="secondary_alt2"
            fontSize="$4"
            m="none"
            gap={0}
            ai="center"
            jc="space-between"
            icon={isExpanded ? <ChevronsUp /> : <ChevronsDown />}
            scaleIcon={1.5}
            onPress={handleExpand}
        >
            <ThemedLinearGradient theme="secondary_alt1" br="$3" zIndex={-1} />
            Produktet finnes i flere varianter
        </ThemedButton>

    );
};