import { CategoryTile } from '@/components/features/category/CategoryTile';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Category } from '@/models/Category';
import { ThemeVariant } from '@/types';
import React, { JSX } from 'react';
import { YStack } from 'tamagui';

interface CategoryTilesProps {
    queryResult: InfiniteListQueryResult<Category>;
    theme?: ThemeVariant;
}

export const CategoryTiles = ({ queryResult, theme = 'primary' }: CategoryTilesProps): JSX.Element => {
    return (
        <YStack style={{ borderColor: 'red', borderWidth: 1 }}>
            <GridTiles
                queryResult={queryResult}
                renderItem={({ item }) => (
                    <CategoryTile
                        category={item}
                        theme={theme}
                    />
                )}
            />
        </YStack>
    );
};
