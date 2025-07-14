import { useBreadcrumbs } from '@/hooks/Breadcrumbs/BreadcrumbContext';
import { Category } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { Chip } from './Chip';

interface CategoryChipProps {
    category: Category;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {
    const { buildTrail } = useBreadcrumbs();

    const handlePress = () => {
        buildTrail(category.id);
        router.push(`/category?id=${category.id}&name=${category.name}`);
    };

    return (
        <Chip
            label={category.name}
            onPress={handlePress}
            variant="primary"
        />
    );
};
