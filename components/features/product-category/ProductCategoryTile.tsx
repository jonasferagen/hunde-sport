import { Tile } from "@/components/ui/tile/Tile";
import { ProductCategory } from '@/domain/ProductCategory';
import { useCanonicalNav } from "@/hooks/useCanonicalNav";
import { Link } from 'expo-router';
import React from 'react';
import { YStackProps } from "tamagui";

interface ProductCategoryTileProps extends Omit<YStackProps, 'children'> {
    productCategory: ProductCategory;
}

export const ProductCategoryTile: React.FC<ProductCategoryTileProps> = ({
    productCategory,
    ...stackProps
}) => {
    const { linkProps } = useCanonicalNav();
    return (
        <Link {...linkProps('product-category', productCategory)} asChild>
            <Tile w="100%"
                h={undefined}
                aspectRatio={1}
                title={productCategory.name}
                image={productCategory.image}
                {...stackProps}
            />
        </Link>
    );
};

