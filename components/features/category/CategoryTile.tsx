import { BaseTile } from '@/components/ui/tile/BaseTile';
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { CARD_DIMENSIONS } from '@/styles/Dimensions';
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';

interface CategoryTileProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
    width?: DimensionValue;
    height?: DimensionValue;
    aspectRatio?: number;
    textSize?: string;
}

export const CategoryTile = ({
    category,
    style,
    width = CARD_DIMENSIONS.category.width,
    height = CARD_DIMENSIONS.category.height,
    aspectRatio = 1.2,
    textSize = "sm",

}: CategoryTileProps) => {


    return (
        <Link href={routes.category(category)} asChild>
            <BaseTile
                name={category.name}
                height={height}
                width={width}
                aspectRatio={aspectRatio}
                style={style}
                textSize={textSize}
                themeVariant={'primary'}
                imageUrl={category.image?.src ?? ''}
            />
        </Link>
    );
};
