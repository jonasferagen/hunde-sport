import { CategoryTile } from '@/components/ui';
import { _routes } from '@/config/routes';
import { Category } from '@/types';
import { Link } from 'expo-router';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface CategoryCardProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
}

export const CategoryCard = ({ category, style }: CategoryCardProps) => {
    return (
        <Link href={_routes.category(category)} asChild>
            <CategoryTile
                category={category}
                height={200}
                width={'100%'}
                style={style}
            />
        </Link>
    );
};
