import { GridTiles } from '@/components/ui/tile/GridTiles';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS } from '@/config/app';
import { useProductCategoryContext } from '@/contexts';
import { JSX, useMemo } from 'react';
import { ScrollView, StackProps, YStack } from 'tamagui';
import { ProductCategoryTile } from './ProductCategoryTile';

export const MAX_CATEGORIES = NUM_CATEGORY_TILE_COLUMNS * NUM_CATEGORY_TILE_ROWS;

export const ProductCategoryTiles = (props: StackProps): JSX.Element => {
    const { productCategories: rootProductCategories } = useProductCategoryContext();

    const productCategories = useMemo(
        () => rootProductCategories.slice(0, MAX_CATEGORIES),
        [rootProductCategories]
    );


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack
                f={1}
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
            </YStack>
        </ScrollView>
    );
};
