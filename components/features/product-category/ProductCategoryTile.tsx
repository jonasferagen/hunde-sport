import { Tile } from "@/components/ui/tile/Tile";
import { ProductCategory } from '@/domain/ProductCategory';
import { useCanonicalNav } from "@/hooks/useCanonicalNav";
import React from 'react';
import { YStackProps } from "tamagui";

interface ProductCategoryTileProps extends Omit<YStackProps, 'children'> {
    productCategory: ProductCategory;
}

export const ProductCategoryTile: React.FC<ProductCategoryTileProps> = React.memo(({
    productCategory,
    ...stackProps
}) => {

    const { to } = useCanonicalNav();
    const onPress = React.useCallback(() => {
        to('product-category', productCategory);
    }, [to, productCategory]);
    return (
        <Tile
            onPress={onPress}
            // remove aspectRatio here — the outer wrapper defines the square
            title={productCategory.name}
            image={productCategory.image}
            {...stackProps}
            // ensure it fills parent
            w="100%"
            h="100%"
            f={1}
        />
    );
});

