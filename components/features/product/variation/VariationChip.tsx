import { Chip } from '@/components/ui';
import React from 'react';

interface VariationChipProps {
    label: string;
    onPress?: () => void;
    isSelected?: boolean;
    disabled?: boolean;
}

export const VariationChip = ({ label, onPress, isSelected = false, disabled = false }: VariationChipProps) => {
    return (
        <Chip
            label={label}
            onPress={onPress}
            isSelected={isSelected}
            variant={isSelected ? 'primary' : 'default'}
            disabled={disabled}
        />
    );
};
