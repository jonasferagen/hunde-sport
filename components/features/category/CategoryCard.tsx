import { CategoryTile } from '@/components/ui';
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { CARD_DIMENSIONS } from '@/styles/Dimensions';
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';

interface CategoryCardProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
    width?: DimensionValue;
    height?: DimensionValue;
    textSize?: string;
}

export const CategoryCard = ({
    category,
    style,
    width = CARD_DIMENSIONS.category.width,
    height = CARD_DIMENSIONS.category.height,
    textSize = "sm",

}: CategoryCardProps) => {


    return (
        <Link href={routes.category(category)} asChild>
            <CategoryTile
                category={category}
                height={height}
                width={width}
                aspectRatio={1.2}
                style={style}
                textSize={textSize}
                themeVariant={'primary'}
            />
        </Link>
    );
};
