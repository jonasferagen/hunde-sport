import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { ThemeVariant } from '@/types';
import React from 'react';
import { DimensionValue } from 'react-native';

export const CATEGORY_TILE_WIDTH: DimensionValue = 200;
export const CATEGORY_TILE_HEIGHT: DimensionValue = 200;

interface CategoryTileProps {
    category: Category;
    width?: DimensionValue;
    height?: DimensionValue;
    theme?: ThemeVariant;
}
export const CategoryTile = ({
    category,
    width = CATEGORY_TILE_WIDTH,
    height = CATEGORY_TILE_HEIGHT,
    theme,
    ...props
}: CategoryTileProps) => {

    const finalHref = routes.category(category);

    return (

        <Tile
            title={category.name}
            theme={theme}
            imageUrl={category.image?.src}
            href={finalHref}
            width={width}
            aspectRatio={1}
            height={height}
            {...props}

        >
            <></>
        </Tile>

    );
};
