import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import React from 'react';
import { DimensionValue } from 'react-native';
import { YStackProps } from "tamagui";

export const CATEGORY_TILE_WIDTH: DimensionValue = 200;
export const CATEGORY_TILE_HEIGHT: DimensionValue = 200;

interface CategoryTileProps extends Omit<YStackProps, 'children'> {
    category: Category;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
    category,
    width = CATEGORY_TILE_WIDTH,
    height = CATEGORY_TILE_HEIGHT,
    ...stackProps
}) => {

    const finalHref = routes.category.path(category);

    return (
        <Tile
            w={width}
            h={height}
            aspectRatio={1}
            title={category.name}
            imageUrl={category.image?.src ?? ''}
            href={finalHref}
            {...stackProps}
        />
    );
};
