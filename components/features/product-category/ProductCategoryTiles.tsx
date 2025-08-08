import { GridTiles } from '@/components/ui/tile/GridTiles';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS } from '@/config/app';
import { useProductCategoryContext } from '@/contexts';
import { JSX, useMemo } from 'react';
import { ScrollView, ThemeName, YStack } from 'tamagui';
import { ProductCategoryTile } from './ProductCategoryTile';

interface ProductCategoryTilesProps {
    theme?: ThemeName;
}
export const MAX_CATEGORIES = NUM_CATEGORY_TILE_COLUMNS * NUM_CATEGORY_TILE_ROWS;

export const ProductCategoryTiles = ({ theme }: ProductCategoryTilesProps): JSX.Element => {
    const { productCategories: rootProductCategories } = useProductCategoryContext();

    const productCategories = useMemo(
        () => rootProductCategories.slice(0, MAX_CATEGORIES),
        [rootProductCategories]
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack
                f={1}
                theme={theme}>
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
