import { ThemedYStack } from '@/components/ui';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS } from '@/config/app';
import { useProductCategoryContext } from '@/contexts';
import { JSX, useMemo } from 'react';
import { StackProps } from 'tamagui';
import { ProductCategoryTile } from './ProductCategoryTile';

export const MAX_CATEGORIES = NUM_CATEGORY_TILE_COLUMNS * NUM_CATEGORY_TILE_ROWS;

export const ProductCategoryTiles = (props: StackProps): JSX.Element => {
    const { productCategories: rootProductCategories } = useProductCategoryContext();

    const productCategories = useMemo(
        () => rootProductCategories.slice(0, MAX_CATEGORIES),
        [rootProductCategories]
    );

    return (

        <ThemedYStack
            {...props}
        >
            <GridTiles
                gap="$2"
                numColumns={NUM_CATEGORY_TILE_COLUMNS}
                data={productCategories}
                renderItem={({ item }) => (
                    <ProductCategoryTile key={item.id} productCategory={item} />
                )}
            />
        </ThemedYStack>

    );
};
