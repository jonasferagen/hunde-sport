import { useBreadcrumbs } from '@/hooks/Breadcrumbs/BreadcrumbContext';
import { routes } from '@/lib/routing';
import { Category } from '@/types';
import React from 'react';
import { Chip } from './Chip';

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
            variant="primary"
        />
    );
};
