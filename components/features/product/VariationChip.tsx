import { Chip } from '@/components/ui';
import React from 'react';

interface VariationChipProps {
    option: string;
    onPress: () => void;
    isSelected: boolean;
}

export const VariationChip = ({ option, onPress, isSelected }: VariationChipProps) => {
    return (
        <Chip
            label={option}
            onPress={onPress}
            variant={isSelected ? 'primary' : 'default'}
        />
    );
};
