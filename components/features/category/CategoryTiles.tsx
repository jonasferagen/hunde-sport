import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { useCategories } from '@/hooks/data/Category';
import { Category } from '@/types';
import React, { JSX } from 'react';
import { ScrollView } from 'react-native';
import { ThemeName, YStack } from 'tamagui';
import { CategoryTile } from './CategoryTile';

interface CategoryTilesProps {
    categoryId: number;
    theme?: ThemeName;
}

const NUM_COLUMNS = 3;
const NUM_ROWS = 3;

export const CategoryTiles = ({ theme, categoryId }: CategoryTilesProps): JSX.Element => {
    const { items, isLoading, isFetchingNextPage, isFetching } = useCategories({ autoload: true });
    const MAX_CATEGORIES = NUM_COLUMNS * NUM_ROWS;

    const categories = items.filter((cat: Category) => cat.parent === categoryId).slice(0, MAX_CATEGORIES);
    const placeholders = MAX_CATEGORIES - categories.length;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack f={1} theme={theme}>
                <GridTiles gap="$2">
                    {categories.map((item) => (
                        <CategoryTile
                            key={item.id}
                            category={item}
                        />
                    ))}
                    {placeholders > 0 && Array.from({ length: placeholders }).map((_, index) => (
                        <YStack
                            key={index}
                            f={1}
                            aspectRatio={1}
                            ac="center"
                            jc="center"
                            theme="secondary_soft"
                        >
                            <ThemedSpinner />
                        </YStack>
                    ))}
                </GridTiles>
                {isLoading || isFetchingNextPage || isFetching && <ThemedSpinner />}
            </YStack>
        </ScrollView>
    );
};
