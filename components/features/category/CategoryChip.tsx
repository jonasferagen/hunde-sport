import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { Link } from 'expo-router';
import React from 'react';
import { Chip, ChipText } from '../../ui/chips/Chip';

interface CategoryChipProps {
    category: Category;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {
    return (
        <Link replace href={routes.category(category)} asChild>
            <Chip variant="primary">
                <ChipText variant="primary">{category.name}</ChipText>
            </Chip>
        </Link>
    );
};
