import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { useCategories } from '@/hooks/data/Category';
import React, { JSX } from 'react';
import { ScrollView } from 'react-native';
import { ThemeName, YStack } from 'tamagui';
import { CategoryTile } from './CategoryTile';

interface CategoryTilesProps {
    categoryId: number;
    theme?: ThemeName;
}

export const CategoryTiles = ({ theme, categoryId }: CategoryTilesProps): JSX.Element => {
    const { items, isLoading, isFetchingNextPage } = useCategories({ autoload: false });
    const categories = items.filter(cat => cat.parent === categoryId);

    if (isLoading) {
        return <ThemedSpinner size="large" />;
    }

    if (!categories || categories.length === 0) {
        return <></>;
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack theme={theme} flex={1}>
                <GridTiles gap="$2">
                    {categories.map((item) => (
                        <CategoryTile
                            key={item.id}
                            category={item}
                        />
                    ))}
                </GridTiles>
                {isFetchingNextPage && <ThemedSpinner />}
            </YStack>
        </ScrollView>
    );
};
