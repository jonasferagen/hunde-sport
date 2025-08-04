
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { useCategoryContext } from '@/contexts';
import { JSX, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { ThemeName, YStack } from 'tamagui';
import { CategoryTile } from './CategoryTile';

interface CategoryTilesProps {

    theme?: ThemeName;
}

const NUM_COLUMNS = 3;
const NUM_ROWS = 3;
const MAX_CATEGORIES = NUM_COLUMNS * NUM_ROWS;

export const CategoryTiles = ({ theme }: CategoryTilesProps): JSX.Element => {
    const { categories: rootCategories } = useCategoryContext();

    const categories = useMemo(
        () => rootCategories.slice(0, MAX_CATEGORIES),
        [rootCategories]
    );
    const placeholders = MAX_CATEGORIES - categories.length;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack f={1} theme={theme}>
                <GridTiles gap="$2">
                    {categories.map((item) => (
                        <CategoryTile key={item.id} category={item} />
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
