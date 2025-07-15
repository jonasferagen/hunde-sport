import { routes } from '@/config/routing';
import { useBreadcrumbs } from '@/contexts';
import { Category } from '@/types';
import React from 'react';
import { Chip } from '../../ui/chips/Chip';

interface CategoryChipProps {
    category: Category;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {
    const { buildTrail } = useBreadcrumbs();

    const handlePress = () => {
        buildTrail(category.id);
        routes.category(category.id, category.name);
    };

    return (
        <Chip
            label={category.name}
            onPress={handlePress}
            variant="default"
        />
    );
};
