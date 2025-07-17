import { ChipContainer } from '@/components/ui';
import React from 'react';
import { VariationChip } from './VariationChip';

interface VariationChipsProps {
    options: string[];
    onSelectOption: (option: string) => void;
    selectedOption: string | null;
};

export const VariationChips = ({ options, onSelectOption, selectedOption }: VariationChipsProps) => {

    if (!options.length) {
        return null;
    }

    return (
        <ChipContainer gap="md">
            {options.map(option => (
                <VariationChip
                    key={option}
                    option={option}
                    onPress={() => onSelectOption(option)}
                    isSelected={selectedOption === option}
                />
            ))}
        </ChipContainer>
    );
};
