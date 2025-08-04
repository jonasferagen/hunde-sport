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

export const CategoryTiles = ({ theme, categoryId }: CategoryTilesProps): JSX.Element => {
    const { items, isLoading, isFetchingNextPage } = useCategories({ autoload: true });
    const categories = items.filter((cat: Category) => cat.parent === categoryId);

    if (isLoading || isFetchingNextPage) {
        return <ThemedSpinner size="large" />;
    }

    if (!categories || categories.length === 0) {
        return <></>;
    }

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
                </GridTiles>
            </YStack>
        </ScrollView>
    );
};
