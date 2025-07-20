import { routes } from '@/config/routes';
import { Category } from '@/types';
import { Link } from 'expo-router';
import React from 'react';
import { Chip } from '../../ui/chips/Chip';

interface CategoryChipProps {
    category: Category;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {

    return (
        <Link replace href={routes.category(category)} asChild>
            <Chip
                label={category.name}
                variant="primary"
            />
        </Link>
    );
};
