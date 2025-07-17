import { CategoryTile } from '@/components/ui';
import { routes } from '@/config/routes';
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
        <Link href={routes.category(category)} asChild>
            <CategoryTile
                category={category}
                height={200}
                width={'100%'}
                style={style}
                textSize="md"
                textColor="#fff"
            />
        </Link>
    );
};
