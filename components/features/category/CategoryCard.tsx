import { CategoryTile } from '@/components/ui';
import { routes } from '@/config/routing';
import { Category } from '@/types';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface CategoryCardProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
}

export const CategoryCard = ({ category, style }: CategoryCardProps) => {
    const handlePress = () => {
        routes.category(category);
    };

    return (
        <CategoryTile
            category={category}
            height={200}
            width={'100%'}
            style={style}
            onPress={handlePress}
        />
    );
};
