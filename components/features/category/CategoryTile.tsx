import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { getScaledImageUrl } from "@/utils/helpers";
import { Link } from 'expo-router';
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
    w = CATEGORY_TILE_WIDTH,
    h = CATEGORY_TILE_HEIGHT,
    aspectRatio = 1,
    ...stackProps
}) => {

    const imageUrl = getScaledImageUrl(category.image.src, CATEGORY_TILE_WIDTH, CATEGORY_TILE_HEIGHT);

    return (
        <Link href={routes.category.path(category)}>
            <Tile
                w={w}
                h={h}
                aspectRatio={aspectRatio}
                title={category.name}
                imageUrl={imageUrl}
                {...stackProps}
            />
        </Link>
    );
};
