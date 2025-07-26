import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Category } from '@/models/Category';
import { ThemeVariant } from '@/types';
import React, { JSX } from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { CategoryTile } from './CategoryTile';

interface CategoryTilesProps {
    queryResult: InfiniteListQueryResult<Category>;
    theme?: ThemeVariant;
}

export const CategoryTiles = ({ queryResult, theme = 'primary' }: CategoryTilesProps): JSX.Element => {
    const { items, isLoading, isFetchingNextPage } = queryResult;

    if (isLoading) {
        return <ThemedSpinner size="large" />;
    }

    if (!items || items.length === 0) {
        return <></>;
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack flex={1}>
                <GridTiles gap="$2">
                    {items.map((item) => (
                        <CategoryTile
                            key={item.id}
                            category={item}
                            theme={theme}
                        />
                    ))}
                </GridTiles>
                {isFetchingNextPage && <ThemedSpinner flex={1} ai="center" jc="center" size="small" />}
            </YStack>
        </ScrollView>
    );
};
