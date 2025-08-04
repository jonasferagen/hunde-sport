import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { ProductCategory } from '@/models/Category';
import { getScaledImageUrl } from "@/utils/helpers";
import { Link } from 'expo-router';
import React, { memo } from 'react';
import { DimensionValue } from 'react-native';
import { YStackProps } from "tamagui";

export const CATEGORY_TILE_WIDTH: DimensionValue = 200;
export const CATEGORY_TILE_HEIGHT: DimensionValue = 200;

interface CategoryTileProps extends Omit<YStackProps, 'children'> {
    productCategory: ProductCategory;
}

const CategoryTileBase: React.FC<CategoryTileProps> = ({
    productCategory: category,
    ...stackProps
}) => {

    const imageUrl = getScaledImageUrl(category.image.src, CATEGORY_TILE_WIDTH, CATEGORY_TILE_HEIGHT);

    return (
        <Link href={routes.category.path(category)} asChild>
            <Tile
                f={1}
                aspectRatio={1}
                title={category.name}
                imageUrl={imageUrl}
                {...stackProps}
            />
        </Link>
    );
};

export const ProductCategoryTile = memo(CategoryTileBase);
