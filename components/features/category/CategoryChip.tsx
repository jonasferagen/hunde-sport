import { routes } from '@/config/routes';
import { Category } from '@/types';
import React from 'react';
import { Chip } from '../../ui/chips/Chip';

interface CategoryChipProps {
    category: Category;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {

    const handlePress = () => {
        routes.category(category);
    };

    return (
        <Chip
            label={category.name}
            onPress={handlePress}
            variant="default"
        />
    );
};
