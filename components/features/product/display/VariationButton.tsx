import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Theme } from 'tamagui';

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
        <Theme name="secondary_strong">
            <ThemedButton
                f={1}
                fontSize="$4"
                m="none"
                gap={0}
                ai="center"
                jc="space-between"
                icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
                scaleIcon={1.5}
                onPress={handleExpand}
            >
                <ThemedLinearGradient br="$3" zIndex={-1} />
                Produktet finnes i flere varianter
            </ThemedButton>
        </Theme>

    );
};