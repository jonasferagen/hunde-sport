import { ChipContainer } from '@/components/ui';
import { ProductAttributeOption } from '@/models/ProductAttributeOption';
import React from 'react';
import { VariationChip } from './VariationChip';

interface VariationChipsProps {
    options: ProductAttributeOption[];
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
                    key={option.name}
                    label={option.label}
                    onPress={() => onSelectOption(option.name)}
                    isSelected={selectedOption === option.name}
                    disabled={!option.isAvailable}
                />
            ))}
        </ChipContainer>
    );
};
