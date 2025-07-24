import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { ThemeVariant } from '@/types';
import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';

const CATEGORY_TILE_WIDTH: DimensionValue = 'auto';
const CATEGORY_TILE_HEIGHT: DimensionValue = 200;

interface CategoryTileProps {
    category: Category;
    width?: DimensionValue;
    height?: DimensionValue;
    theme?: ThemeVariant;
    style?: StyleProp<ViewStyle>;
}
export const CategoryTile = ({
    category,
    width = CATEGORY_TILE_WIDTH,
    height = CATEGORY_TILE_HEIGHT,
    theme,
    style,
    ...props
}: CategoryTileProps) => {

    const finalHref = routes.category(category);

    return (

        <Tile
            title={category.name}
            theme={theme}
            imageUrl={category.image?.src}
            href={finalHref}
            style={style}
            {...props}

        >
            <></>
        </Tile>

    );
};
