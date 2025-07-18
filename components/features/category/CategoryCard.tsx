import { CategoryTile } from '@/components/ui';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { Category } from '@/types';
import { Link } from 'expo-router';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface CategoryCardProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
}

export const CategoryCard = ({ category, style }: CategoryCardProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('card');

    return (
        <Link href={routes.category(category)} asChild>
            <CategoryTile
                category={category}
                height={200}
                width={'100%'}
                style={style}
                textSize="md"
                textColor={theme.text.primary}
            />
        </Link>
    );
};
