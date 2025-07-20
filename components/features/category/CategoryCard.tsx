import { CategoryTile } from '@/components/ui';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { CARD_DIMENSIONS } from '@/styles/Dimensions';
import { Category } from '@/models/Category';
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';

interface CategoryCardProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
    width?: DimensionValue;
    height?: DimensionValue;
    textSize?: string;
    textColor?: string;
}

export const CategoryCard = ({
    category,
    style,
    width = CARD_DIMENSIONS.category.width,
    height = CARD_DIMENSIONS.category.height,
    textSize = "md",
    textColor
}: CategoryCardProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('card');
    const finalTextColor = textColor || theme.text.primary;

    return (
        <Link href={routes.category(category)} asChild>
            <CategoryTile
                category={category}
                height={height}
                width={width}
                style={style}
                textSize={textSize}
                textColor={finalTextColor}
            />
        </Link>
    );
};
