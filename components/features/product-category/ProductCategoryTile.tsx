import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { ProductCategory } from '@/models/ProductCategory';
import { getScaledImageUrl } from "@/utils/helpers";
import { Link } from 'expo-router';
import React, { memo } from 'react';
import { DimensionValue } from 'react-native';
import { YStackProps } from "tamagui";

export const PRODUCT_CATEGORY_TILE_WIDTH: DimensionValue = 200;
export const PRODUCT_CATEGORY_TILE_HEIGHT: DimensionValue = 200;

interface ProductCategoryTileProps extends Omit<YStackProps, 'children'> {
    productCategory: ProductCategory;
}

const ProductCategoryTileBase: React.FC<ProductCategoryTileProps> = ({
    productCategory,
    ...stackProps
}) => {

    const imageUrl = getScaledImageUrl(productCategory.image.src, PRODUCT_CATEGORY_TILE_WIDTH, PRODUCT_CATEGORY_TILE_HEIGHT);

    return (
        <Link href={routes['product-category'].path(productCategory)} asChild>
            <Tile
                f={1}
                aspectRatio={1}
                title={productCategory.name}
                imageUrl={imageUrl}
                {...stackProps}
            />
        </Link>
    );
};

export const ProductCategoryTile = memo(ProductCategoryTileBase);
