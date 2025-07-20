import { Chip } from '@/components/ui';
import React from 'react';

interface VariationChipProps {
    option: string;
    onPress?: () => void;
    isSelected?: boolean;
    disabled?: boolean;
}

export const VariationChip = ({ option, onPress, isSelected = false, disabled = false }: VariationChipProps) => {
    return (
        <Chip
            label={option}
            onPress={onPress}
            isSelected={isSelected}
            variant={isSelected ? 'primary' : 'default'}
            disabled={disabled}
        />
    );
};
