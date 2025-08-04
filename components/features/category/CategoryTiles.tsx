
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { useCategoryStore } from '@/stores/CategoryStore';
import { JSX, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { ThemeName, YStack } from 'tamagui';
import { CategoryTile } from './CategoryTile';

interface CategoryTilesProps {
    categoryId: number;
    theme?: ThemeName;
}

const NUM_COLUMNS = 3;
const NUM_ROWS = 3;
const MAX_CATEGORIES = NUM_COLUMNS * NUM_ROWS;

export const CategoryTiles = ({ theme, categoryId }: CategoryTilesProps): JSX.Element => {
    const { getSubCategories, isLoading } = useCategoryStore();

    const categories = useMemo(
        () => getSubCategories(categoryId).slice(0, MAX_CATEGORIES),
        [getSubCategories, categoryId]
    );
    const placeholders = MAX_CATEGORIES - categories.length;

    if (isLoading) {
        return <ThemedSpinner />;
    }


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
