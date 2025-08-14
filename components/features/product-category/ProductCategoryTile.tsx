import { Tile } from "@/components/ui/tile/Tile";
import { PRODUCT_CATEGORY_TILE_HEIGHT, PRODUCT_CATEGORY_TILE_WIDTH } from '@/config/app';
import { routes } from '@/config/routes';
import { ProductCategory } from '@/models/ProductCategory';
import { Link } from 'expo-router';
import React, { memo } from 'react';
import { YStackProps } from "tamagui";

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
                w={PRODUCT_CATEGORY_TILE_WIDTH}
                h={PRODUCT_CATEGORY_TILE_HEIGHT}
                title={productCategory.name}
                image={productCategory.image}
                {...stackProps}
            />
        </Link>
    );
};

export const ProductCategoryTile = memo(ProductCategoryTileBase);
