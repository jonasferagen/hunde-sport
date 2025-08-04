
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { useProductCategoryContext } from '@/contexts';
import { JSX, useMemo } from 'react';
import { ScrollView, ThemeName, YStack } from 'tamagui';
import { ProductCategoryTile } from './ProductCategoryTile';

interface ProductCategoryTilesProps {
    theme?: ThemeName;
}

const NUM_COLUMNS = 3;
const NUM_ROWS = 3;
const MAX_CATEGORIES = NUM_COLUMNS * NUM_ROWS;

export const ProductCategoryTiles = ({ theme }: ProductCategoryTilesProps): JSX.Element => {
    const { productCategories: rootProductCategories } = useProductCategoryContext();

    const productCategories = useMemo(
        () => rootProductCategories.slice(0, MAX_CATEGORIES),
        [rootProductCategories]
    );
    const placeholders = MAX_CATEGORIES - productCategories.length;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack f={1} theme={theme}>
                <GridTiles gap="$2">
                    {productCategories.map((item) => (
                        <ProductCategoryTile key={item.id} productCategory={item} />
                    ))}
                    {placeholders > 0 &&
                        Array.from({ length: placeholders }).map((_, index) => (
                            <YStack key={index} />
                        ))}
                </GridTiles>
            </YStack>
        </ScrollView>
    );
};
