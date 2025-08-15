import { Tile } from "@/components/ui/tile/Tile";
import { PRODUCT_CATEGORY_TILE_HEIGHT, PRODUCT_CATEGORY_TILE_WIDTH } from '@/config/app';
import { useCanonicalNav } from "@/hooks/useCanonicalNav";
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

    const { linkProps } = useCanonicalNav();
    return (
        <Link {...linkProps('product-category', productCategory)} asChild>
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
