import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { ProductCategory } from '@/models/ProductCategory';
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


    return (
        <Link href={routes['product-category'].path(productCategory)} asChild>
            <Tile
                f={1}
                aspectRatio={1}
                title={productCategory.name}
                imageUrl={productCategory.image.src}
                {...stackProps}
            />
        </Link>
    );
};

export const ProductCategoryTile = memo(ProductCategoryTileBase);
